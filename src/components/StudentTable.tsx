import React from 'react';
import { StudentRecord } from '../types/student';
import { Search, FileSpreadsheet, Edit2, Check } from 'lucide-react';

interface StudentTableProps {
  students: StudentRecord[];
  decisionNumber: string;
  decisionDate: string;
  onUpdateStudent?: (index: number, updated: StudentRecord) => void;
  onExportExcel: () => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  decisionNumber,
  decisionDate,
  onUpdateStudent,
  onExportExcel,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editForm, setEditForm] = React.useState<StudentRecord | null>(null);

  const filtered = students.filter(s => {
    const term = searchTerm.toLowerCase();
    return (
      `${s.ho} ${s.ten}`.toLowerCase().includes(term) ||
      (s.so_hieu_bang || '').toLowerCase().includes(term) ||
      (s.so_vao_so || '').toLowerCase().includes(term) ||
      (s.cccd || '').toLowerCase().includes(term) ||
      (s.noi_sinh || '').toLowerCase().includes(term)
    );
  });

  const handleStartEdit = (idx: number, s: StudentRecord) => {
    setEditingIndex(idx);
    setEditForm({ ...s });
  };

  const handleSaveEdit = (idx: number) => {
    if (editForm && onUpdateStudent) {
      onUpdateStudent(idx, editForm);
    }
    setEditingIndex(null);
    setEditForm(null);
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem', overflow: 'hidden', borderRadius: '20px' }}>
      
      {/* Header Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Danh Sách Sinh Viên Trích Xuất ({students.length})
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Quyết định số: <strong style={{ color: '#0066FF' }}>{decisionNumber || 'N/A'}</strong> • Ngày ký: <strong style={{ color: '#00D2B8' }}>{decisionDate || 'N/A'}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Tìm kiếm sinh viên, CCCD, Bằng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.55rem 0.85rem 0.55rem 2.3rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'rgba(0,0,0,0.2)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                width: '240px',
                outline: 'none',
              }}
            />
          </div>

          {/* Export Excel Button */}
          <button className="btn-primary" onClick={onExportExcel} style={{ borderRadius: '10px' }}>
            <FileSpreadsheet size={16} /> Xuất Excel Chuẩn
          </button>
        </div>

      </div>

      {/* Scrollable Table Container */}
      <div style={{ overflowX: 'auto', maxHeight: '560px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
          
          <thead>
            <tr style={{ background: 'rgba(0, 102, 255, 0.08)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', minWidth: '140px', fontWeight: 800 }}>STT trong file tổng</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', minWidth: '60px', fontWeight: 800 }}>STT</th>
              <th style={{ padding: '0.85rem 0.75rem', minWidth: '140px', fontWeight: 800 }}>Họ</th>
              <th style={{ padding: '0.85rem 0.75rem', minWidth: '100px', fontWeight: 800 }}>Tên</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', minWidth: '110px', fontWeight: 800 }}>Ngày Sinh</th>
              <th style={{ padding: '0.85rem 0.75rem', minWidth: '140px', fontWeight: 800 }}>Nơi Sinh</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', minWidth: '100px', fontWeight: 800 }}>Xếp Loại</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', minWidth: '120px', fontWeight: 800 }}>Số Vào Sổ</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', minWidth: '120px', fontWeight: 800 }}>Số Hiệu Bằng</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', minWidth: '140px', fontWeight: 800 }}>QĐ Số</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', minWidth: '120px', fontWeight: 800 }}>QĐ Ngày</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', minWidth: '90px', fontWeight: 800 }}>Giới Tính</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', minWidth: '100px', fontWeight: 800 }}>Quốc Tịch</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', minWidth: '110px', fontWeight: 800 }}>Lớp</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', minWidth: '120px', fontWeight: 800 }}>Đào Tạo Từ Năm</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', minWidth: '120px', fontWeight: 800 }}>Đào Tạo Đến Năm</th>
              <th style={{ padding: '0.85rem 0.75rem', minWidth: '150px', fontWeight: 800 }}>Ngành Đào Tạo</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', minWidth: '160px', fontWeight: 800 }}>Mã CT Đào Tạo</th>
              <th style={{ padding: '0.85rem 0.75rem', minWidth: '160px', fontWeight: 800 }}>Đơn Vị Cấp Bằng</th>
              <th style={{ padding: '0.85rem 0.75rem', minWidth: '120px', fontWeight: 800 }}>Ghi Chú</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', minWidth: '130px', fontWeight: 800 }}>CCCD</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', minWidth: '110px', fontWeight: 800 }}>Ngày Cấp</th>
              <th style={{ padding: '0.85rem 0.75rem', minWidth: '140px', fontWeight: 800 }}>Nơi Cấp</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', minWidth: '80px', fontWeight: 800 }}>Thao Tác</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s, idx) => {
              const isEditing = editingIndex === idx;

              return (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                  }}
                >
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {s.stt_trong_file_tong || (idx + 1)}
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center', fontWeight: 600 }}>
                    {s.stt || (idx + 1)}
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>
                    {isEditing ? (
                      <input
                        value={editForm?.ho || ''}
                        onChange={(e) => setEditForm({ ...editForm!, ho: e.target.value })}
                        style={{ width: '100%', padding: '0.2rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-primary)' }}
                      />
                    ) : (s.ho || '')}
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: '#0066FF' }}>
                    {isEditing ? (
                      <input
                        value={editForm?.ten || ''}
                        onChange={(e) => setEditForm({ ...editForm!, ten: e.target.value })}
                        style={{ width: '100%', padding: '0.2rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-primary)' }}
                      />
                    ) : (s.ten || '')}
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>{s.ngay_sinh || ''}</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>{s.noi_sinh || ''}</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center', fontWeight: 700, color: '#00D2B8' }}>{s.xep_loai || ''}</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>{s.so_vao_so || ''}</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center', fontWeight: 700, color: '#f59e0b' }}>{s.so_hieu_bang || ''}</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>{s.quyet_dinh_tot_nghiep_so || ''}</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>{s.quyet_dinh_tot_nghiep_ngay || ''}</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>{s.gioi_tinh || ''}</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>{s.quoc_tich || ''}</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>{s.lop || ''}</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>{s.dao_tao_tu_nam || ''}</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>{s.dao_tao_den_nam || ''}</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>{s.nganh_dao_tao || ''}</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>{s.ma_chuong_trinh_dao_tao || ''}</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#00D2B8', fontWeight: 600 }}>{s.don_vi_cap_bang || ''}</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>{s.ghi_chu || ''}</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>{s.cccd || ''}</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>{s.ngay_cap || ''}</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>{s.noi_cap || ''}</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>
                    {isEditing ? (
                      <button onClick={() => handleSaveEdit(idx)} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', cursor: 'pointer' }}>
                        <Check size={14} />
                      </button>
                    ) : (
                      <button onClick={() => handleStartEdit(idx, s)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <Edit2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

    </div>
  );
};
