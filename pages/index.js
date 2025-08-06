import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

// --- Icon Components (using Lucide-React style SVGs for better visuals) ---
const Icon = ({ name, className = 'w-6 h-6' }) => {
  const icons = {
    menu: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
      </svg>
    ),
    close: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    copy: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
    ),
    check: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
    send: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </svg>
    ),
    bot: (
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
    ),
    logo: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9Z"/>
            <path d="M8 12h8"/>
            <path d="M12 8v8"/>
        </svg>
    )
  };
  return icons[name] || null;
};

// --- Content Block Components ---

const HtmlPreview = ({ content }) => (
  <div className="border border-slate-200 rounded-lg overflow-hidden my-4 bg-white">
    <div className="px-4 py-2 bg-slate-50 text-slate-600 font-semibold text-sm border-b border-slate-200">
      Pratinjau HTML
    </div>
    <iframe className="w-full h-52" srcDoc={content} title="HTML Preview" sandbox="allow-scripts" />
  </div>
);

const CodeBlock = ({ language, content }) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    // Using a fallback for environments where navigator.clipboard might not be available
    try {
        navigator.clipboard.writeText(content).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = content;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textArea);
    }
  };

  return (
    <div className="bg-[#282c34] rounded-lg my-4 overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-[#21252b]">
        <span className="text-slate-400 text-xs font-sans font-semibold uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 rounded-md transition-colors duration-200 bg-[#353a42] hover:bg-[#40454f]"
        >
          {isCopied ? <Icon name="check" className="w-3 h-3 text-emerald-400" /> : <Icon name="copy" className="w-3 h-3" />}
          {isCopied ? 'Tersalin!' : 'Salin Kode'}
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto text-[#abb2bf] font-mono">
        <code>{content}</code>
      </pre>
    </div>
  );
};

const TextBlock = ({ content }) => (
    <div className="prose prose-slate max-w-none prose-p:text-slate-700 prose-headings:text-slate-800 prose-strong:text-slate-800">
        <ReactMarkdown>{content}</ReactMarkdown>
    </div>
);

const renderContentBlock = (block, index) => {
    switch (block.type) {
      case 'html':
        return <HtmlPreview key={index} content={block.content} />;
      case 'javascript':
      case 'css':
      case 'python':
      case 'jsx':
        return <CodeBlock key={index} language={block.type} content={block.content} />;
      case 'text':
      default:
        return <TextBlock key={index} content={block.content} />;
    }
};


// --- Main Application Component ---
export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const textareaRef = useRef(null);
  const resultContainerRef = useRef(null);

  // Set document title on mount
  useEffect(() => {
    document.title = "Chat AI Canva | Antarmuka Modern";
  }, []);
  
  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);
  
  // Scroll to bottom of results when new content is added
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

  return (
    <div className="bg-slate-50 font-sans text-slate-800 flex h-screen">
      {/* --- Sidebar --- */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
                <Icon name="logo" className="w-7 h-7 text-indigo-600"/>
                <h2 className="font-bold text-lg text-slate-800">AI Canva</h2>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 rounded-full hover:bg-slate-100">
                <Icon name="close" className="w-5 h-5" />
            </button>
        </div>
        <nav className="p-4">
            <a href="#" className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 bg-slate-100">Obrolan Baru</a>
            <a href="#" className="block px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 mt-1">Riwayat</a>
            <a href="#" className="block px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 mt-1">Dokumentasi API</a>
        </nav>
      </div>
      
      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col relative">
        {/* --- Top Bar --- */}
        <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-1 rounded-full hover:bg-slate-100">
            <Icon name="menu" className="w-6 h-6" />
          </button>
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-lg font-semibold text-slate-800">Antarmuka Chat AI</h1>
          </div>
        </header>

        {/* --- Chat Area --- */}
        <main ref={resultContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                {result.length === 0 && !loading && !error && (
                    <div className="text-center py-20">
                        <Icon name="bot" className="w-16 h-16 mx-auto text-slate-300"/>
                        <h2 className="mt-4 text-2xl font-bold text-slate-700">Chat AI Canva</h2>
                        <p className="mt-2 text-slate-500">Mulai percakapan dengan mengirimkan permintaan di bawah.</p>
                    </div>
                )}

                {result.length > 0 && (
                    <div className="space-y-6">
                        {result.map(renderContentBlock)}
                    </div>
                )}

                {loading && (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
                        <div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-slate-600 font-medium">AI sedang memproses, mohon tunggu...</p>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                        <p><strong className="font-semibold">Terjadi Kesalahan:</strong> {error}</p>
                    </div>
                )}
            </div>
        </main>
        
        {/* --- Input Form --- */}
        <footer className="p-4 md:p-6 bg-white/60 backdrop-blur-sm border-t border-slate-200">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Kirim permintaan ke AI... (misal: 'buatkan tombol login dengan efek hover')"
                disabled={loading}
                rows={1}
                className="w-full p-4 pr-14 text-base bg-white border border-slate-300 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed enabled:bg-indigo-600 enabled:text-white enabled:hover:bg-indigo-700"
              >
                <Icon name="send" className="w-5 h-5" />
              </button>
            </div>
             <p className="text-center text-xs text-slate-400 mt-2">
                Chat AI Canva dapat memberikan informasi yang tidak akurat. Verifikasi respons penting.
            </p>
          </div>
        </footer>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-20 lg:hidden"></div>}
    </div>
  );
    }
    
