import React from 'react';
import { X, Trash2, Terminal, DollarSign, Clock, Layers } from 'lucide-react';
import { getAllLogs, clearAllLogs } from '../services/dbService';
import { ProcessingLogItem } from '../types/log';

interface LogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogsModal: React.FC<LogsModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = React.useState<ProcessingLogItem[]>([]);

  const fetchLogs = async () => {
    const list = await getAllLogs();
    setLogs(list);
  };

  React.useEffect(() => {
    if (isOpen) fetchLogs();
  }, [isOpen]);

  if (!isOpen) return null;

  const totalCost = logs.reduce((acc, l) => acc + (l.estimatedCostUsd || 0), 0);
  const totalTokens = logs.reduce((acc, l) => acc + (l.inputTokens + l.outputTokens), 0);

  const handleClear = async () => {
    await clearAllLogs();
    setLogs([]);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(6px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '850px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Terminal size={20} color="#3b82f6" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>System Processing Logs & API Audit</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={handleClear} style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: '#ef4444' }}>
              <Trash2 size={14} /> Clear Logs
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Audit Metrics Banner */}
        <div style={{
          padding: '1rem 1.5rem',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1rem',
          textAlign: 'center',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Audit Logs</span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{logs.length}</h4>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Tokens Used</span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#60a5fa' }}>{totalTokens.toLocaleString()}</h4>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Est. Total API Cost</span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>${totalCost.toFixed(5)}</h4>
          </div>
        </div>

        {/* Logs List */}
        <div style={{ padding: '1rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {logs.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No processing logs recorded yet.</p>
          ) : (
            logs.map(log => (
              <div
                key={log.id}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: log.status === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.2)',
                  border: `1px solid ${log.status === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-color)'}`,
                  fontSize: '0.82rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 700, color: log.status === 'error' ? '#f87171' : '#60a5fa' }}>
                    [{log.provider} / {log.model}] Batch #{log.batchIndex + 1}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(log.timestamp).toLocaleTimeString()} • {log.durationMs}ms
                  </span>
                </div>
                
                <p style={{ margin: 0, color: 'var(--text-primary)' }}>{log.message}</p>
                
                <div style={{ marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem' }}>
                  <span>Input: {log.inputTokens} tok</span>
                  <span>Output: {log.outputTokens} tok</span>
                  <span>Retries: {log.retryCount}</span>
                  <span>Cost: ${log.estimatedCostUsd.toFixed(6)}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
