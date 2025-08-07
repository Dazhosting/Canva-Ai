export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query, token } = req.body;

  if (!query || !token) {
    return res.status(400).json({ error: 'Query dan token Turnstile wajib diisi.' });
  }

  const formData = new URLSearchParams();
  formData.append('secret', '0x4AAAAAABpPhbR8eXmnE182CoH2Ykg6nCk');
  formData.append('response', token);

  try {
    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData
    });

    const result = await turnstileRes.json();

    if (!result.success) {
      return res.status(403).json({ error: 'Verifikasi bot gagal. Akses ditolak.' });
    }

    const apiKey = getRandomApiKeymaleyn();
    const url = `https://api.maelyn.sbs/api/canvaai?q=${encodeURIComponent(query)}&apikey=${apiKey}`;
    const externalApiResponse = await fetch(url);

    if (!externalApiResponse.ok) {
      const errorBody = await externalApiResponse.text();
      console.error(`External API Error Body: ${errorBody}`);
      throw new Error(`External API responded with status: ${externalApiResponse.status}`);
    }

    const data = await externalApiResponse.json();

    if (data.status === "Success" && data.result) {
      const structuredResult = parseResponse(data.result);
      res.status(200).json({ result: structuredResult });
    } else {
      throw new Error(data.message || 'Gagal mendapatkan response dari API eksternal.');
    }

  } catch (error) {
    console.error('Error in /api/canva:', error.message);
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses permintaan Anda.' });
  }
}

// Helper
function parseResponse(rawContent) {
  const blocks = [];
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;

  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(rawContent)) !== null) {
    if (match.index > lastIndex) {
      const textContent = rawContent.substring(lastIndex, match.index).trim();
      if (textContent) blocks.push({ type: 'text', content: textContent });
    }

    const language = match[1] || 'code';
    const codeContent = match[2].trim();
    blocks.push({ type: language.toLowerCase(), content: codeContent });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < rawContent.length) {
    const remainingText = rawContent.substring(lastIndex).trim();
    if (remainingText) blocks.push({ type: 'text', content: remainingText });
  }

  if (blocks.length === 0 && rawContent) {
    blocks.push({ type: 'text', content: rawContent });
  }

  return blocks;
}

const apikey_maleyn = [
  'mg-Vmh4rgDCusL1SYdb7JKzliaffDOtRq7x',
  'mg-0Hi4qiYQpduDctTO67qcwkMP8CcTcPtp'
];

function getRandomApiKeymaleyn() {
  const randomIndex = Math.floor(Math.random() * apikey_maleyn.length);
  return apikey_maleyn[randomIndex];
}
