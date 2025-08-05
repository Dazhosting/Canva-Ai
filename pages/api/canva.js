// pages/api/canva.js

// Daftar kunci API Anda. Diletakkan di luar handler agar tidak dibuat ulang setiap permintaan.
const apikey_maleyn = [
  'mg-Vmh4rgDCusL1SYdb7JKzliaffDOtRq7x',
  'mg-0Hi4qiYQpduDctTO67qcwkMP8CcTcPtp'
  // Anda bisa menambahkan lebih banyak kunci API di sini
];

// Fungsi untuk mendapatkan kunci API secara acak dari daftar di atas.
function getRandomApiKeymaleyn() {
  const randomIndex = Math.floor(Math.random() * apikey_maleyn.length);
  return apikey_maleyn[randomIndex];
}

export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Ambil 'query' dari body permintaan yang dikirim oleh frontend
  const { query } = req.body;

  // Validasi: pastikan query tidak kosong
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    // 1. Dapatkan kunci API secara acak untuk setiap permintaan (FIXED)
    const apiKey = getRandomApiKeymaleyn();
    
    // 2. Buat URL untuk API eksternal
    const url = `https://api.maelyn.sbs/api/canvaai?q=${encodeURIComponent(query)}&apikey=${apiKey}`;

    // 3. Lakukan panggilan ke API eksternal
    const externalApiResponse = await fetch(url);

    // Periksa jika panggilan fetch tidak berhasil (misal: error 500 dari server maelyn)
    if (!externalApiResponse.ok) {
      throw new Error(`External API responded with status: ${externalApiResponse.status}`);
    }

    // 4. Ubah respons menjadi JSON
    const data = await externalApiResponse.json();

    // 5. Periksa status dari data yang diterima
    if (data.status === "Success" && data.result) {
      // Jika berhasil, kirimkan hasilnya kembali ke frontend
      // Frontend mengharapkan objek dengan properti 'result'
      res.status(200).json({ result: data.result });
    } else {
      // Jika API eksternal melaporkan kegagalan
      throw new Error(data.message || 'Failed to get a successful response from external API.');
    }
  } catch (error) {
    // Tangani semua jenis error (network error, error dari API eksternal, dll)
    console.error('Error in /api/canva:', error.message);
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses permintaan Anda.' });
  }
}
