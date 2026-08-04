import { SystemConfig } from './config';
import { BatchExtractionResult } from './student';

export interface InlineFilePayload {
  mimeType: string;
  data: string; // base64 string
}

export interface PageImagePayload {
  pageIndex: number;
  dataUrl: string; // base64 data URL
}

export interface ExtractionRequest {
  pdfFile?: File;
  pdfBase64?: string;
  pageImages?: PageImagePayload[];
  promptText: string;
  config: SystemConfig;
  stage: 'extraction' | 'verification';
  previousJson?: BatchExtractionResult;
}

export interface ExtractionResponse {
  rawJsonString: string;
  parsedResult: BatchExtractionResult;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
  providerName: string;
  modelName: string;
}

export interface AIProvider {
  name: string;
  extract(request: ExtractionRequest): Promise<ExtractionResponse>;
  verify(request: ExtractionRequest): Promise<ExtractionResponse>;
  supportsNativePdf(): boolean;
}
