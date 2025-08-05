// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult('⏳ Mengirim permintaan...');

    try {
      const res = await fetch('/api/canva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input })
      });

      const data = await res.json();
      setResult(data.result || '❌ Tidak ada respons dari API.');
    } catch (e) {
      setResult('❌ Gagal terhubung ke API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎨 Chat AI Canva</h1>
      <textarea
        rows={5}
        style={styles.textarea}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Masukkan prompt Canva..."
        disabled={loading}
      />
      <button
        onClick={handleSend}
        style={{ ...styles.button, backgroundColor: loading ? '#888' : '#0070f3' }}
        disabled={loading}
      >
        {loading ? 'Tunggu...' : 'Kirim'}
      </button>
      <div style={styles.result}>
        <strong>Hasil:</strong>
        <div>{result}</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: 'auto',
    padding: 20,
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  textarea: {
    width: '100%',
    padding: 10,
    fontSize: 16,
    marginBottom: 10
  },
  button: {
    padding: '10px 20px',
    fontSize: 16,
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  },
  result: {
    marginTop: 20,
    whiteSpace: 'pre-wrap',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8
  }
};
    
