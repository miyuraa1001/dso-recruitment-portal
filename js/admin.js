/**
 * Module: Admin HRD Dashboard & ZIP Download
 * Mengelola autentikasi sesi Admin, pemanggilan API kandidat, dan download .ZIP
 */

let candidatesList = [];
let filteredCandidates = [];

// Cek apakah admin sudah login di sesi browser ini
function isAdminLoggedIn() {
  return sessionStorage.getItem('dso_admin_authenticated') === 'true';
}

function getAdminPin() {
  return sessionStorage.getItem('dso_admin_pin') || '';
}

function showLoginModal() {
  const modal = document.getElementById('admin-login-modal');
  if (modal) {
    modal.classList.remove('hidden');
    const input = document.getElementById('admin_pin_input');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 100);
    }
  }
}

function hideLoginModal() {
  const modal = document.getElementById('admin-login-modal');
  if (modal) modal.classList.add('hidden');
  const alertBox = document.getElementById('admin-login-alert');
  if (alertBox) alertBox.classList.add('hidden');
}

async function handleAdminLogin(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('admin_pin_input');
  const pin = input ? input.value.trim() : '';
  const alertBox = document.getElementById('admin-login-alert');
  const btn = document.getElementById('btn-admin-login-submit');

  if (!pin) {
    if (alertBox) {
      alertBox.textContent = 'Silakan masukkan PIN Admin HRD.';
      alertBox.classList.remove('hidden');
    }
    return;
  }

  try {
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Memverifikasi...';
    }

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });

    const result = await res.json();

    if (res.ok && result.status === 'success') {
      sessionStorage.setItem('dso_admin_authenticated', 'true');
      sessionStorage.setItem('dso_admin_pin', pin);
      hideLoginModal();
      updateAdminHeaderUI();
      switchTab('hrd');
      fetchCandidates();
    } else {
      if (alertBox) {
        alertBox.textContent = result.message || 'PIN Admin tidak valid.';
        alertBox.classList.remove('hidden');
      }
    }
  } catch (err) {
    if (alertBox) {
      alertBox.textContent = 'Gagal menghubungi server: ' + err.message;
      alertBox.classList.remove('hidden');
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = 'Masuk ke Dashboard';
    }
  }
}

function logoutAdmin() {
  sessionStorage.removeItem('dso_admin_authenticated');
  sessionStorage.removeItem('dso_admin_pin');
  candidatesList = [];
  filteredCandidates = [];
  updateAdminHeaderUI();
  switchTab('form');
}

function updateAdminHeaderUI() {
  const isAuth = isAdminLoggedIn();
  const loginBtn = document.getElementById('btn-header-login');
  const logoutBtn = document.getElementById('btn-header-logout');

  if (loginBtn) loginBtn.classList.toggle('hidden', isAuth);
  if (logoutBtn) logoutBtn.classList.toggle('hidden', !isAuth);
}

// Mengambil data pelamar melalui Vercel Serverless Function
async function fetchCandidates() {
  if (!isAdminLoggedIn()) {
    showLoginModal();
    return;
  }

  const tbody = document.getElementById('tbody-candidates');
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-slate-500"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Mengambil data pelamar dari Spreadsheet...</td></tr>`;
  }

  try {
    const pin = getAdminPin();
    const res = await fetch('/api/candidates', {
      method: 'GET',
      headers: {
        'x-admin-pin': pin
      }
    });

    const result = await res.json();
    if (res.ok && result.data) {
      candidatesList = result.data;
      filteredCandidates = [...candidatesList];
      renderCandidatesTable();
    } else {
      if (res.status === 401) {
        logoutAdmin();
        showLoginModal();
      } else {
        alert('Gagal mengambil data: ' + (result.message || 'Unknown error'));
        renderCandidatesTable();
      }
    }
  } catch (err) {
    alert('Terjadi kesalahan saat memuat data: ' + err.message);
    renderCandidatesTable();
  }
}

