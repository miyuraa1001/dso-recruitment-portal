/**
 * API Endpoint: /api/candidates
 * Fungsi: Mengambil seluruh daftar pelamar dari Google Spreadsheet (DB_KANDIDAT).
 * Terproteksi oleh ADMIN_PIN dan API_SECRET_KEY.
 */
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  const configuredPin = process.env.ADMIN_PIN;
  const adminPinHeader = req.headers['x-admin-pin'] || req.query.pin;

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
    const separator = gasUrl.includes('?') ? '&' : '?';
    const requestUrl = `${gasUrl}${separator}action=LIST&secret=${encodeURIComponent(secretKey)}`;

    const gasResponse = await fetch(requestUrl);
    const result = await gasResponse.json();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data dari Google Apps Script: ' + err.message
    });
  }
};

