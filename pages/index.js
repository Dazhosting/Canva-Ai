import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

// --- Komponen Global Styles ---
// Komponen ini menyuntikkan CSS global, keyframes, dan media query ke dalam <head> dokumen.
const GlobalStyles = () => {
  const styleContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    body {
      margin: 0;
      background-color: #f8fafc;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #334155;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Gaya dasar untuk konten Markdown */
    .prose p { margin: 1em 0; line-height: 1.65; }
    .prose h1, .prose h2, .prose h3 { margin: 1.5em 0 0.8em; font-weight: 600; color: #1e293b; }
    .prose strong { font-weight: 600; color: #1e293b; }
    .prose a { color: #4f46e5; text-decoration: none; }
    .prose a:hover { text-decoration: underline; }
    .prose ul { list-style-type: disc; padding-left: 1.5em; }

    /* Media Query untuk desain responsif */
    @media (min-width: 1024px) {
      .sidebar {
        position: relative !important;
        transform: translateX(0) !important;
      }
      .sidebar-overlay {
        display: none !important;
      }
      .menu-button, .close-button {
        display: none !important;
      }
    }
  `;
  return <style>{styleContent}</style>;
};


// --- Komponen Ikon (Tidak Berubah) ---
const Icon = ({ name, style }) => {
  const icons = {
    menu: <svg style={style} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="18" x2="20" y2="18" /></svg>,
    close: <svg style={style} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    copy: <svg style={style} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>,
    check: <svg style={style} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>,
    send: <svg style={style} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>,
    bot: <svg style={style} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>,
    logo: <svg style={style} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9Z"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>,
  };
  return icons[name] || null;
};

// --- Komponen Blok Konten ---

const HtmlPreview = ({ content }) => (
  <div style={styles.contentBlock.htmlPreviewContainer}>
    <div style={styles.contentBlock.htmlPreviewHeader}>Pratinjau HTML</div>
    <iframe style={styles.contentBlock.htmlPreviewIframe} srcDoc={content} title="HTML Preview" sandbox="allow-scripts" />
  </div>
);

const CodeBlock = ({ language, content }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isHover, setIsHover] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const copyButtonStyle = {
    ...styles.contentBlock.codeCopyButton,
    ...(isHover ? styles.contentBlock.codeCopyButtonHover : {}),
  };

  return (
    <div style={styles.contentBlock.codeContainer}>
      <div style={styles.contentBlock.codeHeader}>
        <span style={styles.contentBlock.codeLanguage}>{language}</span>
        <button onClick={handleCopy} style={copyButtonStyle} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
          {isCopied ? <Icon name="check" style={{ width: 12, height: 12, color: '#34d399' }} /> : <Icon name="copy" style={{ width: 12, height: 12 }} />}
          {isCopied ? 'Tersalin!' : 'Salin Kode'}
        </button>
      </div>
      <pre style={styles.contentBlock.codePre}><code style={styles.contentBlock.codeContent}>{content}</code></pre>
    </div>
  );
};

const TextBlock = ({ content }) => (
  <div className="prose"><ReactMarkdown>{content}</ReactMarkdown></div>
);

const renderContentBlock = (block, index) => {
    switch (block.type) {
      case 'html': return <HtmlPreview key={index} content={block.content} />;
      case 'javascript': case 'css': case 'python': case 'jsx':
        return <CodeBlock key={index} language={block.type} content={block.content} />;
      case 'text': default:
        return <TextBlock key={index} content={block.content} />;
    }
};

// --- Komponen Aplikasi Utama ---
export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const textareaRef = useRef(null);
  const resultContainerRef = useRef(null);

  useEffect(() => { document.title = "Chat AI Canva | Versi CSS-in-JS"; }, []);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);
  useEffect(() => {
    if (resultContainerRef.current) {
      resultContainerRef.current.scrollTop = resultContainerRef.current.scrollHeight;
    }
  }, [result, loading, error]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setResult([]); 
    setError('');
    
    try {
      const res = await fetch('/api/canva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Gagal mem-parsing respons error dari server.' }));
        throw new Error(errorData.error || `Terjadi kesalahan pada server: ${res.statusText}`);
      }

      const data = await res.json();
      
      if (Array.isArray(data.result)) {
        setResult(data.result);
      } else {
        throw new Error('Format respons dari API tidak valid. Diharapkan sebuah array.');
      }

    } catch (e) {
      setError(e.message || 'Gagal terhubung ke API.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const sidebarStyle = {
    ...styles.sidebar.base,
    transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
  };

  return (
    <>
      <GlobalStyles />
      <div style={styles.appContainer}>
        {/* --- Sidebar --- */}
        <div style={sidebarStyle} className="sidebar">
          <div style={styles.sidebar.header}>
            <div style={styles.sidebar.logoContainer}>
              <Icon name="logo" style={{ width: 28, height: 28, color: '#4f46e5' }}/>
              <h2 style={styles.sidebar.title}>AI Canva</h2>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="close-button" style={styles.sidebar.closeButton}><Icon name="close" style={{ width: 20, height: 20 }} /></button>
          </div>
          <nav style={styles.sidebar.nav}>
            <a href="#" style={{...styles.sidebar.navLink, ...styles.sidebar.navLinkActive}}>Obrolan Baru</a>
            <a href="#" style={styles.sidebar.navLink}>Riwayat</a>
            <a href="#" style={styles.sidebar.navLink}>Dokumentasi API</a>
          </nav>
        </div>
        
        {/* --- Konten Utama --- */}
        <div style={styles.mainContent.container}>
          <header style={styles.mainContent.header}>
            <button onClick={() => setIsSidebarOpen(true)} className="menu-button" style={styles.mainContent.menuButton}><Icon name="menu" style={{ width: 24, height: 24 }} /></button>
            <div style={{ flex: 1, textAlign: 'center' }}><h1 style={styles.mainContent.title}>Antarmuka Chat AI</h1></div>
          </header>

          <main ref={resultContainerRef} style={styles.mainContent.chatArea}>
            <div style={{ maxWidth: 896, margin: '0 auto' }}>
                {result.length === 0 && !loading && !error && (
                    <div style={styles.mainContent.emptyStateContainer}>
                        <Icon name="bot" style={{ width: 64, height: 64, margin: '0 auto', color: '#cbd5e1' }}/>
                        <h2 style={styles.mainContent.emptyStateTitle}>Chat AI Canva</h2>
                        <p style={styles.mainContent.emptyStateSubtitle}>Mulai percakapan dengan mengirimkan permintaan di bawah.</p>
                    </div>
                )}
                {result.length > 0 && <div>{result.map(renderContentBlock)}</div>}
                {loading && (
                    <div style={styles.mainContent.loadingIndicator}>
                        <div style={{...styles.mainContent.spinner}}></div>
                        <p>AI sedang memproses, mohon tunggu...</p>
                    </div>
                )}
                {error && (
                    <div style={styles.mainContent.errorBox}>
                        <p><strong style={{fontWeight: 600}}>Terjadi Kesalahan:</strong> {error}</p>
                    </div>
                )}
            </div>
          </main>
          
          <footer style={styles.footer.container}>
            <div style={{ maxWidth: 896, margin: '0 auto' }}>
              <div style={{ position: 'relative' }}>
                <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Kirim permintaan ke AI... (misal: 'buatkan tombol login dengan efek hover')" disabled={loading} rows={1} style={styles.footer.textarea} />
                <button onClick={handleSend} disabled={loading || !input.trim()} style={styles.footer.sendButton(loading || !input.trim())}>
                  <Icon name="send" style={{ width: 20, height: 20 }} />
                </button>
              </div>
              <p style={styles.footer.disclaimer}>Chat AI Canva dapat memberikan informasi yang tidak akurat. Verifikasi respons penting.</p>
            </div>
          </footer>
        </div>
        
        {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} style={styles.sidebar.overlay} className="sidebar-overlay"></div>}
      </div>
    </>
  );
}

// --- Objek Gaya (CSS-in-JS) ---
const styles = {
  appContainer: { display: 'flex', height: '100vh' },
  sidebar: {
    base: {
      position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 30, width: 256,
      backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0',
      transition: 'transform 300ms ease-in-out',
    },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #e2e8f0' },
    logoContainer: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    title: { fontWeight: 700, fontSize: '1.125rem', color: '#1e293b' },
    closeButton: { padding: '0.25rem', borderRadius: '9999px' },
    nav: { padding: '1rem' },
    navLink: { display: 'block', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 500, color: '#475569', textDecoration: 'none', marginTop: '0.25rem' },
    navLinkActive: { backgroundColor: '#f1f5f9', color: '#1e293b' },
    overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 20 },
  },
  mainContent: {
    container: { flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 },
    menuButton: { padding: '0.25rem', borderRadius: '9999px' },
    title: { fontSize: '1.125rem', fontWeight: 600, color: '#1e293b' },
    chatArea: { flex: 1, overflowY: 'auto', padding: '2rem' },
    emptyStateContainer: { textAlign: 'center', paddingTop: '5rem', paddingBottom: '5rem' },
    emptyStateTitle: { marginTop: '1rem', fontSize: '1.5rem', fontWeight: 700, color: '#334155' },
    emptyStateSubtitle: { marginTop: '0.5rem', color: '#64748b' },
    loadingIndicator: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' },
    spinner: { width: 20, height: 20, border: '2px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    errorBox: { padding: '1rem', backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '8px' },
  },
  footer: {
    container: { padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)', borderTop: '1px solid #e2e8f0' },
    textarea: {
      width: '100%', boxSizing: 'border-box', padding: '1rem 3.5rem 1rem 1rem', fontSize: '1rem', backgroundColor: '#ffffff',
      border: '1px solid #cbd5e1', borderRadius: '12px', resize: 'none', outline: 'none',
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    sendButton: (disabled) => ({
      position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
      padding: '0.5rem', borderRadius: '9999px', transition: 'background-color 0.2s',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      backgroundColor: disabled ? '#e2e8f0' : '#4f46e5',
      color: disabled ? '#94a3b8' : '#ffffff',
      border: 'none',
    }),
    disclaimer: { textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' },
  },
  contentBlock: {
    htmlPreviewContainer: { border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', margin: '1rem 0', backgroundColor: '#ffffff' },
    htmlPreviewHeader: { padding: '0.5rem 1rem', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.875rem', borderBottom: '1px solid #e2e8f0' },
    htmlPreviewIframe: { width: '100%', height: '200px', border: 'none' },
    codeContainer: { backgroundColor: '#282c34', borderRadius: '8px', margin: '1rem 0', overflow: 'hidden' },
    codeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem', backgroundColor: '#21252b' },
    codeLanguage: { color: '#9da5b4', fontSize: '0.75rem', fontFamily: 'sans-serif', fontWeight: 600, textTransform: 'uppercase' },
    codeCopyButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9da5b4', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.5rem', borderRadius: '6px', transition: 'background-color 0.2s', backgroundColor: '#353a42', border: 'none', cursor: 'pointer' },
    codeCopyButtonHover: { backgroundColor: '#40454f', color: '#ffffff' },
    codePre: { padding: '1rem', margin: 0, fontSize: '0.875rem', overflowX: 'auto' },
    codeContent: { color: '#abb2bf', fontFamily: '"Fira Code", "Source Code Pro", Menlo, Monaco, Consolas, "Courier New", monospace' },
  },
};
    
