// pages/index.js
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

// --- Helper & Komponen Baru ---

// Hook untuk menyuntikkan keyframes animasi (tidak berubah)
const useInjectKeyframes = () => {
  useEffect(() => {
    const styleId = 'spinner-keyframes';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
};

// Komponen untuk Ikon (SVG)
const Icon = ({ type, size = 24, color = 'currentColor' }) => {
    const icons = {
        menu: (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        ),
        close: (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        ),
        copy: (
             <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        ),
        check: (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        ),
    };
    return icons[type] || null;
};


// Komponen Sidebar
const Sidebar = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            animation: 'fadeIn 0.3s ease',
        },
        sidebar: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: 280,
            height: '100%',
            backgroundColor: '#ffffff',
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
            zIndex: 1000,
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideIn 0.3s ease',
        },
        closeButton: {
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#182848',
            marginBottom: '2rem',
        },
        navLink: {
            display: 'block',
            padding: '0.75rem 0',
            color: '#333',
            textDecoration: 'none',
            fontSize: '1rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
        },
    };
    
    // Hover effect for navLink
    const handleMouseEnter = (e) => e.target.style.backgroundColor = '#f0f0f0';
    const handleMouseLeave = (e) => e.target.style.backgroundColor = 'transparent';

    return (
        <>
            <div style={styles.overlay} onClick={onClose}></div>
            <aside style={styles.sidebar}>
                <button onClick={onClose} style={styles.closeButton}>
                    <Icon type="close" />
                </button>
                <h2 style={styles.title}>Menu</h2>
                <nav>
                    <a href="#" style={styles.navLink} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Beranda</a>
                    <a href="#" style={styles.navLink} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Docs API</a>
                    <a href="#" style={styles.navLink} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Pengaturan</a>
                </nav>
            </aside>
        </>
    );
};

// Komponen Kustom untuk Blok Kode
const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const [isCopied, setIsCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'text';
    const codeText = String(children).replace(/\n$/, '');

    const handleCopy = () => {
        // Fallback for environments without navigator.clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(codeText).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            }).catch(err => {
                console.error('Gagal menyalin kode:', err);
            });
        } else {
            // A simple fallback using a temporary textarea
            const textArea = document.createElement('textarea');
            textArea.value = codeText;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            } catch (err) {
                console.error('Gagal menyalin kode dengan fallback:', err);
            }
            document.body.removeChild(textArea);
        }
    };
    
    const styles = {
        codeContainer: {
            position: 'relative',
            backgroundColor: '#2d2d2d',
            borderRadius: '8px',
            margin: '1rem 0',
            color: '#f8f8f2',
            fontSize: '0.9rem',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            backgroundColor: '#3a3a3a',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
        },
        language: {
            color: '#ccc',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
        },
        copyButton: {
            background: 'none',
            border: '1px solid #555',
            color: '#ccc',
            cursor: 'pointer',
            padding: '0.25rem 0.5rem',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'background-color 0.2s',
        },
        pre: {
            padding: '1rem',
            overflowX: 'auto',
            margin: 0,
            whiteSpace: 'pre-wrap', // Ensure long lines wrap
            wordBreak: 'break-all', // Break words to prevent overflow
        },
    };

    if (inline) {
        return <code className={className} {...props}>{children}</code>;
    }

    return (
        <div style={styles.codeContainer}>
            <div style={styles.header}>
                <span style={styles.language}>{language}</span>
                <button 
                    onClick={handleCopy} 
                    style={styles.copyButton}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4a4a4a'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    {isCopied ? <Icon type="check" size={16} /> : <Icon type="copy" size={16} />}
                    {isCopied ? 'Tersalin!' : 'Salin'}
                </button>
            </div>
            <pre style={styles.pre}><code className={className} {...props}>{children}</code></pre>
        </div>
    );
};


// --- Komponen Utama ---

