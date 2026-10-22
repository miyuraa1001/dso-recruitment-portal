/**
 * Main Application Orchestrator
 * Mengontrol alur umum aplikasi, tab switching, form submission, dan inisialisasi.
 */

// Pergantian Tab Navigasi
function switchTab(tab) {
  if (tab === 'hrd' && !isAdminLoggedIn()) {
    showLoginModal();
    return;
  }

  const viewForm = document.getElementById('view-form');
  const viewHrd = document.getElementById('view-hrd');
  const tabBtnForm = document.getElementById('tab-btn-form');
  const tabBtnHrd = document.getElementById('tab-btn-hrd');

  if (viewForm) viewForm.classList.toggle('hidden', tab !== 'form');
  if (viewHrd) viewHrd.classList.toggle('hidden', tab !== 'hrd');

  if (tabBtnForm) {
    tabBtnForm.className = tab === 'form'
      ? 'px-3.5 py-1.5 rounded-md text-xs font-semibold bg-white text-slate-900 shadow-sm transition'
      : 'px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 transition';
  }

  if (tabBtnHrd) {
    tabBtnHrd.className = tab === 'hrd'
      ? 'px-3.5 py-1.5 rounded-md text-xs font-semibold bg-white text-slate-900 shadow-sm transition'
      : 'px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 transition';
  }

  if (tab === 'hrd') {
    fetchCandidates();
  }
}

// Handler Submit Form Pelamar ke Backend Vercel Serverless
async function handleFormSubmit(e) {
  e.preventDefault();

  const payload = getPayload();
  const btn = document.getElementById('btn-submit');
  const alertBox = document.getElementById('submit-alert');

  // Validasi tanda tangan digital
  if (!payload.signature) {
    alert('Harap buat tanda tangan digital Anda pada Bagian 6 sebelum mengirim formulir.');
    setStep(6);
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i> Mengirim Formulir ke Database...';
  }

  if (alertBox) alertBox.classList.add('hidden');

  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: payload })
    });

    const result = await res.json();

    if (res.ok && result.status === 'success') {
      // Tampilkan notifikasi sukses
      if (alertBox) {
        alertBox.className = 'p-4 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2';
        alertBox.innerHTML = '<i class="fa-solid fa-circle-check text-emerald-600 text-base"></i> Terima kasih! Formulir PKB Anda telah berhasil tersimpan di sistem HRD Astra DSO.';
        alertBox.classList.remove('hidden');
      }

      // Reset form setelah 2 detik
      setTimeout(() => {
        resetCandidateForm();
        alert('Data berhasil disimpan! Formulir telah dikembalikan ke kondisi awal.');
        if (alertBox) alertBox.classList.add('hidden');
      }, 2000);

    } else {
      if (alertBox) {
        alertBox.className = 'p-4 rounded-lg text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-2';
        alertBox.innerHTML = `<i class="fa-solid fa-circle-exclamation text-rose-600 text-base"></i> Gagal menyimpan: ${result.message || 'Silakan coba lagi.'}`;
        alertBox.classList.remove('hidden');
      }
    }
  } catch (err) {
    if (alertBox) {
      alertBox.className = 'p-4 rounded-lg text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-2';
      alertBox.innerHTML = `<i class="fa-solid fa-circle-exclamation text-rose-600 text-base"></i> Terjadi kesalahan jaringan: ${err.message}`;
      alertBox.classList.remove('hidden');
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane mr-1.5"></i> Kirim Formulir ke HRD';
    }
  }
}

// Inisialisasi saat halaman selesai dimuat
window.addEventListener('DOMContentLoaded', () => {
  initEmptyTables();
  initSignature();
  updateAdminHeaderUI();
});

