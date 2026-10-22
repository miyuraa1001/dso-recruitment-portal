/**
 * API Endpoint: /api/generate-zip
 * Fungsi: Mengisi sel template Excel asli dan meng-export masing-masing Sheet
 * menjadi PDF lalu dibungkus menjadi 1 file .ZIP.
 * Terproteksi oleh ADMIN_PIN dan API_SECRET_KEY.
 */
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  const configuredPin = process.env.ADMIN_PIN;
  const adminPinHeader = req.headers['x-admin-pin'] || (req.body && req.body.pin);

  // Verifikasi otorisasi HRD
  if (configuredPin && String(adminPinHeader).trim() !== String(configuredPin).trim()) {
    return res.status(401).json({
      status: 'error',
      message: 'Akses ditolak: Sesi atau PIN Admin tidak valid.'
    });
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
    const { data, hrd } = req.body || {};
    if (!data || !data.nama) {
      return res.status(400).json({
        status: 'error',
        message: 'Data pelamar tidak valid untuk membuat cetakan ZIP.'
      });
    }

    const gasResponse = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'GENERATE_ZIP',
        secret: secretKey,
        data,
        hrd: hrd || {}
      })
    });

    const result = await gasResponse.json();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memproses cetakan ZIP di Google Apps Script: ' + err.message
    });
  }
};

