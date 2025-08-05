// pages/api/canva.js

// --- Helper untuk Parsing ---
/**
 * Mem-parsing string mentah dari AI menjadi array objek terstruktur.
 * Mendeteksi blok kode (```html, ```javascript, dll.) dan memisahkannya
 * dari blok teks biasa.
 * @param {string} rawContent - String respons mentah dari API eksternal.
 * @returns {Array<Object>} Array objek dengan format { type, content }.
 */
function parseResponse(rawContent) {
  const blocks = [];
  // Regex untuk menemukan blok kode markdown (e.g., ```html ... ```)
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;

  let lastIndex = 0;
  let match;

  // Loop melalui setiap blok kode yang ditemukan
  while ((match = codeBlockRegex.exec(rawContent)) !== null) {
    // 1. Ambil teks sebelum blok kode
    if (match.index > lastIndex) {
      const textContent = rawContent.substring(lastIndex, match.index).trim();
      if (textContent) {
        blocks.push({ type: 'text', content: textContent });
      }
    }

    // 2. Ambil blok kode itu sendiri
    const language = match[1] || 'code'; // Bahasa (html, js) atau 'code' jika tidak ada
    const codeContent = match[2].trim();
    blocks.push({ type: language.toLowerCase(), content: codeContent });

    // Perbarui indeks untuk pencarian berikutnya
    lastIndex = match.index + match[0].length;
  }

  // 3. Ambil sisa teks setelah blok kode terakhir
  if (lastIndex < rawContent.length) {
    const remainingText = rawContent.substring(lastIndex).trim();
    if (remainingText) {
      blocks.push({ type: 'text', content: remainingText });
    }
  }
  
  // Jika tidak ada blok kode yang ditemukan sama sekali, anggap semuanya sebagai satu blok teks.
  if (blocks.length === 0 && rawContent) {
      blocks.push({ type: 'text', content: rawContent });
  }

  return blocks;
}


// --- API Handler Utama ---

const apikey_maleyn = [
  'mg-Vmh4rgDCusL1SYdb7JKzliaffDOtRq7x',
  'mg-0Hi4qiYQpduDctTO67qcwkMP8CcTcPtp'
];

function getRandomApiKeymaleyn() {
  const randomIndex = Math.floor(Math.random() * apikey_maleyn.length);
  return apikey_maleyn[randomIndex];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const apiKey = getRandomApiKeymaleyn();
    const url = `https://api.maelyn.sbs/api/canvaai?q=${encodeURIComponent(query)}&apikey=${apiKey}`;

    const externalApiResponse = await fetch(url);

    if (!externalApiResponse.ok) {
      // Coba baca pesan error dari API eksternal jika ada
      const errorBody = await externalApiResponse.text();
      console.error(`External API Error Body: ${errorBody}`);
      throw new Error(`External API responded with status: ${externalApiResponse.status}`);
    }

    const data = await externalApiResponse.json();

    if (data.status === "Success" && data.result) {
      // --- INI BAGIAN PENTING ---
      // Panggil fungsi parser untuk mengubah string menjadi array terstruktur
      const structuredResult = parseResponse(data.result);
      
      // Kirim hasil yang sudah terstruktur ke frontend
      res.status(200).json({ result: structuredResult });
    } else {
      throw new Error(data.message || 'Failed to get a successful response from external API.');
    }
  } catch (error) {
    console.error('Error in /api/canva:', error.message);
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses permintaan Anda.' });
  }
}
