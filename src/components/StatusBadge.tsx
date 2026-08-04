import React from 'react';
import { ProcessingStage } from '../types/student';
import { Loader2, CheckCircle2, AlertTriangle, FileSearch, Layers, Sparkles, FileSpreadsheet, RefreshCw } from 'lucide-react';

interface StatusBadgeProps {
  stage: ProcessingStage;
  error?: string;
  cached?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ stage, error, cached }) => {
  if (cached) {
    return (
      <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
        <Sparkles size={13} /> SHA-256 Cache Hit
      </span>
    );
  }

  switch (stage) {
    case 'uploading':
      return (
        <span className="badge" style={{ background: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', border: '1px solid rgba(148, 163, 184, 0.3)' }}>
          <Loader2 size={13} className="animate-spin" /> Uploading PDF...
        </span>
      );
    case 'analyzing_pdf':
      return (
        <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
          <FileSearch size={13} /> Analyzing Structure
        </span>
      );
    case 'splitting_batches':
      return (
        <span className="badge" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
          <Layers size={13} /> Batching Pages
        </span>
      );
    case 'extracting':
      return (
        <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <Loader2 size={13} className="animate-spin" /> AI Extracting
        </span>
      );
    case 'validating':
      return (
        <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          Validating Rules
        </span>
      );
    case 'verifying':
      return (
        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <Sparkles size={13} /> AI Verification Pass
        </span>
      );
    case 'retrying':
      return (
        <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <RefreshCw size={13} className="animate-spin" /> Auto-Retrying Batch
        </span>
      );
    case 'merging':
      return (
        <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          Merging Student Orders
        </span>
      );
    case 'exporting_excel':
      return (
        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <FileSpreadsheet size={13} /> Exporting Excel
        </span>
      );
    case 'completed':
      return (
        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
          <CheckCircle2 size={13} /> Completed
        </span>
      );
    case 'failed':
      return (
        <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
          <AlertTriangle size={13} /> {error || 'Processing Failed'}
        </span>
      );
    default:
      return (
        <span className="badge" style={{ background: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8' }}>
          Idle
        </span>
      );
  }
};
