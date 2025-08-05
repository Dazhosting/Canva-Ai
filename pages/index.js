// pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import rehypePrism from 'rehype-prism-plus';

// Helper untuk menyuntikkan keyframes animasi ke dalam dokumen
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
      `;
      document.head.appendChild(style);
    }
  }, []);
};

export default function Home() {
  useInjectKeyframes(); // Suntikkan animasi saat komponen dimuat

  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State untuk menangani efek interaktif
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);


  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult('');
    setError('');

    try {
      const res = await fetch('/api/canva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Terjadi kesalahan pada server.');
      }

      const data = await res.json();
      setResult(data.result || 'Tidak ada respons dari AI.');
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

  // Objek styling (CSS-in-JS)
  const styles = {
    container: {
      maxWidth: 750,
      margin: '0 auto',
      padding: '2rem 1.5rem',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: '#333',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2.5rem',
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
      boxShadow: isTextareaFocused ? '0 0 0 3px rgba(75, 108, 183, 0.2)' : 'none',
      resize: 'vertical',
      minHeight: 120,
      transition: 'border-color 0.2s, box-shadow 0.2s',
      outline: 'none',
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
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      padding: '1.5rem',
      borderRadius: '8px',
      minHeight: 100,
    },
    resultTitle: {
      fontSize: '1.2rem',
      fontWeight: 600,
      marginBottom: '1rem',
      color: '#182848',
    },
    resultContent: {
      lineHeight: 1.7,
      whiteSpace: 'pre-wrap',
    },
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Chat AI Canva</title>
        <meta name="description" content="Dapatkan ide desain Canva dengan bantuan AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header style={styles.header}>
        <h1 style={styles.title}>🎨 Chat AI Canva</h1>
        <p style={styles.subtitle}>Dapatkan ide dan panduan desain instan dengan kekuatan AI</p>
      </header>

      <div style={styles.form}>
        <textarea
          style={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsTextareaFocused(true)}
          onBlur={() => setIsTextareaFocused(false)}
          placeholder="Contoh: 'Buatkan ide postingan Instagram untuk promosi kedai kopi baru'"
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
          disabled={loading}
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
          {error && <p style={{ color: 'red' }}>❌ {error}</p>}
          {result && (
            <div style={styles.resultContent}>
              {/* ReactMarkdown tidak memiliki prop 'style', jadi kita bungkus dengan div jika perlu styling khusus */}
              <ReactMarkdown rehypePlugins={[rehypePrism]}>{result}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
            }
