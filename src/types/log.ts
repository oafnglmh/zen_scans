export interface ProcessingLogItem {
  id: string;
  timestamp: number;
  docId: string;
  fileName: string;
  batchIndex: number;
  stage: string;
  durationMs: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
  retryCount: number;
  model: string;
  provider: string;
  status: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: any;
}
