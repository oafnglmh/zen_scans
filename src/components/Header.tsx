import React from 'react';
import { Settings, Sun, Moon, Sparkles, Terminal, HelpCircle } from 'lucide-react';
import { SystemConfig } from '../types/config';

interface HeaderProps {
  config: SystemConfig;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onOpenLogs: () => void;
  onLoadSample: () => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  isDarkTheme,
  onToggleTheme,
  onOpenSettings,
  onOpenLogs,
  onLoadSample,
  onOpenGuide,
}) => {
  const hasKey = config.provider === 'claude' ? !!config.claudeApiKey : !!config.geminiApiKey;

  return (
    <header className="glass-card" style={{ margin: '1rem', padding: '1rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src="/images/logo_zenscan.png"
              alt="ZenScan Logo"
              style={{
                width: '46px',
                height: '46px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 12px rgba(0, 102, 255, 0.4))',
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #0066FF 0%, #00D2B8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                ZenScan
              </h1>
              <span className="badge" style={{ background: 'rgba(0, 210, 184, 0.12)', color: '#00D2B8', border: '1px solid rgba(0, 210, 184, 0.25)', fontSize: '0.72rem' }}>
                AI Multimodal Engine
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Trích xuất Bằng tốt nghiệp PDF sang Excel 23 Cột Tự Động
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* API Key Status Indicator */}
          <div className="badge" style={{
            background: hasKey ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: hasKey ? '#10b981' : '#f59e0b',
            border: `1px solid ${hasKey ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
            padding: '0.4rem 0.75rem',
            fontSize: '0.8rem'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: hasKey ? '#10b981' : '#f59e0b', display: 'inline-block' }} />
            {hasKey ? `${config.provider.toUpperCase()} Sẵn Sàng` : 'Yêu Cầu API Key'}
          </div>

          {/* User Guide Button */}
          <button className="btn-secondary" onClick={onOpenGuide} title="Xem hướng dẫn sử dụng chi tiết">
            <HelpCircle size={16} color="#00D2B8" />
            <span style={{ fontSize: '0.85rem' }}>Hướng Dẫn Sử Dụng</span>
          </button>

          {/* Load Demo Data */}
          <button className="btn-secondary" onClick={onLoadSample} title="Nạp dữ liệu mẫu để trải nghiệm thử ngay">
            <Sparkles size={16} color="#0066FF" />
            <span style={{ fontSize: '0.85rem' }}>Dữ Liệu Mẫu</span>
          </button>

          {/* System Audit Logs */}
          <button className="btn-secondary" onClick={onOpenLogs} title="Xem nhật ký hệ thống & chi phí API">
            <Terminal size={16} />
            <span style={{ fontSize: '0.85rem' }}>Logs & Chi Phí</span>
          </button>

          {/* Settings Drawer */}
          <button className="btn-secondary" onClick={onOpenSettings} title="Cấu hình thông số hệ thống & API Key">
            <Settings size={16} />
            <span style={{ fontSize: '0.85rem' }}>Cài Đặt</span>
          </button>

          {/* Theme Toggle */}
          <button className="btn-secondary" onClick={onToggleTheme} style={{ padding: '0.6rem' }} title="Đổi Giao diện Sáng / Tối">
            {isDarkTheme ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#7C3AED" />}
          </button>
        </div>

      </div>
    </header>
  );
};
