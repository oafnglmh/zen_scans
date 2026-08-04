import React from 'react';
import { Copy, Check } from 'lucide-react';

interface JsonViewerProps {
  data: any;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  const [copied, setCopied] = React.useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem', position: 'relative' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Structured JSON Payload</h3>
        
        <button className="btn-secondary" onClick={handleCopy} style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
          {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
        </button>
      </div>

      <pre style={{
        background: '#090d16',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        color: '#38bdf8',
        fontSize: '0.8rem',
        fontFamily: 'monospace',
        maxHeight: '450px',
        overflowY: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {jsonString}
      </pre>

    </div>
  );
};
