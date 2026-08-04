export interface StudentRecord {
  stt_trong_file_tong: number;
  stt: number;
  ho: string;
  ten: string;
  ngay_sinh: string;
  noi_sinh: string;
  xep_loai: string;
  so_vao_so: string;
  so_hieu_bang: string;
  quyet_dinh_tot_nghiep_so: string;
  quyet_dinh_tot_nghiep_ngay: string;
  gioi_tinh: string;
  quoc_tich: string;
  lop: string;
  dao_tao_tu_nam: string;
  dao_tao_den_nam: string;
  nganh_dao_tao: string;
  ma_chuong_trinh_dao_tao: string;
  don_vi_cap_bang: string;
  ghi_chu: string;
  cccd: string;
  ngay_cap: string;
  noi_cap: string;
}

export interface BatchExtractionResult {
  decision_number: string;
  decision_date: string;
  students: StudentRecord[];
}

export interface BatchProcessState {
  batchIndex: number;
  startPage: number;
  endPage: number;
  status: 'pending' | 'analyzing' | 'extracting' | 'validating' | 'verifying' | 'retrying' | 'completed' | 'failed';
  retryCount: number;
  errorMessage?: string;
  result?: BatchExtractionResult;
  tokensUsed?: number;
  durationMs?: number;
  verifiedByAI?: boolean;
}

export type ProcessingStage =
  | 'idle'
  | 'uploading'
  | 'analyzing_pdf'
  | 'splitting_batches'
  | 'extracting'
  | 'validating'
  | 'verifying'
  | 'retrying'
  | 'merging'
  | 'exporting_excel'
  | 'completed'
  | 'failed';

export interface ProcessedDocument {
  id: string;
  fileHash: string; // SHA-256
  fileName: string;
  fileSize: number;
  totalPages: number;
  estimatedTokens: number;
  isDigital: boolean;
  averageComplexity: number;
  batches: BatchProcessState[];
  mergedStudents: StudentRecord[];
  decisionNumber: string;
  decisionDate: string;
  stage: ProcessingStage;
  error?: string;
  cached?: boolean;
  totalTokens: number;
  totalCostUsd: number;
  totalDurationMs: number;
  createdAt: number;
  updatedAt: number;
}
