import { BatchExtractionResult, StudentRecord } from '../types/student';

export interface ValidationIssue {
  type: 'error' | 'warning';
  code: string;
  message: string;
  field?: string;
  stt?: number;
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  normalizedData: BatchExtractionResult;
}

const REQUIRED_FIELDS: (keyof StudentRecord)[] = [
  'stt_trong_file_tong',
  'stt',
  'ho',
  'ten',
  'ngay_sinh',
  'noi_sinh',
  'xep_loai',
  'so_vao_so',
  'so_hieu_bang',
  'quyet_dinh_tot_nghiep_so',
  'quyet_dinh_tot_nghiep_ngay',
  'gioi_tinh',
  'quoc_tich',
  'lop',
  'dao_tao_tu_nam',
  'dao_tao_den_nam',
  'nganh_dao_tao',
  'ma_chuong_trinh_dao_tao',
  'don_vi_cap_bang',
  'ghi_chu',
  'cccd',
  'ngay_cap',
  'noi_cap',
];

export function validateBatchResult(result: BatchExtractionResult, expectedStartStt: number = 1): ValidationResult {
  const issues: ValidationIssue[] = [];

  // Deep clone to normalize
  const normalized: BatchExtractionResult = {
    decision_number: (result.decision_number || '').trim(),
    decision_date: normalizeDate(result.decision_date || ''),
    students: [],
  };

  // Rule: Decision Number numeric cleaning
  if (normalized.decision_number) {
    const numericMatch = normalized.decision_number.match(/\d+/);
    if (numericMatch) {
      normalized.decision_number = numericMatch[0];
    }
  } else {
    issues.push({
      type: 'warning',
      code: 'MISSING_DECISION_NUMBER',
      message: 'Decision number (quuyết định tốt nghiệp số) is missing or empty.',
    });
  }

  // Rule: Decision Date existence & format
  if (!normalized.decision_date) {
    issues.push({
      type: 'warning',
      code: 'MISSING_DECISION_DATE',
      message: 'Decision date (quuyết định tốt nghiệp ngày) is missing or invalid format.',
    });
  }

  if (!result.students || result.students.length === 0) {
    issues.push({
      type: 'error',
      code: 'EMPTY_STUDENTS',
      message: 'No student records found in batch extraction output.',
    });
    return { isValid: false, issues, normalizedData: normalized };
  }

  const seenStt = new Set<number>();
  const seenCertNum = new Set<string>();
  const seenRegNum = new Set<string>();
  const seenCccd = new Set<string>();
  const seenStudentKey = new Set<string>();

  result.students.forEach((s, idx) => {
    const studentStt = Number(s.stt) || (expectedStartStt + idx);

    // Normalize student record
    const normStudent: StudentRecord = {
      stt_trong_file_tong: Number(s.stt_trong_file_tong) || (expectedStartStt + idx),
      stt: studentStt,
      ho: (s.ho || '').trim(),
      ten: (s.ten || '').trim(),
      ngay_sinh: normalizeDate(s.ngay_sinh || ''),
      noi_sinh: (s.noi_sinh || '').trim(),
      xep_loai: (s.xep_loai || '').trim(),
      so_vao_so: (s.so_vao_so || '').trim(),
      so_hieu_bang: (s.so_hieu_bang || '').trim(),
      quyet_dinh_tot_nghiep_so: normalized.decision_number || (s.quyet_dinh_tot_nghiep_so || '').trim(),
      quyet_dinh_tot_nghiep_ngay: normalized.decision_date || normalizeDate(s.quyet_dinh_tot_nghiep_ngay || ''),
      gioi_tinh: normalizeGender(s.gioi_tinh || ''),
      quoc_tich: normalizeNationality(s.quoc_tich || '') || 'Việt Nam',
      lop: (s.lop || '').trim(),
      dao_tao_tu_nam: (s.dao_tao_tu_nam || '').trim(),
      dao_tao_den_nam: (s.dao_tao_den_nam || '').trim(),
      nganh_dao_tao: (s.nganh_dao_tao || '').trim(),
      ma_chuong_trinh_dao_tao: (s.ma_chuong_trinh_dao_tao || '').trim(),
      don_vi_cap_bang: (s.don_vi_cap_bang || '').trim() || 'Đại học Đà Nẵng',
      ghi_chu: (s.ghi_chu || '').trim(),
      cccd: (s.cccd || '').replace(/\D/g, '').trim(),
      ngay_cap: normalizeDate(s.ngay_cap || ''),
      noi_cap: (s.noi_cap || '').trim(),
    };

    // Rule: Null / undefined check on all required fields
    REQUIRED_FIELDS.forEach((key) => {
      if (normStudent[key] === null || normStudent[key] === undefined) {
        (normStudent as any)[key] = '';
      }
    });

    // Rule: Duplicate STT
    if (seenStt.has(studentStt)) {
      issues.push({
        type: 'error',
        code: 'DUPLICATE_STT',
        message: `Duplicate STT #${studentStt} detected.`,
        stt: studentStt,
      });
    } else {
      seenStt.add(studentStt);
    }

    // Rule: Duplicate Certificate Number
    if (normStudent.so_hieu_bang) {
      if (seenCertNum.has(normStudent.so_hieu_bang)) {
        issues.push({
          type: 'warning',
          code: 'DUPLICATE_CERTIFICATE',
          message: `Duplicate certificate number "${normStudent.so_hieu_bang}" on STT #${studentStt}.`,
          stt: studentStt,
          field: 'so_hieu_bang',
        });
      } else {
        seenCertNum.add(normStudent.so_hieu_bang);
      }
    }

    // Rule: Duplicate Registration Number (Số vào sổ)
    if (normStudent.so_vao_so) {
      if (seenRegNum.has(normStudent.so_vao_so)) {
        issues.push({
          type: 'warning',
          code: 'DUPLICATE_REGISTRATION',
          message: `Duplicate registration number "${normStudent.so_vao_so}" on STT #${studentStt}.`,
          stt: studentStt,
          field: 'so_vao_so',
        });
      } else {
        seenRegNum.add(normStudent.so_vao_so);
      }
    }

    // Rule: Duplicate CCCD
    if (normStudent.cccd) {
      if (seenCccd.has(normStudent.cccd)) {
        issues.push({
          type: 'error',
          code: 'DUPLICATE_CCCD',
          message: `Duplicate CCCD "${normStudent.cccd}" on STT #${studentStt}.`,
          stt: studentStt,
          field: 'cccd',
        });
      } else {
        seenCccd.add(normStudent.cccd);
      }
    }

    // Rule: Duplicate Student Name + Date of Birth
    const studentKey = `${normStudent.ho.toLowerCase()} ${normStudent.ten.toLowerCase()}_${normStudent.ngay_sinh}`;
    if (normStudent.ho && normStudent.ten && normStudent.ngay_sinh) {
      if (seenStudentKey.has(studentKey)) {
        issues.push({
          type: 'error',
          code: 'DUPLICATE_STUDENT',
          message: `Duplicate student (${normStudent.ho} ${normStudent.ten}, ${normStudent.ngay_sinh}) on STT #${studentStt}.`,
          stt: studentStt,
        });
      } else {
        seenStudentKey.add(studentKey);
      }
    }

    normalized.students.push(normStudent);
  });

  const hasCriticalErrors = issues.some(i => i.type === 'error');

  return {
    isValid: !hasCriticalErrors,
    issues,
    normalizedData: normalized,
  };
}

