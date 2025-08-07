import { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

export default function Home() {
  const [query, setQuery] = useState('');
  const [token, setToken] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <div style={{ padding: 20 }}>
      <h1>🔐 Canva AI (Turnstile Verified)</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Masukkan perintah..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '100%', padding: 10 }}
        />
        <Turnstile
          siteKey="0x4AAAAAABpPhesYPXS-t09V"
          onSuccess={(token) => setToken(token)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Kirim'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Hasil:</h3>
          {result.map((block, index) => (
            <pre key={index}>{block.content}</pre>
          ))}
        </div>
      )}
    </div>
  );
}
