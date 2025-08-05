import React, { useState, useRef, useEffect } from 'react';

// --- Icon Components ---
// Ikon tetap sebagai komponen SVG inline.
const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z"/>
        <path d="m22 2-11 11"/>
    </svg>
);

// --- Main App Component ---
export default function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Halo! Saya Chat AI Canva. Beri tahu saya apa yang ingin Anda buat, dan saya akan bantu membuatkannya untuk Anda.' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // --- Styles Object (CSS-in-JS) ---
  // Semua gaya didefinisikan dalam objek ini.
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#111827', // bg-gray-900
      color: 'white',
      fontFamily: "'Inter', sans-serif",
    },
    header: {
      backgroundColor: 'rgba(31, 41, 55, 0.5)', // bg-gray-800/50
      backdropFilter: 'blur(4px)',
      borderBottom: '1px solid #374151', // border-gray-700
      padding: '1rem',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // shadow-lg
    },
    headerTitle: {
      fontSize: '1.5rem', // text-2xl
      fontWeight: 'bold',
      textAlign: 'center',
      background: 'linear-gradient(to right, #a78bfa, #f472b6)', // from-purple-400 to-pink-500
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    main: {
      flex: 1,
      overflowY: 'auto',
      padding: '1.5rem',
    },
    messagesContainer: {
        maxWidth: '56rem', // max-w-4xl
        margin: '0 auto',
    },
    messageRow: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        margin: '1rem 0',
    },
    userMessageRow: {
        justifyContent: 'flex-end',
    },
    botMessageRow: {
        justifyContent: 'flex-start',
    },
    iconContainer: {
        padding: '0.5rem',
        borderRadius: '9999px',
    },
    botIconContainer: {
        background: 'linear-gradient(to bottom right, #8b5cf6, #ec4899)', // from-purple-500 to-pink-600
    },
    userIconContainer: {
        backgroundColor: '#374151', // bg-gray-700
    },
    messageBubble: {
        maxWidth: '80%',
        padding: '12px 20px',
        borderRadius: '1.25rem',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        whiteSpace: 'pre-wrap',
    },
    userMessageBubble: {
        backgroundColor: '#2563eb', // bg-blue-600
        borderBottomRightRadius: '0.25rem',
    },
    botMessageBubble: {
        backgroundColor: '#374151', // bg-gray-700
        borderBottomLeftRadius: '0.25rem',
    },
    loaderBubble: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
    },
    loaderDot: {
        width: '8px',
        height: '8px',
        backgroundColor: 'white',
        borderRadius: '50%',
    },
    footer: {
      backgroundColor: 'rgba(31, 41, 55, 0.5)', // bg-gray-800/50
      backdropFilter: 'blur(4px)',
      borderTop: '1px solid #374151', // border-gray-700
      padding: '1rem',
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#374151', // bg-gray-700
        borderRadius: '0.75rem', // rounded-xl
        padding: '0.5rem',
        boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)', // shadow-inner
        maxWidth: '56rem', // max-w-4xl
        margin: '0 auto',
    },
    textarea: {
        flex: 1,
        backgroundColor: 'transparent',
        padding: '0.5rem',
        color: 'white',
        border: 'none',
        outline: 'none',
        resize: 'none',
        maxHeight: '100px',
    },
    sendButton: {
        padding: '0.75rem',
        borderRadius: '0.5rem',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        background: 'linear-gradient(to bottom right, #8b5cf6, #ec4899)', // from-purple-500 to-pink-600
    },
    sendButtonDisabled: {
        backgroundColor: '#4b5563', // bg-gray-600
        cursor: 'not-allowed',
        background: 'none',
    },
  };

  // --- CSS String for styles not possible with inline styles ---
  // (e.g., keyframes, pseudo-classes like :hover, placeholder color)
  const styleTag = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in-up {
      animation: fade-in-up 0.5s ease-out forwards;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .dot-1 { animation: pulse 1.5s infinite; animation-delay: -0.3s; }
    .dot-2 { animation: pulse 1.5s infinite; animation-delay: -0.15s; }
    .dot-3 { animation: pulse 1.5s infinite; }

    textarea::placeholder {
        color: #9ca3af; /* placeholder-gray-400 */
    }

    /* We use a class for the hover effect because it's not possible inline */
    .send-button:hover {
        transform: scale(1.1);
        background: linear-gradient(to bottom right, #a855f7, #d946ef); /* hover:from-purple-600 hover:to-pink-700 */
    }
  `;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Simulasi panggilan API
      await new Promise(resolve => setTimeout(resolve, 1500));
      const data = { result: `Tentu, ini adalah ide desain untuk: "${input}". Saya akan membuatkan beberapa variasi visual yang menarik untuk Anda.` };

      const botMessage = { role: 'bot', content: data.result || 'Maaf, saya tidak menerima respons. Silakan coba lagi.' };
      setMessages(prev => [...prev, botMessage]);

    } catch (e) {
      const errorMessage = { role: 'bot', content: '❌ Gagal terhubung ke server. Silakan periksa koneksi Anda dan coba lagi.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.container}>
      {/* Menambahkan tag <style> untuk menangani keyframes dan pseudo-class */}
      <style>{styleTag}</style>

      <header style={styles.header}>
        <h1 style={styles.headerTitle}>🎨 Chat AI Canva</h1>
      </header>

      <main style={styles.main}>
        <div style={styles.messagesContainer}>
            {messages.map((msg, index) => (
              <div key={index} className="animate-fade-in-up" style={{...styles.messageRow, ...(msg.role === 'user' ? styles.userMessageRow : styles.botMessageRow)}}>
                {msg.role === 'bot' && (
                  <div style={{...styles.iconContainer, ...styles.botIconContainer}}>
                    <BotIcon />
                  </div>
                )}
                <div style={{...styles.messageBubble, ...(msg.role === 'user' ? styles.userMessageBubble : styles.botMessageBubble)}}>
                  <p>{msg.content}</p>
                </div>
                 {msg.role === 'user' && (
                  <div style={{...styles.iconContainer, ...styles.userIconContainer}}>
                    <UserIcon />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="animate-fade-in-up" style={{...styles.messageRow, ...styles.botMessageRow}}>
                <div style={{...styles.iconContainer, ...styles.botIconContainer}}>
                    <BotIcon />
                </div>
                <div style={{...styles.messageBubble, ...styles.botMessageBubble, ...styles.loaderBubble}}>
                  <div style={styles.loaderDot} className="dot-1"></div>
                  <div style={styles.loaderDot} className="dot-2"></div>
                  <div style={styles.loaderDot} className="dot-3"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </main>

      <footer style={styles.footer}>
        <div style={styles.inputContainer}>
            <textarea
              rows={1}
              style={styles.textarea}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik prompt Anda di sini..."
              disabled={loading}
            />
            <button
              onClick={handleSend}
              style={{...styles.sendButton, ...(loading ? styles.sendButtonDisabled : {})}}
              className={!loading ? 'send-button' : ''}
              disabled={loading}
            >
              <SendIcon />
            </button>
        </div>
      </footer>
    </div>
  );
}

  
