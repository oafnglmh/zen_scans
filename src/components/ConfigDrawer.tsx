import React from 'react';
import { X, Save, Sliders, Key, FileCode2, Cpu } from 'lucide-react';
import { SystemConfig } from '../types/config';
import { AVAILABLE_MODELS } from '../config/defaultConfig';
import { PROMPTS_REGISTRY } from '../config/prompts';

interface ConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: SystemConfig;
  onSaveConfig: (updated: SystemConfig) => void;
}

export const ConfigDrawer: React.FC<ConfigDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = React.useState<SystemConfig>(config);

  React.useEffect(() => {
    setFormData(config);
  }, [config]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '520px',
        height: '100%',
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 40px rgba(0, 102, 255, 0.25)',
        borderLeft: '1px solid rgba(0, 210, 184, 0.3)',
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
            <Sliders size={20} color="#0066FF" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Cấu Hình Hệ Thống ZenScan</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Section 1: API Keys & Provider */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.1rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0066FF' }}>
              <Key size={16} /> AI Provider & API Key
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <button
                type="button"
                className={`btn-secondary ${formData.provider === 'gemini' ? 'active' : ''}`}
                style={{
                  justifyContent: 'center',
                  borderColor: formData.provider === 'gemini' ? '#0066FF' : 'var(--border-color)',
                  background: formData.provider === 'gemini' ? 'rgba(0, 102, 255, 0.2)' : 'transparent',
                }}
                onClick={() => setFormData({ ...formData, provider: 'gemini' })}
              >
                Google Gemini
              </button>
              <button
                type="button"
                className={`btn-secondary ${formData.provider === 'claude' ? 'active' : ''}`}
                style={{
                  justifyContent: 'center',
                  borderColor: formData.provider === 'claude' ? '#7C3AED' : 'var(--border-color)',
                  background: formData.provider === 'claude' ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
                }}
                onClick={() => setFormData({ ...formData, provider: 'claude' })}
              >
                Anthropic Claude
              </button>
            </div>

            {formData.provider === 'gemini' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={formData.geminiApiKey}
                    onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
                    placeholder="AIzaSy..."
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Gemini Model
                  </label>
                  <select
                    value={formData.geminiModel}
                    onChange={(e) => setFormData({ ...formData, geminiModel: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {AVAILABLE_MODELS.gemini.map(m => (
                      <option key={m.id} value={m.id} style={{ background: '#1e293b' }}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Claude API Key
                  </label>
                  <input
                    type="password"
                    value={formData.claudeApiKey}
                    onChange={(e) => setFormData({ ...formData, claudeApiKey: e.target.value })}
                    placeholder="sk-ant-api..."
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Claude Model
                  </label>
                  <select
                    value={formData.claudeModel}
                    onChange={(e) => setFormData({ ...formData, claudeModel: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {AVAILABLE_MODELS.claude.map(m => (
                      <option key={m.id} value={m.id} style={{ background: '#1e293b' }}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Batching & Retries */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.1rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#7C3AED' }}>
              <Cpu size={16} /> Batching & Retry Policy
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Max Pages / Batch
                </label>
                <input
                  type="number"
                  min={5}
                  max={30}
                  value={formData.maxPagesPerBatch}
                  onChange={(e) => setFormData({ ...formData, maxPagesPerBatch: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Max Retry Attempts
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={formData.maxRetries}
                  onChange={(e) => setFormData({ ...formData, maxRetries: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.preferNativePdf}
                  onChange={(e) => setFormData({ ...formData, preferNativePdf: e.target.checked })}
                />
                <span>Direct Native PDF Processing</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.enableAiVerification}
                  onChange={(e) => setFormData({ ...formData, enableAiVerification: e.target.checked })}
                />
                <span>AI Verification Pass 2 (Audits Output)</span>
              </label>
            </div>
          </div>

          {/* Section 3: Prompt Version & Tuning */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.1rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00D2B8' }}>
              <FileCode2 size={16} /> Prompt Versioning & Hyperparameters
            </h3>
            
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Active Prompt Engine Version
              </label>
              <select
                value={formData.promptVersion}
                onChange={(e) => setFormData({ ...formData, promptVersion: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                {Object.values(PROMPTS_REGISTRY).map(p => (
                  <option key={p.version} value={p.version} style={{ background: '#1e293b' }}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Temperature ({formData.temperature})
                </label>
                <input
                  type="range"
                  min={0.0}
                  max={0.5}
                  step={0.05}
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Top-P ({formData.topP})
                </label>
                <input
                  type="range"
                  min={0.5}
                  max={1.0}
                  step={0.05}
                  value={formData.topP}
                  onChange={(e) => setFormData({ ...formData, topP: Number(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', borderRadius: '12px' }}>
              <Save size={18} /> Lưu Cấu Hình
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