/**
 * Normalizes dates to DD/MM/YYYY or YYYY
 * 06.10.1985 -> 06/10/1985
 * 06-10-1985 -> 06/10/1985
 */
export function normalizeDate(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();

  // Year only format e.g., "1985"
  if (/^\d{4}$/.test(trimmed)) {
    return trimmed;
  }

  // DD.MM.YYYY, DD-MM-YYYY, DD/MM/YYYY
  const dateMatch = trimmed.match(/^(\d{1,2})[\.\-\/](\d{1,2})[\.\-\/](\d{4})$/);
  if (dateMatch) {
    const day = dateMatch[1].padStart(2, '0');
    const month = dateMatch[2].padStart(2, '0');
    const year = dateMatch[3];
    return `${day}/${month}/${year}`;
  }

  // YYYY-MM-DD or YYYY.MM.DD
  const isoMatch = trimmed.match(/^(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})$/);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = isoMatch[2].padStart(2, '0');
    const day = isoMatch[3].padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

  return trimmed;
}

function normalizeGender(input: string): string {
  const lower = input.trim().toLowerCase();
  if (lower.includes('nam')) return 'Nam';
  if (lower.includes('nữ') || lower.includes('nu')) return 'Nữ';
  return '';
}

function normalizeNationality(input: string): string {
  if (!input || !input.trim()) return 'Việt Nam';
  const trimmed = input.trim();
  if (trimmed.includes('Việt Nam') || trimmed.includes('Viet Nam') || trimmed.includes('VN') || trimmed.toLowerCase().includes('kinh')) {
    return 'Việt Nam';
  }
  return trimmed || 'Việt Nam';
}
