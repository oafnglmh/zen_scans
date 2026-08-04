import React from 'react';
import { ProcessedDocument } from '../types/student';
import { StatusBadge } from './StatusBadge';
import { FileSpreadsheet, ChevronRight } from 'lucide-react';

interface QueueListProps {
  documents: ProcessedDocument[];
  activeDocId: string | null;
  onSelectDoc: (docId: string) => void;
  onExportExcel: (doc: ProcessedDocument) => void;
}

export const QueueList: React.FC<QueueListProps> = ({
  documents,
  activeDocId,
  onSelectDoc,
  onExportExcel,
}) => {
  if (documents.length === 0) return null;

  return (
    <div style={{ padding: '0 1rem 1.5rem 1.5rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>Hàng Chờ Xử Lý</span>
        <span className="badge" style={{ background: 'rgba(0, 102, 255, 0.15)', color: '#0066FF' }}>
          {documents.length} File
        </span>
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {documents.map((doc) => {
          const isSelected = doc.id === activeDocId;
          const completedBatches = doc.batches.filter(b => b.status === 'completed').length;
          const totalBatches = doc.batches.length || 1;
          const progressPct = doc.stage === 'completed' ? 100 : Math.round((completedBatches / totalBatches) * 100);

          return (
            <div
              key={doc.id}
              className="glass-card"
              style={{
                padding: '1.1rem 1.35rem',
                borderColor: isSelected ? '#00D2B8' : 'var(--border-color)',
                background: isSelected ? 'rgba(0, 210, 184, 0.06)' : 'var(--bg-card)',
                boxShadow: isSelected ? '0 0 20px rgba(0, 210, 184, 0.15)' : 'var(--shadow-main)',
                cursor: 'pointer',
                borderRadius: '16px',
              }}
              onClick={() => onSelectDoc(doc.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>

                {/* Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: '240px' }}>
                  <StatusBadge stage={doc.stage} error={doc.error} cached={doc.cached} />
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{doc.fileName}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {doc.totalPages > 0 ? `${doc.totalPages} Trang` : 'Phân tích'} • {(doc.fileSize / 1024 / 1024).toFixed(2)} MB • {doc.mergedStudents.length} Sinh viên trích xuất
                    </p>
                  </div>
                </div>

                {/* Progress bar / Stats */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right', minWidth: '110px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#00D2B8' }}>
                      {progressPct}% Hoàn thành
                    </span>
                    <div style={{
                      width: '110px',
                      height: '6px',
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      marginTop: '0.3rem',
                    }}>
                      <div style={{
                        width: `${progressPct}%`,
                        height: '100%',
                        background: 'linear-gradient(135deg, #0066FF 0%, #00D2B8 100%)',
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                  </div>

                  {/* Excel Export Button */}
                  {doc.stage === 'completed' && doc.mergedStudents.length > 0 && (
                    <button
                      className="btn-primary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', borderRadius: '10px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onExportExcel(doc);
                      }}
                    >
                      <FileSpreadsheet size={16} /> Xuất Excel
                    </button>
                  )}

                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
