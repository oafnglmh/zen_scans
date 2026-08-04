import React from 'react';
import { UploadCloud, FileText, Sparkles } from 'lucide-react';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  isDisabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected, isDisabled }) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDisabled) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isDisabled) return;

    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf' || file.name.endsWith('.pdf')
    );
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className="glass-card"
      style={{
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        border: `2px dashed ${isDragOver ? '#00D2B8' : 'rgba(0, 102, 255, 0.25)'}`,
        background: isDragOver ? 'rgba(0, 210, 184, 0.08)' : 'var(--bg-card)',
        boxShadow: isDragOver ? '0 0 30px rgba(0, 210, 184, 0.2)' : 'var(--shadow-main)',
        transition: 'all 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 1rem 1.5rem 1.5rem',
        borderRadius: '24px',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,application/pdf"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={isDisabled}
      />

      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.15), rgba(0, 210, 184, 0.15))',
        padding: '1.25rem',
        borderRadius: '50%',
        marginBottom: '1rem',
        color: '#00D2B8',
        boxShadow: '0 8px 20px rgba(0, 102, 255, 0.2)',
      }}>
        <UploadCloud size={38} />
      </div>

      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
        Kéo thả hoặc Tải lên File PDF Bằng Tốt Nghiệp
      </h3>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 1.25rem', lineHeight: 1.5 }}>
        ZenScan hỗ trợ tải 1 hoặc nhiều file PDF cùng lúc. Tự động đọc hình ảnh và trích xuất chuẩn 23 cột thông tin bằng Multimodal AI.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <button type="button" className="btn-primary" disabled={isDisabled} style={{ padding: '0.7rem 1.6rem', borderRadius: '12px' }}>
          <FileText size={18} /> Chọn File PDF Từ Máy
        </button>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Dung lượng tối đa 50MB/file</span>
      </div>
    </div>
  );
};
