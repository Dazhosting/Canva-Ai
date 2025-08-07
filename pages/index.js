import React, { useState, useEffect } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

// --- Helper Components for Icons (No changes needed here) ---

const MenuIcon = ({ style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={style}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const XIcon = ({ style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={style}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// --- Style Objects (CSS-in-JS) ---
// We define all our styles here as JavaScript objects.
const styles = {
    // Global and Animation Styles
    globalStyles: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            background-color: #f9fafb; /* bg-gray-50 */
            color: #111827; /* text-gray-900 */
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `,
    // Layout Styles
    main: {
        minHeight: '100vh',
    },
    container: {
        width: '100%',
        maxWidth: '896px', // max-w-4xl
        margin: '0 auto',
        padding: '1rem', // p-4
    },
    // Header Styles
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem', // mb-8
    },
    headerTitle: {
        fontSize: '1.875rem', // text-3xl
        fontWeight: 'bold',
        color: '#1f2937', // text-gray-800
    },
    headerTitleSpan: {
        color: '#3b82f6', // text-blue-500
    },
    menuContainer: {
        position: 'relative',
    },
    menuButton: {
        padding: '0.5rem',
        borderRadius: '9999px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    menuButtonHover: {
        backgroundColor: '#e5e7eb', // hover:bg-gray-200
    },
    icon: {
        width: '1.5rem',
        height: '1.5rem',
    },
    dropdownMenu: {
        position: 'absolute',
        right: 0,
        marginTop: '0.5rem',
        width: '12rem',
        backgroundColor: '#ffffff',
        borderRadius: '0.5rem', // rounded-lg
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-xl
        padding: '0.5rem 0',
        zIndex: 10,
    },
    dropdownItem: {
        display: 'block',
        width: '100%',
        padding: '0.5rem 1rem',
        textAlign: 'left',
        color: '#1f2937',
        textDecoration: 'none',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
    },
    dropdownItemHover: {
        backgroundColor: '#3b82f6', // hover:bg-blue-500
        color: '#ffffff', // hover:text-white
    },
    // Form Styles
    formContainer: {
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '1rem', // rounded-2xl
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
    },
    label: {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '0.5rem',
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
        boxSizing: 'border-box', // Important for width: 100%
    },
    turnstileContainer: {
        display: 'flex',
        justifyContent: 'center',
        margin: '1.5rem 0',
    },
    errorText: {
        color: '#ef4444', // text-red-500
        textAlign: 'center',
        marginBottom: '1rem',
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#2563eb', // bg-blue-600
        color: '#ffffff',
        fontWeight: 'bold',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease-in-out',
    },
    submitButtonHover: {
        backgroundColor: '#1d4ed8', // hover:bg-blue-700
    },
    submitButtonDisabled: {
        backgroundColor: '#9ca3af', // disabled:bg-gray-400
        cursor: 'not-allowed',
    },
    loadingContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinner: {
        width: '1.25rem',
        height: '1.25rem',
        marginRight: '0.75rem',
    },
    // Result Styles
    resultContainer: {
        marginTop: '2rem',
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    resultTitle: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '1rem',
    },
    resultContent: {
        backgroundColor: '#f3f4f6', // bg-gray-100
        padding: '1rem',
        borderRadius: '0.5rem',
        color: '#374151',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        marginTop: '1rem',
    },
    // Docs Page Styles
    docsBackButton: {
        marginBottom: '1.5rem',
        backgroundColor: '#e5e7eb',
        color: '#1f2937',
        fontWeight: 'bold',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        border: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    docsBackButtonIcon: {
        width: '1.25rem',
        height: '1.25rem',
        marginRight: '0.5rem'
    },
};

// --- Custom Hook for Hover State ---
const useHover = () => {
    const [hovered, setHovered] = useState(false);
    const eventHandlers = {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
    };
    return [hovered, eventHandlers];
};


// --- Main Application Components ---

const DocsPage = ({ onBack }) => {
    const [backHovered, backEventHandlers] = useHover();

    const backButtonStyle = {
        ...styles.docsBackButton,
        ...(backHovered && { backgroundColor: '#d1d5db' })
    };

    return (
        <div style={styles.container}>
            <button onClick={onBack} style={backButtonStyle} {...backEventHandlers}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={styles.docsBackButtonIcon}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Kembali
            </button>
            <div style={styles.formContainer}>
                <h1 style={styles.headerTitle}>Dokumentasi API</h1>
                <p>
                    Selamat datang di halaman dokumentasi. Di sini Anda akan menemukan semua informasi yang Anda butuhkan untuk berintegrasi dengan Canva AI API kami.
                </p>
            </div>
        </div>
    );
};

const HomePage = ({ onNavigate }) => {
    const [query, setQuery] = useState('');
    const [token, setToken] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Hover states for interactive elements
    const [menuBtnHovered, menuBtnHandlers] = useHover();
    const [docsLinkHovered, docsLinkHandlers] = useHover();
    const [submitHovered, submitHandlers] = useHover();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!token) {
            setError("Silakan selesaikan verifikasi untuk membuktikan Anda bukan bot!");
            return;
        }

        setLoading(true);
        setResult(null);
        try {
            const res = await fetch('/api/canva', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, token })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan saat mengambil data.');
            setResult(data.result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Combine base, hover, and disabled styles for the submit button
    const submitButtonStyle = {
        ...styles.submitButton,
        ...(submitHovered && !loading && query ? styles.submitButtonHover : {}),
        ...((loading || !query) ? styles.submitButtonDisabled : {}),
    };
    
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.headerTitle}>
                    🔐 Canva AI <span style={styles.headerTitleSpan}>(Turnstile Verified)</span>
                </h1>
                <div style={styles.menuContainer}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{...styles.menuButton, ...(menuBtnHovered && styles.menuButtonHover)}}
                        {...menuBtnHandlers}
                    >
                       {isMenuOpen ? <XIcon style={styles.icon}/> : <MenuIcon style={styles.icon}/>}
                    </button>
                    {isMenuOpen && (
                        <div style={styles.dropdownMenu}>
                            <a
                                href="#docs"
                                onClick={(e) => { e.preventDefault(); onNavigate('docs'); setIsMenuOpen(false); }}
                                style={{...styles.dropdownItem, ...(docsLinkHovered && styles.dropdownItemHover)}}
                                {...docsLinkHandlers}
                            >
                                Docs API
                            </a>
                        </div>
                    )}
                </div>
            </header>

            <div style={styles.formContainer}>
                <form onSubmit={handleSubmit}>
                    <div style={{marginBottom: '1rem'}}>
                        <label htmlFor="query" style={styles.label}>Masukkan Perintah Anda</label>
                        <input
                            id="query"
                            type="text"
                            placeholder="Contoh: Buatkan logo untuk kedai kopi..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.turnstileContainer}>
                         <Turnstile siteKey="0x4AAAAAAABpPhesYPXS-t09V" onSuccess={setToken} />
                    </div>
                    
                    {error && <p style={styles.errorText}>{error}</p>}

                    <button type="submit" disabled={loading || !query} style={submitButtonStyle} {...submitHandlers}>
                        {loading ? (
                            <div style={styles.loadingContainer}>
                                <div className="animate-spin" style={styles.spinner}>
                                  <svg fill="none" viewBox="0 0 24 24">
                                    <circle style={{opacity: 0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path style={{opacity: 0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                </div>
                                Memproses...
                            </div>
                        ) : 'Kirim Perintah'}
                    </button>
                </form>
            </div>

            {result && (
                <div style={styles.resultContainer} className="animate-fade-in">
                    <h3 style={styles.resultTitle}>Hasil:</h3>
                    <div>
                        {result.map((block, index) => (
                            <pre key={index} style={styles.resultContent}>{block.content}</pre>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function App() {
    const [page, setPage] = useState('home');

    return (
        <main style={styles.main}>
            {/* This style tag injects global styles and animations */}
            <style>{styles.globalStyles}</style>
            
            {page === 'home' && <HomePage onNavigate={setPage} />}
            {page === 'docs' && <DocsPage onBack={() => setPage('home')} />}
        </main>
    );
  }
                
