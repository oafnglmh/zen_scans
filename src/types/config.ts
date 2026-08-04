export type AIProviderType = 'gemini' | 'claude';

export interface SystemConfig {
  maxPagesPerBatch: number;      // default: 15 (range 10-20)
  maxRetries: number;            // default: 3
  maxParallelBatches: number;    // default: 3
  maxFileSizeBytes: number;      // default: 50MB
  provider: AIProviderType;
  geminiModel: string;           // default: 'gemini-2.5-flash'
  claudeModel: string;           // default: 'claude-3-5-sonnet-20241022'
  geminiApiKey: string;
  claudeApiKey: string;
  temperature: number;           // default: 0.1
  topP: number;                  // default: 0.95
  topK: number;                  // default: 40
  timeoutMs: number;             // default: 120000 (2 min)
  exportFont: string;            // default: 'Times New Roman'
  exportFontSize: number;        // default: 12
  sheetName: string;             // default: 'Danh sách cấp bằng'
  promptVersion: string;         // default: 'v2.0'
  preferNativePdf: boolean;      // default: true
  enableAiVerification: boolean; // default: true
}
