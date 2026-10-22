/**
 * API Endpoint: /api/auth
 * Fungsi: Verifikasi PIN Admin HRD untuk akses dashboard & download
 */
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  try {
    const { pin } = req.body || {};
    const configuredPin = process.env.ADMIN_PIN;

    if (!configuredPin) {
      return res.status(500).json({
        status: 'error',
        message: 'ADMIN_PIN belum di-set pada Environment Variable Vercel.'
      });
    }

    if (String(pin).trim() === String(configuredPin).trim()) {
      return res.status(200).json({
        status: 'success',
        message: 'Autentikasi HRD berhasil'
      });
    } else {
      return res.status(401).json({
        status: 'error',
        message: 'PIN Admin salah atau tidak sesuai.'
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message || 'Terjadi kesalahan pada server.'
    });
  }
};

