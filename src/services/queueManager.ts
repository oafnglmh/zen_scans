import { ProcessedDocument, StudentRecord, ProcessingStage } from '../types/student';
import { SystemConfig } from '../types/config';
import { calculateFileHash } from './cryptoService';
import { getCachedDocument, setCachedDocument, saveSessionState, getSessionState } from './dbService';
import { analyzePdf } from './pdfAnalyzer';
import { processSingleBatch } from './aiExtractor';
import { generateExcelWorkbook, downloadBlob } from './excelExporter';

export interface QueueManagerOptions {
  config: SystemConfig;
  onDocumentUpdate: (doc: ProcessedDocument) => void;
}

export class QueueManager {
  private config: SystemConfig;
  private onDocumentUpdate: (doc: ProcessedDocument) => void;
  private activeJobs = new Map<string, boolean>();

  constructor(options: QueueManagerOptions) {
    this.config = options.config;
    this.onDocumentUpdate = options.onDocumentUpdate;
  }

  public updateConfig(newConfig: SystemConfig) {
    this.config = newConfig;
  }

  public async addFileToQueue(file: File): Promise<ProcessedDocument> {
    const fileHash = await calculateFileHash(file);
    const docId = `doc_${fileHash.substring(0, 12)}_${Date.now()}`;

    // 1. Check SHA-256 cache
    const cached = await getCachedDocument(fileHash);
    if (cached) {
      const cachedDoc: ProcessedDocument = {
        id: docId,
        fileHash,
        fileName: file.name,
        fileSize: file.size,
        totalPages: 0,
        estimatedTokens: cached.totalTokens || 0,
        isDigital: true,
        averageComplexity: 1,
        batches: [],
        mergedStudents: cached.mergedStudents,
        decisionNumber: cached.decisionNumber,
        decisionDate: cached.decisionDate,
        stage: 'completed',
        cached: true,
        totalTokens: cached.totalTokens || 0,
        totalCostUsd: 0,
        totalDurationMs: 0,
        createdAt: cached.createdAt,
        updatedAt: Date.now(),
      };
      this.onDocumentUpdate(cachedDoc);
      return cachedDoc;
    }

    // 2. Check interrupted session state
    const existingSession = await getSessionState(docId);
    if (existingSession && existingSession.stage !== 'completed' && existingSession.stage !== 'failed') {
      this.onDocumentUpdate(existingSession);
      this.processDocument(file, existingSession);
      return existingSession;
    }

    // 3. New Document Analysis
    const initialDoc: ProcessedDocument = {
      id: docId,
      fileHash,
      fileName: file.name,
      fileSize: file.size,
      totalPages: 0,
      estimatedTokens: 0,
      isDigital: true,
      averageComplexity: 1,
      batches: [],
      mergedStudents: [],
      decisionNumber: '',
      decisionDate: '',
      stage: 'analyzing_pdf',
      totalTokens: 0,
      totalCostUsd: 0,
      totalDurationMs: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.onDocumentUpdate(initialDoc);

    const pdfAnalysis = await analyzePdf(file, this.config.maxPagesPerBatch);

    const docWithBatches: ProcessedDocument = {
      ...initialDoc,
      totalPages: pdfAnalysis.totalPages,
      estimatedTokens: pdfAnalysis.estimatedTokens,
      isDigital: pdfAnalysis.isDigital,
      averageComplexity: pdfAnalysis.averageComplexity,
      stage: 'splitting_batches',
      batches: pdfAnalysis.batches.map(b => ({
        batchIndex: b.batchIndex,
        startPage: b.startPage,
        endPage: b.endPage,
        status: 'pending',
        retryCount: 0,
      })),
      updatedAt: Date.now(),
    };

    await saveSessionState(docWithBatches);
    this.onDocumentUpdate(docWithBatches);

    // Trigger process
    this.processDocument(file, docWithBatches);
    return docWithBatches;
  }

  public async processDocument(file: File, docState: ProcessedDocument) {
    if (this.activeJobs.get(docState.id)) return;
    this.activeJobs.set(docState.id, true);

    let currentDoc: ProcessedDocument = { ...docState, stage: 'extracting' };
    this.onDocumentUpdate(currentDoc);
    await saveSessionState(currentDoc);

    const pendingBatches = currentDoc.batches.filter(b => b.status !== 'completed');

    try {
      const startTime = Date.now();

      // Process pending batches sequentially or in parallel batches
      for (const batch of pendingBatches) {
        if (batch.status === 'completed') continue;

        await processSingleBatch({
          file,
          batchState: batch,
          config: this.config,
          docId: currentDoc.id,
          onStateUpdate: (updatedBatch) => {
            const batchIdx = currentDoc.batches.findIndex(b => b.batchIndex === updatedBatch.batchIndex);
            if (batchIdx !== -1) {
              currentDoc.batches[batchIdx] = updatedBatch;
              currentDoc.updatedAt = Date.now();
              this.onDocumentUpdate({ ...currentDoc });
              saveSessionState(currentDoc);
            }
          },
        });
      }

      // Check if all batches completed
      const allCompleted = currentDoc.batches.every(b => b.status === 'completed');
      if (!allCompleted) {
        throw new Error('One or more batches failed during document processing.');
      }

      // Merge stage
      currentDoc.stage = 'merging';
      this.onDocumentUpdate({ ...currentDoc });

      const mergedStudents: StudentRecord[] = [];
      let globalDecisionNumber = '';
      let globalDecisionDate = '';

      let runningStt = 1;
      currentDoc.batches.forEach(b => {
        if (b.result) {
          if (!globalDecisionNumber && b.result.decision_number) globalDecisionNumber = b.result.decision_number;
          if (!globalDecisionDate && b.result.decision_date) globalDecisionDate = b.result.decision_date;

          b.result.students.forEach(s => {
            mergedStudents.push({
              ...s,
              stt: runningStt++,
            });
          });
        }
      });

      const totalDuration = Date.now() - startTime;
      const totalTokens = currentDoc.batches.reduce((acc, b) => acc + (b.tokensUsed || 0), 0);

      currentDoc = {
        ...currentDoc,
        mergedStudents,
        decisionNumber: globalDecisionNumber,
        decisionDate: globalDecisionDate,
        stage: 'completed',
        totalDurationMs: totalDuration,
        totalTokens,
        updatedAt: Date.now(),
      };

      await saveSessionState(currentDoc);
      await setCachedDocument({
        fileHash: currentDoc.fileHash,
        fileName: currentDoc.fileName,
        mergedStudents: currentDoc.mergedStudents,
        decisionNumber: currentDoc.decisionNumber,
        decisionDate: currentDoc.decisionDate,
        totalTokens: currentDoc.totalTokens,
        createdAt: Date.now(),
      });

      this.onDocumentUpdate(currentDoc);

    } catch (err: any) {
      currentDoc = {
        ...currentDoc,
        stage: 'failed',
        error: err.message,
        updatedAt: Date.now(),
      };
      await saveSessionState(currentDoc);
      this.onDocumentUpdate(currentDoc);
    } finally {
      this.activeJobs.delete(docState.id);
    }
  }

  public async exportDocumentToExcel(doc: ProcessedDocument) {
    if (!doc.mergedStudents || doc.mergedStudents.length === 0) return;
    const excelBlob = await generateExcelWorkbook(doc.mergedStudents, this.config, `${doc.fileName}.xlsx`);
    const exportFileName = doc.fileName.replace(/\.pdf$/i, '') + '_Cap_Bang.xlsx';
    downloadBlob(excelBlob, exportFileName);
  }
}
