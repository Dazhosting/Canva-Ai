// pages/api/canva.js

const apikey_maleyn = [
  'mg-Vmh4rgDCusL1SYdb7JKzliaffDOtRq7x',
  'mg-0Hi4qiYQpduDctTO67qcwkMP8CcTcPtp'
];

function getRandomApiKeymaleyn() {
  return apikey_maleyn[Math.floor(Math.random() * apikey_maleyn.length)];
}

const repo = process.env.GITHUB_REPO;
const filePath = process.env.GITHUB_FILE_PATH;
const token = process.env.GITHUB_TOKEN;

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';
}

async function fetchIPData() {
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
    headers: { Authorization: `token ${token}` }
  });
  const json = await res.json();

  if (!json.content || !json.sha) throw new Error('Gagal membaca file JSON');
  const content = Buffer.from(json.content, 'base64').toString();
  return { data: JSON.parse(content), sha: json.sha };
}

async function updateIPData(data, sha) {
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Update IP usage',
      content,
      sha
    })
  });
  return await res.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const ip = getClientIP(req);
  const { query } = req.body;

  try {
    const { data, sha } = await fetchIPData();

    data[ip] = (data[ip] || 0) + 1;
    if (data[ip] > 5) {
      return res.status(429).json({
        result: '❌ Limit penggunaan tercapai untuk IP ini (maksimal 5x).'
      });
    }

    await updateIPData(data, sha);

    const apiKey = getRandomApiKeymaleyn();
    const url = `https://api.maelyn.sbs/api/canvaai?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'mg-apikey': apiKey }
    });
    const result = await response.json();

    return res.status(200).json({ result: result.result || '❌ Tidak ada respons dari API.' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ result: '❌ Terjadi kesalahan saat mengambil data.' });
  }
}