export default function Home() {
  useInjectKeyframes();

  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  
  // Set document title
  useEffect(() => {
    document.title = "Chat AI Canva";
  }, []);


  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult('');
    setError('');

    try {
      // This is a mock API call. Replace with your actual API endpoint.
      // We simulate a delay and a response.
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponse = `Berikut adalah contoh kode HTML untuk tombol gradien yang Anda minta:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
<title>Gradient Button</title>
<style>
  .gradient-button {
    background: linear-gradient(90deg, #4b6cb7, #182848);
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 8px;
    transition: transform 0.2s;
  }
  .gradient-button:hover {
    transform: scale(1.05);
  }
</style>
</head>
<body>

<h2>Tombol dengan Gradien</h2>
<button class="gradient-button">Klik Saya</button>

</body>
</html>
\`\`\`

Anda bisa menyesuaikan warna di dalam properti \`background: linear-gradient(...)\` sesuai keinginan.`;
      
      setResult(mockResponse);

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

  const styles = {
    page: {
        backgroundColor: '#f9fafb',
    },
    container: {
      maxWidth: 800, // Sedikit lebih lebar untuk kenyamanan
      margin: '0 auto',
      padding: '2rem 1.5rem',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: '#333',
    },
    topBar: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '2.5rem',
    },
    menuButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.5rem',
        marginRight: '1rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s',
    },
    header: {
      textAlign: 'center',
      flexGrow: 1,
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 700,
      background: 'linear-gradient(90deg, #4b6cb7, #182848)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0,
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#666',
      marginTop: '0.5rem',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    textarea: {
      width: '100%',
      padding: '1rem',
      fontSize: '1rem',
      borderRadius: '8px',
      border: `1px solid ${isTextareaFocused ? '#4b6cb7' : '#ddd'}`,
      boxShadow: isTextareaFocused ? '0 0 0 3px rgba(75, 108, 183, 0.2)' : '0 1px 2px rgba(0,0,0,0.05)',
      resize: 'vertical',
      minHeight: 120,
      transition: 'border-color 0.2s, box-shadow 0.2s',
      outline: 'none',
      backgroundColor: '#fff',
    },
    button: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: 600,
      color: '#fff',
      backgroundColor: '#4b6cb7',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.2s, transform 0.1s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    buttonHover: {
      backgroundColor: '#3a539b',
      transform: 'translateY(-2px)',
    },
    buttonDisabled: {
      backgroundColor: '#a0a0a0',
      cursor: 'not-allowed',
    },
    loader: {
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #4b6cb7',
      borderRadius: '50%',
      width: 20,
      height: 20,
      animation: 'spin 1s linear infinite',
    },
    resultContainer: {
      marginTop: '2.5rem',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      padding: '1.5rem 2rem', // Padding lebih besar
      borderRadius: '8px',
      minHeight: 100,
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    },
    resultTitle: {
      fontSize: '1.2rem',
      fontWeight: 600,
      marginBottom: '1rem',
      color: '#182848',
    },
    resultContent: {
      lineHeight: 1.7,
      // 'whiteSpace: pre-wrap' tidak diperlukan karena Markdown akan menanganinya
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div style={styles.topBar}>
            <button 
                onClick={() => setIsSidebarOpen(true)} 
                style={styles.menuButton}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                <Icon type="menu" />
            </button>
            <header style={styles.header}>
                <h1 style={styles.title}>🎨 Chat AI Canva</h1>
                <p style={styles.subtitle}>Dapatkan ide dan panduan desain instan dengan kekuatan AI</p>
            </header>
        </div>

        <div style={styles.form}>
          <textarea
            style={styles.textarea}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsTextareaFocused(true)}
            onBlur={() => setIsTextareaFocused(false)}
            placeholder="Contoh: 'Buatkan kode HTML untuk tombol gradien'"
            disabled={loading}
            rows={5}
          />
          <button
            onClick={handleSend}
            style={{
              ...styles.button,
              ...(isButtonHovered && !loading ? styles.buttonHover : {}),
              ...(loading ? styles.buttonDisabled : {}),
            }}
            disabled={loading || !input.trim()}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            {loading ? (
              <>
                <div style={styles.loader}></div>
                <span>Memproses...</span>
              </>
            ) : (
              'Kirim Permintaan'
            )}
          </button>
        </div>

        {(result || loading || error) && (
          <div style={styles.resultContainer}>
            <h2 style={styles.resultTitle}>Jawaban AI</h2>
            {loading && <p>⏳ Sedang menunggu jawaban dari AI, mohon tunggu sebentar...</p>}
            {error && <p style={{ color: '#d9534f' }}>❌ {error}</p>}
            {result && (
              <div style={styles.resultContent}>
                <ReactMarkdown 
                  components={{
                    code: CodeBlock, // Di sini kita gunakan komponen kustom
                  }}
                >
                  {result}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
      }
      
