import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

// --- Helper & Komponen Ikon (Tidak Berubah) ---
const useInjectKeyframes = () => {
  useEffect(() => {
    const styleId = 'spinner-keyframes';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `;
      document.head.appendChild(style);
    }
  }, []);
};

const Icon = ({ type, size = 24, color = 'currentColor' }) => {
    const icons = {
        menu: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
        close: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
        copy: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>,
        check: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    };
    return icons[type] || null;
};

// --- Komponen Filter Konten ---

// Filter 1: Untuk Pratinjau HTML (Live Preview)
const HtmlPreview = ({ content }) => {
    const styles = {
        container: { border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', margin: '1rem 0' },
        header: { padding: '0.5rem 1rem', backgroundColor: '#f9fafb', color: '#4b5563', fontWeight: 600, fontSize: '0.9rem', borderBottom: '1px solid #e5e7eb' },
        iframe: { width: '100%', height: '200px', border: 'none' }
    };
    return (
        <div style={styles.container}>
            <div style={styles.header}>Pratinjau HTML</div>
            <iframe style={styles.iframe} srcDoc={content} title="HTML Preview" sandbox="allow-scripts" />
        </div>
    );
};

// Filter 2: Untuk Blok Kode (JavaScript, CSS, dll.)
const CodeBlock = ({ language, content }) => {
    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(content).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };
    const styles = {
        container: { position: 'relative', backgroundColor: '#2d2d2d', borderRadius: '8px', margin: '1rem 0', color: '#f8f8f2', fontSize: '0.9rem' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem', backgroundColor: '#3a3a3a', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' },
        language: { color: '#ccc', fontSize: '0.85rem', textTransform: 'uppercase' },
        copyButton: { background: 'none', border: '1px solid #555', color: '#ccc', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'background-color 0.2s' },
        pre: { padding: '1rem', overflowX: 'auto', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' },
    };
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <span style={styles.language}>{language}</span>
                <button onClick={handleCopy} style={styles.copyButton} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4a4a4a'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    {isCopied ? <Icon type="check" size={16} /> : <Icon type="copy" size={16} />}
                    {isCopied ? 'Tersalin!' : 'Salin'}
                </button>
            </div>
            <pre style={styles.pre}><code>{content}</code></pre>
        </div>
    );
};

// Filter 3: Untuk Teks Biasa / Markdown
const TextBlock = ({ content }) => {
    return <ReactMarkdown>{content}</ReactMarkdown>;
};

// --- Komponen Utama ---
export default function Home() {
  useInjectKeyframes();
  useEffect(() => { document.title = "Chat AI Canva"; }, []);

  const [input, setInput] = useState('');
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
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
      
      // Pastikan respons adalah array, jika tidak, bungkus dalam array atau tampilkan error
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
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };
  
  const renderContentBlock = (block, index) => {
    const language = block.type === 'text' || block.type === 'html' ? block.type : 'code';
    switch (block.type) {
      case 'html':
        return <HtmlPreview key={index} content={block.content} />;
      case 'javascript':
      case 'css':
      case 'python': // Menambahkan contoh lain
        return <CodeBlock key={index} language={block.type} content={block.content} />;
      case 'text':
      default:
        return <TextBlock key={index} content={block.content} />;
    }
  };

  const styles = { /* ... Objek styling tidak berubah ... */ 
    page: { backgroundColor: '#f9fafb' },
    container: { maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', color: '#333' },
    topBar: { display: 'flex', alignItems: 'center', marginBottom: '2.5rem' },
    menuButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', marginRight: '1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' },
    header: { textAlign: 'center', flexGrow: 1 },
    title: { fontSize: '2.5rem', fontWeight: 700, background: 'linear-gradient(90deg, #4b6cb7, #182848)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    subtitle: { fontSize: '1.1rem', color: '#666', marginTop: '0.5rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    textarea: { width: '100%', padding: '1rem', fontSize: '1rem', borderRadius: '8px', border: `1px solid ${isTextareaFocused ? '#4b6cb7' : '#ddd'}`, boxShadow: isTextareaFocused ? '0 0 0 3px rgba(75, 108, 183, 0.2)' : '0 1px 2px rgba(0,0,0,0.05)', resize: 'vertical', minHeight: 120, transition: 'border-color 0.2s, box-shadow 0.2s', outline: 'none', backgroundColor: '#fff' },
    button: { padding: '0.75rem 1.5rem', fontSize: '1rem', fontWeight: 600, color: '#fff', backgroundColor: '#4b6cb7', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s, transform 0.1s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
    buttonHover: { backgroundColor: '#3a539b', transform: 'translateY(-2px)' },
    buttonDisabled: { backgroundColor: '#a0a0a0', cursor: 'not-allowed' },
    loader: { border: '4px solid #f3f3f3', borderTop: '4px solid #4b6cb7', borderRadius: '50%', width: 20, height: 20, animation: 'spin 1s linear infinite' },
    resultContainer: { marginTop: '2.5rem', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', padding: '1.5rem 2rem', borderRadius: '8px', minHeight: 100, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    resultTitle: { fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: '#182848' },
  };

  const Sidebar = ({ isOpen, onClose }) => { /* ... Komponen Sidebar tidak berubah ... */ if(!isOpen) return null; return( <div style={{position:'fixed', top:0, left:0, width:280, height:'100%', background:'white', zIndex:1000, padding:'1rem', boxShadow:'2px 0 5px rgba(0,0,0,0.1)'}}><button onClick={onClose} style={{float:'right'}}>X</button><h2>Menu</h2><a href="#">Docs API</a></div> )};

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div style={styles.topBar}>
            <button onClick={() => setIsSidebarOpen(true)} style={styles.menuButton} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Icon type="menu" />
            </button>
            <header style={styles.header}>
                <h1 style={styles.title}>🎨 Chat AI Canva</h1>
                <p style={styles.subtitle}>Dapatkan ide, teks, dan kode instan dari AI</p>
            </header>
        </div>

        <div style={styles.form}>
          <textarea style={styles.textarea} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} onFocus={() => setIsTextareaFocused(true)} onBlur={() => setIsTextareaFocused(false)} placeholder="Kirim permintaan ke API Anda..." disabled={loading} rows={5} />
          <button onClick={handleSend} style={{ ...styles.button, ...(isButtonHovered && !loading ? styles.buttonHover : {}), ...(loading ? styles.buttonDisabled : {})}} disabled={loading || !input.trim()} onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)}>
            {loading ? (<><div style={styles.loader}></div><span>Memproses...</span></>) : ('Kirim Permintaan')}
          </button>
        </div>

        {(result.length > 0 || loading || error) && (
          <div style={styles.resultContainer}>
            <h2 style={styles.resultTitle}>Jawaban AI</h2>
            {loading && <p>⏳ Sedang menunggu jawaban dari AI, mohon tunggu sebentar...</p>}
            {error && <p style={{ color: '#d9534f' }}>❌ {error}</p>}
            <div>{result.map(renderContentBlock)}</div>
          </div>
        )}
      </div>
    </div>
  );
  }
  
