import { SystemConfig } from '../types/config';
import { BatchExtractionResult, BatchProcessState } from '../types/student';
import { ExtractionRequest } from '../types/provider';
import { GeminiProvider } from './providers/geminiProvider';
import { ClaudeProvider } from './providers/claudeProvider';
import { PROMPTS_REGISTRY } from '../config/prompts';
import { validateBatchResult } from './validator';
import { getPdfBase64, renderPdfPagesToImages } from './pdfAnalyzer';
import { calculateCost } from './costCalculator';
import { addLogItem } from './dbService';

export interface ProcessBatchOptions {
  file: File;
  batchState: BatchProcessState;
  config: SystemConfig;
  docId: string;
  onStateUpdate: (updatedState: BatchProcessState) => void;
}

export async function processSingleBatch(options: ProcessBatchOptions): Promise<BatchExtractionResult> {
  const { file, batchState, config, docId, onStateUpdate } = options;
  const provider = config.provider === 'claude' ? new ClaudeProvider() : new GeminiProvider();
  const promptDef = PROMPTS_REGISTRY[config.promptVersion] || PROMPTS_REGISTRY['v2.0'];

  let attempt = 0;
  let lastError = '';
  let currentState = { ...batchState };

  // Prepare payload once
  let pdfBase64: string | undefined;
  let pageImages: { pageIndex: number; dataUrl: string }[] | undefined;

  if (provider.supportsNativePdf() && config.preferNativePdf) {
    pdfBase64 = await getPdfBase64(file);
  } else {
    pageImages = await renderPdfPagesToImages(file, currentState.startPage, currentState.endPage);
  }

  while (attempt <= config.maxRetries) {
    currentState.retryCount = attempt;

    try {
      if (attempt > 0) {
        currentState.status = 'retrying';
        onStateUpdate({ ...currentState });
      }

      // --- STAGE 1: EXTRACTION ---
      currentState.status = 'extracting';
      onStateUpdate({ ...currentState });

      let promptText = promptDef.extractionPrompt;
      if (attempt > 0 && lastError) {
        promptText += `\n\n[RETRY ATTEMPT #${attempt} NOTICE]: Previous extraction failed validation checks with the following issues: ${lastError}. Please inspect the document very carefully, fix STT continuity, ensure exact student count, correct date formats to DD/MM/YYYY, and return clean raw JSON without markdown.`;
      }

      const req: ExtractionRequest = {
        pdfFile: file,
        pdfBase64,
        pageImages,
        promptText,
        config,
        stage: 'extraction',
      };

      const extractResponse = await provider.extract(req);
      let batchResult = extractResponse.parsedResult;
      let totalInputTokens = extractResponse.inputTokens;
      let totalOutputTokens = extractResponse.outputTokens;

      // --- STAGE 2: VALIDATION ---
      currentState.status = 'validating';
      onStateUpdate({ ...currentState });

      const startStt = currentState.startPage; // estimate or STT tracking
      const valResult = validateBatchResult(batchResult, startStt);

      if (!valResult.isValid) {
        const errorMsgs = valResult.issues.filter(i => i.type === 'error').map(i => i.message).join('; ');
        throw new Error(`Validation failed: ${errorMsgs}`);
      }

      batchResult = valResult.normalizedData;

      // --- STAGE 3: AI VERIFICATION LAYER (Pass 2) ---
      if (config.enableAiVerification) {
        currentState.status = 'verifying';
        onStateUpdate({ ...currentState });

        const verifyPromptText = promptDef.verificationPrompt.replace('__CANDIDATE_JSON__', JSON.stringify(batchResult, null, 2));

        const verifyReq: ExtractionRequest = {
          pdfFile: file,
          pdfBase64,
          pageImages,
          promptText: verifyPromptText,
          config,
          stage: 'verification',
          previousJson: batchResult,
        };

        try {
          const verifyResponse = await provider.verify(verifyReq);
          const verifiedVal = validateBatchResult(verifyResponse.parsedResult, startStt);
          if (verifiedVal.isValid) {
            batchResult = verifiedVal.normalizedData;
            currentState.verifiedByAI = true;
          }
          totalInputTokens += verifyResponse.inputTokens;
          totalOutputTokens += verifyResponse.outputTokens;
        } catch (vErr: any) {
          console.warn('AI Verification pass warning (retaining Pass 1 validated result):', vErr.message);
        }
      }

      // Success!
      const totalTokens = totalInputTokens + totalOutputTokens;
      const estimatedCost = calculateCost(
        config.provider === 'claude' ? config.claudeModel : config.geminiModel,
        totalInputTokens,
        totalOutputTokens
      );

      currentState.status = 'completed';
      currentState.result = batchResult;
      currentState.tokensUsed = totalTokens;
      currentState.durationMs = extractResponse.durationMs;
      onStateUpdate({ ...currentState });

      // Audit Log
      await addLogItem({
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
        docId,
        fileName: file.name,
        batchIndex: currentState.batchIndex,
        stage: 'batch_complete',
        durationMs: extractResponse.durationMs,
        inputTokens: totalInputTokens,
        outputTokens: totalOutputTokens,
        estimatedCostUsd: estimatedCost,
        retryCount: attempt,
        model: config.provider === 'claude' ? config.claudeModel : config.geminiModel,
        provider: provider.name,
        status: 'success',
        message: `Batch #${currentState.batchIndex + 1} (Pages ${currentState.startPage}-${currentState.endPage}) extracted successfully with ${batchResult.students.length} students.`,
      });

      return batchResult;

    } catch (err: any) {
      lastError = err.message;
      attempt++;

      if (attempt > config.maxRetries) {
        currentState.status = 'failed';
        currentState.errorMessage = `Failed after ${config.maxRetries} retries. Last error: ${err.message}`;
        onStateUpdate({ ...currentState });

        await addLogItem({
          id: `log_err_${Date.now()}`,
          timestamp: Date.now(),
          docId,
          fileName: file.name,
          batchIndex: currentState.batchIndex,
          stage: 'batch_failed',
          durationMs: 0,
          inputTokens: 0,
          outputTokens: 0,
          estimatedCostUsd: 0,
          retryCount: attempt - 1,
          model: config.provider === 'claude' ? config.claudeModel : config.geminiModel,
          provider: provider.name,
          status: 'error',
          message: currentState.errorMessage,
        });

        throw new Error(currentState.errorMessage);
      }
    }
  }

  throw new Error('Batch processing failed unexpectedly.');
}
