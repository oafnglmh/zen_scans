import React from 'react';
import { X, UploadCloud, Cpu, Table, FileSpreadsheet, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.25s ease-out',
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '24px',
          padding: '2rem',
          background: 'var(--bg-card)',
          border: '1px solid rgba(0, 210, 184, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 102, 255, 0.25)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img src="/images/logo_zenscan.png" alt="ZenScan Logo" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg, #0066FF 0%, #00D2B8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Hướng Dẫn Sử Dụng ZenScan AI
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Quy trình trích xuất PDF Bằng tốt nghiệp sang Excel 23 cột siêu tốc
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '0.5rem', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.08)' }}
            title="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Steps Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>

          {/* Step 1 */}
          <div style={{ background: 'rgba(0, 102, 255, 0.06)', border: '1px solid rgba(0, 102, 255, 0.2)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #0066FF, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
                1
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Tải File PDF Lên</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Kéo thả hoặc chọn 1/nhiều file PDF Bằng tốt nghiệp hoặc Quyết định tốt nghiệp (chấp nhận cả file Scan hoặc file PDF điện tử).
            </p>
          </div>

          {/* Step 2 */}
          <div style={{ background: 'rgba(0, 210, 184, 0.06)', border: '1px solid rgba(0, 210, 184, 0.2)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #00D2B8, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
                2
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Xử Lý Multimodal AI</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              ZenScan chia nhỏ file thành các gói batch 10-15 trang, tự động đọc hình ảnh và trích xuất chuẩn 23 cột thông tin bằng AI Gemini/Claude.
            </p>
          </div>

          {/* Step 3 */}
          <div style={{ background: 'rgba(124, 58, 237, 0.06)', border: '1px solid rgba(124, 58, 237, 0.2)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #7C3AED, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
                3
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Xem & Sửa Dữ Liệu</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Xem bảng danh sách trực quan, tìm kiếm theo tên/CCCD, chỉnh sửa từng ô thông tin trực tiếp nếu phát hiện sai sót.
            </p>
          </div>

          {/* Step 4 */}
          <div style={{ background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
                4
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Tải File Excel Chuẩn</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Nhấn "Export Excel" để tải file `.xlsx` 23 cột hoàn chỉnh, chuẩn font Times New Roman 12pt, cố định dòng tiêu đề & AutoFilter!
            </p>
          </div>

        </div>

        {/* Highlights Banner */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1rem 1.25rem', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={18} color="#00D2B8" />
            <span>Mặc định đơn vị cấp bằng: <strong style={{ color: '#00D2B8' }}>Đại học Đà Nẵng</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Zap size={18} color="#f59e0b" />
            <span>Tự động tối ưu chi phí: <strong style={{ color: '#f59e0b' }}>~6 VNĐ / sinh viên</strong></span>
          </div>
        </div>

        {/* Footer Close Action */}
        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <button className="btn-primary" onClick={onClose} style={{ padding: '0.65rem 1.75rem', borderRadius: '12px' }}>
            Đã Hiểu & Bắt Đầu
          </button>
        </div>

      </div>
    </div>
  );
};