// Pencarian Cepat Nama / Posisi / KTP
function filterCandidates() {
  const query = (document.getElementById('search-candidate')?.value || '').toLowerCase().trim();
  if (!query) {
    filteredCandidates = [...candidatesList];
  } else {
    filteredCandidates = candidatesList.filter(c =>
      (c.nama && c.nama.toLowerCase().includes(query)) ||
      (c.posisi && c.posisi.toLowerCase().includes(query)) ||
      (c.ktp && c.ktp.toLowerCase().includes(query))
    );
  }
  renderCandidatesTable();
}

// Render Tabel Kandidat
function renderCandidatesTable() {
  const tbody = document.getElementById('tbody-candidates');
  if (!tbody) return;

  const countBadge = document.getElementById('candidate-count');
  if (countBadge) {
    countBadge.textContent = `${filteredCandidates.length} Pelamar`;
  }

  if (!filteredCandidates.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-8 text-center text-slate-400">
          <i class="fa-regular fa-folder-open text-2xl mb-2 block text-slate-300"></i>
          Belum ada data peserta yang cocok. Klik "Refresh Data" untuk memperbarui.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredCandidates.map((c, idx) => `
    <tr class="hover:bg-slate-50 transition border-b border-slate-100">
      <td class="p-3 text-slate-500 whitespace-nowrap">${c.timestamp || '-'}</td>
      <td class="p-3 font-semibold text-slate-900">${c.nama || '-'}</td>
      <td class="p-3 text-slate-700">${c.posisi || '-'}</td>
      <td class="p-3 font-mono text-[11px] text-slate-600">${c.ktp || '-'}</td>
      <td class="p-3 text-slate-600">${c.hp || '-'}</td>
      <td class="p-3 font-mono text-[11px] text-slate-600">${c.bank_norek || '-'}</td>
      <td class="p-3 text-right whitespace-nowrap">
        <button onclick="downloadZipFromSpreadsheet(${idx})" id="btn-zip-${idx}" class="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold px-3 py-1.5 rounded-lg text-xs shadow-sm inline-flex items-center gap-1.5 transition">
          <i class="fa-solid fa-file-zipper"></i> Download .ZIP (PDF Excel)
        </button>
      </td>
    </tr>
  `).join('');
}

// Download Satuan ZIP (PDF Asli per Sheet dari Template Excel)
async function downloadZipFromSpreadsheet(idx) {
  const candidate = filteredCandidates[idx];
  if (!candidate) return;

  const hrdData = {
    notes: document.getElementById('hrd_notes')?.value || '',
    npk: document.getElementById('hrd_npk')?.value || '',
    kodept: document.getElementById('hrd_kodept')?.value || '',
    tglmasuk: document.getElementById('hrd_tglmasuk')?.value || '',
    gapok: document.getElementById('hrd_gapok')?.value || '',
    noform: document.getElementById('hrd_noform')?.value || ''
  };

  const statusBox = document.getElementById('zip-status');
  const statusText = document.getElementById('zip-status-text');
  const btn = document.getElementById(`btn-zip-${idx}`);

  if (statusBox) statusBox.classList.remove('hidden');
  if (statusText) {
    statusText.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i>Sedang memproses template Excel & membuat PDF untuk <strong>${candidate.nama}</strong>...`;
  }
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Memproses...`;
  }

  try {
    const pin = getAdminPin();
    const res = await fetch('/api/generate-zip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': pin
      },
      body: JSON.stringify({
        data: candidate,
        hrd: hrdData
      })
    });

    const result = await res.json();
    if (res.ok && result.status === 'success' && result.zipBase64) {
      // Decode Base64 to Blob & Trigger Download
      const byteCharacters = atob(result.zipBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/zip' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = result.filename || `PKB_DSO_${candidate.nama.replace(/\s+/g, '_')}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } else {
      alert('Gagal membuat ZIP: ' + (result.message || 'Terjadi kesalahan'));
    }
  } catch (err) {
    alert('Terjadi kesalahan saat memproses download: ' + err.message);
  } finally {
    if (statusBox) statusBox.classList.add('hidden');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-file-zipper"></i> Download .ZIP (PDF Excel)`;
    }
  }
}

