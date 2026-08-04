import ExcelJS from 'exceljs';
import { StudentRecord } from '../types/student';
import { SystemConfig } from '../types/config';

export async function generateExcelWorkbook(
  students: StudentRecord[],
  config: SystemConfig,
  fileName: string = 'Danh_Sach_Cap_Bang.xlsx'
): Promise<Blob> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Vietnamese Graduation Certificate Extractor AI';
  workbook.lastModifiedBy = 'Vietnamese Graduation Certificate Extractor AI';
  workbook.created = new Date();

  const fontName = config.exportFont || 'Times New Roman';
  const fontSize = config.exportFontSize || 12;
  const sheetName = config.sheetName || 'Danh sách cấp bằng';

  const worksheet = workbook.addWorksheet(sheetName, {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  const columns = [
    { header: 'STT trong file tổng', key: 'stt_trong_file_tong', width: 18, align: 'center' },
    { header: 'STT', key: 'stt', width: 8, align: 'center' },
    { header: 'Họ', key: 'ho', width: 22, align: 'left' },
    { header: 'Tên', key: 'ten', width: 14, align: 'left' },
    { header: 'Ngày sinh', key: 'ngay_sinh', width: 14, align: 'center' },
    { header: 'Nơi sinh', key: 'noi_sinh', width: 25, align: 'left' },
    { header: 'Xếp loại', key: 'xep_loai', width: 14, align: 'center' },
    { header: 'Số vào sổ', key: 'so_vao_so', width: 16, align: 'center' },
    { header: 'Số hiệu Bằng', key: 'so_hieu_bang', width: 18, align: 'center' },
    { header: 'Quyết định tốt nghiệp số', key: 'quyet_dinh_tot_nghiep_so', width: 25, align: 'center' },
    { header: 'Quyết định tốt nghiệp ngày', key: 'quyet_dinh_tot_nghiep_ngay', width: 25, align: 'center' },
    { header: 'Giới tính', key: 'gioi_tinh', width: 12, align: 'center' },
    { header: 'Quốc tịch', key: 'quoc_tich', width: 14, align: 'center' },
    { header: 'Lớp', key: 'lop', width: 18, align: 'center' },
    { header: 'Đào tạo từ năm', key: 'dao_tao_tu_nam', width: 16, align: 'center' },
    { header: 'Đào tạo đến năm', key: 'dao_tao_den_nam', width: 16, align: 'center' },
    { header: 'Ngành Đào tạo', key: 'nganh_dao_tao', width: 22, align: 'left' },
    { header: 'Mã Chương trình đào tạo', key: 'ma_chuong_trinh_dao_tao', width: 22, align: 'center' },
    { header: 'Đơn vị cấp bằng', key: 'don_vi_cap_bang', width: 25, align: 'left' },
    { header: 'Ghi chú', key: 'ghi_chu', width: 20, align: 'left' },
    { header: 'CCCD', key: 'cccd', width: 18, align: 'center' },
    { header: 'Ngày cấp', key: 'ngay_cap', width: 14, align: 'center' },
    { header: 'Nơi cấp', key: 'noi_cap', width: 22, align: 'left' },
  ];

  worksheet.columns = columns.map(c => ({
    header: c.header,
    key: c.key,
    width: c.width,
  }));

  // Enable AutoFilter
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: columns.length },
  };

  // Header styling
  const headerRow = worksheet.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.font = {
      name: fontName,
      size: fontSize,
      bold: true,
      color: { argb: 'FF1E293B' },
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE2E8F0' },
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF94A3B8' } },
      left: { style: 'thin', color: { argb: 'FF94A3B8' } },
      bottom: { style: 'medium', color: { argb: 'FF64748B' } },
      right: { style: 'thin', color: { argb: 'FF94A3B8' } },
    };
  });

  // Populate data rows
  students.forEach((student, index) => {
    const row = worksheet.addRow({
      stt_trong_file_tong: student.stt_trong_file_tong || (index + 1),
      stt: student.stt || (index + 1),
      ho: student.ho || '',
      ten: student.ten || '',
      ngay_sinh: student.ngay_sinh || '',
      noi_sinh: student.noi_sinh || '',
      xep_loai: student.xep_loai || '',
      so_vao_so: student.so_vao_so || '',
      so_hieu_bang: student.so_hieu_bang || '',
      quyet_dinh_tot_nghiep_so: student.quyet_dinh_tot_nghiep_so || '',
      quyet_dinh_tot_nghiep_ngay: student.quyet_dinh_tot_nghiep_ngay || '',
      gioi_tinh: student.gioi_tinh || '',
      quoc_tich: student.quoc_tich || '',
      lop: student.lop || '',
      dao_tao_tu_nam: student.dao_tao_tu_nam || '',
      dao_tao_den_nam: student.dao_tao_den_nam || '',
      nganh_dao_tao: student.nganh_dao_tao || '',
      ma_chuong_trinh_dao_tao: student.ma_chuong_trinh_dao_tao || '',
      don_vi_cap_bang: student.don_vi_cap_bang || '',
      ghi_chu: student.ghi_chu || '',
      cccd: student.cccd || '',
      ngay_cap: student.ngay_cap || '',
      noi_cap: student.noi_cap || '',
    });

    row.height = 22;

    row.eachCell((cell, colNumber) => {
      const colDef = columns[colNumber - 1];
      cell.font = {
        name: fontName,
        size: fontSize,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: (colDef?.align as any) || 'left',
        wrapText: true,
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
    });
  });

  // Auto column width calculation adjustment
  worksheet.columns.forEach((col) => {
    let maxLen = col.header ? col.header.toString().length : 10;
    col.eachCell?.({ includeEmpty: false }, (cell) => {
      const cellLen = cell.value ? cell.value.toString().length : 0;
      if (cellLen > maxLen) maxLen = cellLen;
    });
    col.width = Math.min(Math.max(maxLen + 4, 10), 45);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
