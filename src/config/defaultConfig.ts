import { SystemConfig } from '../types/config';

export const DEFAULT_CONFIG: SystemConfig = {
  maxPagesPerBatch: 15,
  maxRetries: 3,
  maxParallelBatches: 3,
  maxFileSizeBytes: 50 * 1024 * 1024, // 50MB
  provider: 'gemini',
  geminiModel: 'gemini-3.6-flash',
  claudeModel: 'claude-3-5-sonnet-20241022',
  geminiApiKey: 'AIzaSyAJYc0rrsQPE7abMECYVyRXO9PlH9UDV4A',
  claudeApiKey: '',
  temperature: 0.1,
  topP: 0.95,
  topK: 40,
  timeoutMs: 120000,
  exportFont: 'Times New Roman',
  exportFontSize: 12,
  sheetName: 'Danh sách cấp bằng',
  promptVersion: 'v2.0',
  preferNativePdf: true,
  enableAiVerification: false,
};

export const AVAILABLE_MODELS = {
  gemini: [
    { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash (High Performance)' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Deep Reasoning)' },
  ],
  claude: [
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
  ]
};
