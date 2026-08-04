import * as pdfjsLib from 'pdfjs-dist';

// Set up worker source dynamically using CDN or pdfjs-dist build
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export interface PdfAnalysis {
  totalPages: number;
  fileSizeBytes: number;
  estimatedTokens: number;
  isDigital: boolean;
  averageComplexity: number;
  batches: { batchIndex: number; startPage: number; endPage: number }[];
}

export async function analyzePdf(file: File, maxPagesPerBatch: number = 15): Promise<PdfAnalysis> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;

  let totalTextCharCount = 0;
  const pagesToSample = Math.min(totalPages, 5);

  for (let i = 1; i <= pagesToSample; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    totalTextCharCount += pageText.length;
  }

  const isDigital = totalTextCharCount > 100;
  // Estimated ~2,000 tokens per dense student table page
  const estimatedTokensPerPage = isDigital ? 2200 : 3500;
  const estimatedTokens = totalPages * estimatedTokensPerPage;

  const averageComplexity = Number((Math.min(10, Math.max(1, (file.size / (totalPages * 1024 * 100)) * 5))).toFixed(1));

  // Determine batches
  const batches: { batchIndex: number; startPage: number; endPage: number }[] = [];

  if (totalPages <= 20) {
    batches.push({ batchIndex: 0, startPage: 1, endPage: totalPages });
  } else {
    let currentStart = 1;
    let batchIdx = 0;
    while (currentStart <= totalPages) {
      const currentEnd = Math.min(currentStart + maxPagesPerBatch - 1, totalPages);
      batches.push({
        batchIndex: batchIdx,
        startPage: currentStart,
        endPage: currentEnd,
      });
      currentStart = currentEnd + 1;
      batchIdx++;
    }
  }

  return {
    totalPages,
    fileSizeBytes: file.size,
    estimatedTokens,
    isDigital,
    averageComplexity,
    batches,
  };
}

/**
 * Render specific PDF pages to base64 images
 */
export async function renderPdfPagesToImages(
  file: File,
  startPage: number,
  endPage: number,
  scale: number = 2.0
): Promise<{ pageIndex: number; dataUrl: string }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const results: { pageIndex: number; dataUrl: string }[] = [];

  for (let p = startPage; p <= endPage; p++) {
    const page = await pdfDoc.getPage(p);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (!context) continue;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    results.push({
      pageIndex: p,
      dataUrl,
    });
  }

  return results;
}

/**
 * Extract raw PDF base64 payload for native processing
 */
export async function getPdfBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
