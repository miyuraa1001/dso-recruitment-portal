/**
 * API Endpoint: /api/submit
 * Fungsi: Menerima data pendaftaran kandidat dari form publik, 
 * menginjeksikan API_SECRET_KEY, dan menyimpannya ke Google Apps Script / Sheet.
 */
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  const gasUrl = process.env.GAS_WEBAPP_URL;
  const secretKey = process.env.API_SECRET_KEY || '';

  if (!gasUrl) {
    return res.status(500).json({
      status: 'error',
      message: 'GAS_WEBAPP_URL belum dikonfigurasi di Environment Variable Vercel.'
    });
  }

  try {
    const payload = req.body || {};
    if (!payload.data || !payload.data.nama || !payload.data.posisi) {
      return res.status(400).json({
        status: 'error',
        message: 'Data pelamar tidak lengkap (Nama & Posisi wajib diisi).'
      });
    }

    const gasResponse = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'SUBMIT',
        secret: secretKey,
        data: payload.data
      })
    });

    const result = await gasResponse.json();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal menghubungi Google Apps Script: ' + err.message
    });
  }
};

