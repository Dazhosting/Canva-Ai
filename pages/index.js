import { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

export default function Home() {
  const [query, setQuery] = useState('');
  const [token, setToken] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Silakan selesaikan verifikasi bot dulu!");

    setLoading(true);
    try {
      const res = await fetch('/api/canva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, token })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Gagal');

      setResult(data.result);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>🔐 Canva AI</h1>
        <div style={styles.menuWrapper}>
          <button style={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
          {menuOpen && (
            <div style={styles.dropdown}>
              <button style={styles.dropdownButton} onClick={() => window.location.href = './docsapi.html'}>
                📄 Docs API
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Masukkan perintah..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <div style={{ margin: '10px 0' }}>
          <Turnstile
            siteKey="0x4AAAAAABpPhesYPXS-t09V"
            onSuccess={(token) => setToken(token)}
          />
        </div>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Loading...' : 'Kirim'}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div style={styles.resultBox}>
          <h3>Hasil:</h3>
          {result.map((block, index) => (
            <pre key={index} style={styles.result}>{block.content}</pre>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: 20,
    maxWidth: 600,
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  header: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    margin: 0,
    fontSize: 24,
    color: '#333',
  },
  menuWrapper: {
    position: 'relative',
  },
  menuButton: {
    fontSize: 22,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#555',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: 35,
    backgroundColor: '#fff',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  dropdownButton: {
    padding: '10px 15px',
    width: '100%',
    background: '#fff',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    color: '#007BFF',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    border: '1px solid #ccc',
    outline: 'none',
  },
  button: {
    marginTop: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  resultBox: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    border: '1px solid #eee',
  },
  result: {
    whiteSpace: 'pre-wrap',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
};
