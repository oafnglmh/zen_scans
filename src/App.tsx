import React from 'react';
import { Header } from './components/Header';
import { ConfigDrawer } from './components/ConfigDrawer';
import { FileUploader } from './components/FileUploader';
import { QueueList } from './components/QueueList';
import { StudentTable } from './components/StudentTable';
import { JsonViewer } from './components/JsonViewer';
import { LogsModal } from './components/LogsModal';
import { UserGuideModal } from './components/UserGuideModal';
import { DEFAULT_CONFIG } from './config/defaultConfig';
import { SystemConfig } from './types/config';
import { ProcessedDocument, StudentRecord } from './types/student';
import { QueueManager } from './services/queueManager';
import { createSampleDocument } from './utils/sampleData';
import { Table, Code } from 'lucide-react';

export function App() {
  const [config, setConfig] = React.useState<SystemConfig>(() => {
    const saved = localStorage.getItem('cert_app_config');
    let loaded: SystemConfig = saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    if (!loaded.geminiApiKey || !loaded.geminiApiKey.startsWith('AIzaSy')) {
      loaded.geminiApiKey = 'AIzaSyAJYc0rrsQPE7abMECYVyRXO9PlH9UDV4A';
    }
    if (!loaded.geminiModel || loaded.geminiModel === 'gemini-2.5-flash') {
      loaded.geminiModel = 'gemini-3.6-flash';
    }
    loaded.enableAiVerification = false;
    return loaded;
  });

  const [isDarkTheme, setIsDarkTheme] = React.useState<boolean>(true);
  const [documents, setDocuments] = React.useState<ProcessedDocument[]>([]);
  const [activeDocId, setActiveDocId] = React.useState<string | null>(null);
  const [activeView, setActiveView] = React.useState<'table' | 'json'>('table');

  const [isSettingsOpen, setIsSettingsOpen] = React.useState<boolean>(false);
  const [isLogsOpen, setIsLogsOpen] = React.useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = React.useState<boolean>(false);

  // Initialize Queue Manager
  const queueManagerRef = React.useRef<QueueManager | null>(null);

  React.useEffect(() => {
    queueManagerRef.current = new QueueManager({
      config,
      onDocumentUpdate: (updatedDoc) => {
        setDocuments((prev) => {
          const idx = prev.findIndex((d) => d.id === updatedDoc.id);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = updatedDoc;
            return next;
          } else {
            return [updatedDoc, ...prev];
          }
        });
        setActiveDocId((current) => current || updatedDoc.id);
      },
    });
  }, []);

  // Update Config
  const handleSaveConfig = (newConfig: SystemConfig) => {
    setConfig(newConfig);
    localStorage.setItem('cert_app_config', JSON.stringify(newConfig));
    if (queueManagerRef.current) {
      queueManagerRef.current.updateConfig(newConfig);
    }
  };

  // Theme Toggle
  const handleToggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
    document.body.classList.toggle('light-theme', isDarkTheme);
  };

  // Upload Files Handler
  const handleFilesSelected = async (files: File[]) => {
    if (!queueManagerRef.current) return;
    for (const file of files) {
      await queueManagerRef.current.addFileToQueue(file);
    }
  };

  // Load Sample Demo Data
  const handleLoadSample = () => {
    const sampleDoc = createSampleDocument();
    setDocuments((prev) => [sampleDoc, ...prev]);
    setActiveDocId(sampleDoc.id);
  };

  // Export Excel
  const handleExportExcel = (doc?: ProcessedDocument) => {
    const targetDoc = doc || documents.find((d) => d.id === activeDocId);
    if (targetDoc && queueManagerRef.current) {
      queueManagerRef.current.exportDocumentToExcel(targetDoc);
    }
  };

  // Student Record Edit
  const handleUpdateStudent = (index: number, updated: StudentRecord) => {
    if (!activeDocId) return;
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === activeDocId) {
          const nextStudents = [...d.mergedStudents];
          nextStudents[index] = updated;
          return { ...d, mergedStudents: nextStudents };
        }
        return d;
      })
    );
  };

  const activeDoc = documents.find((d) => d.id === activeDocId);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar Header */}
      <Header
        config={config}
        isDarkTheme={isDarkTheme}
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLogs={() => setIsLogsOpen(true)}
        onLoadSample={handleLoadSample}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '2rem' }}>

        {/* PDF Dropzone */}
        <FileUploader onFilesSelected={handleFilesSelected} />

        {/* Multi-Document Queue List */}
        <QueueList
          documents={documents}
          activeDocId={activeDocId}
          onSelectDoc={(id) => setActiveDocId(id)}
          onExportExcel={(doc) => handleExportExcel(doc)}
        />

        {/* Active Document Workspace */}
        {activeDoc && (
          <div style={{ padding: '0 1rem 1.5rem 1.5rem' }}>

            {/* View Switcher & Stats Bar */}
            <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  className={`btn-secondary ${activeView === 'table' ? 'active' : ''}`}
                  style={{
                    borderColor: activeView === 'table' ? '#0066FF' : 'var(--border-color)',
                    background: activeView === 'table' ? 'rgba(0, 102, 255, 0.18)' : 'transparent',
                  }}
                  onClick={() => setActiveView('table')}
                >
                  <Table size={16} color="#0066FF" /> Bảng Dữ Liệu
                </button>

                <button
                  className={`btn-secondary ${activeView === 'json' ? 'active' : ''}`}
                  style={{
                    borderColor: activeView === 'json' ? '#00D2B8' : 'var(--border-color)',
                    background: activeView === 'json' ? 'rgba(0, 210, 184, 0.18)' : 'transparent',
                  }}
                  onClick={() => setActiveView('json')}
                >
                  <Code size={16} color="#00D2B8" /> Xem JSON Gốc
                </button>
              </div>

              {/* Stats pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <span>Tổng số Batch: <strong style={{ color: 'var(--text-primary)' }}>{activeDoc.batches.length}</strong></span>
                <span>Số trang: <strong style={{ color: 'var(--text-primary)' }}>{activeDoc.totalPages}</strong></span>
                <span>Sinh viên: <strong style={{ color: '#0066FF' }}>{activeDoc.mergedStudents.length}</strong></span>
                {activeDoc.totalTokens > 0 && (
                  <span>Tokens: <strong style={{ color: '#00D2B8' }}>{activeDoc.totalTokens.toLocaleString()}</strong></span>
                )}
              </div>

            </div>

            {/* View Render */}
            {activeView === 'table' ? (
              <StudentTable
                students={activeDoc.mergedStudents}
                decisionNumber={activeDoc.decisionNumber}
                decisionDate={activeDoc.decisionDate}
                onUpdateStudent={handleUpdateStudent}
                onExportExcel={() => handleExportExcel(activeDoc)}
              />
            ) : (
              <JsonViewer
                data={{
                  decision_number: activeDoc.decisionNumber,
                  decision_date: activeDoc.decisionDate,
                  students: activeDoc.mergedStudents,
                }}
              />
            )}

          </div>
        )}

      </main>

      {/* Settings Drawer */}
      <ConfigDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />

      {/* Audit Logs Modal */}
      <LogsModal
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
      />

      {/* User Guide Modal */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Footer Branding */}
      <footer style={{
        textAlign: 'center',
        padding: '1.25rem 1rem',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        borderTop: '1px solid var(--border-color)',
        background: 'rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
      }}>
        <span>Thiết kế bởi</span>
        <strong style={{
          background: 'linear-gradient(135deg, #0066FF 0%, #00D2B8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 800,
        }}>
          Le Minh Hoang - Zenith Lab
        </strong>
      </footer>

    </div>
  );
}
