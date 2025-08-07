export default async function handler(req, res) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'No token provided' });
  }

  const formData = new URLSearchParams();
  formData.append('secret', '0x4AAAAAABpPhbR8eXmnE182CoH2Ykg6nCk'); // Secret Key
  formData.append('response', token);

  try {
    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const data = await result.json();

    if (data.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
