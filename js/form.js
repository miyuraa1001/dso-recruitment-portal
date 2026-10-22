/**
 * Module: Form Peserta & Dynamic Tables
 * Mengelola form wizard 6 step, tabel dinamis susunan Excel asli, dan serialisasi payload.
 */

function initEmptyTables() {
  // 1. Keluarga Inti (Suami/Istri + Anak 1 s/d 4)
  const relationsInti = ['Suami/Istri', 'Anak 1', 'Anak 2', 'Anak 3', 'Anak 4'];
  const tbodyInti = document.getElementById('tbody-inti');
  if (tbodyInti) {
    tbodyInti.innerHTML = relationsInti.map((rel, i) => `
      <tr>
        <td class="p-2 font-medium text-slate-700 bg-slate-50/60">${rel}</td>
        <td class="p-1"><input type="text" id="ki_nama_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1">
          <select id="ki_lp_${i}" class="table-input">
            <option value=""></option><option value="L">L</option><option value="P">P</option>
          </select>
        </td>
        <td class="p-1"><input type="text" id="ki_ttl_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="ki_pend_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="ki_pek_${i}" class="table-input" placeholder="..." /></td>
      </tr>
    `).join('');
  }

  // 2. Keluarga Ortu (Ayah, Ibu, Anak 1 s/d 7)
  const relationsOrtu = ['Ayah', 'Ibu', 'Anak 1', 'Anak 2', 'Anak 3', 'Anak 4', 'Anak 5', 'Anak 6', 'Anak 7'];
  const tbodyOrtu = document.getElementById('tbody-ortu');
  if (tbodyOrtu) {
    tbodyOrtu.innerHTML = relationsOrtu.map((rel, i) => `
      <tr>
        <td class="p-2 font-medium text-slate-700 bg-slate-50/60">${rel}</td>
        <td class="p-1"><input type="text" id="ko_nama_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1">
          <select id="ko_lp_${i}" class="table-input">
            <option value=""></option>
            <option value="L" ${rel === 'Ayah' ? 'selected' : ''}>L</option>
            <option value="P" ${rel === 'Ibu' ? 'selected' : ''}>P</option>
          </select>
        </td>
        <td class="p-1"><input type="text" id="ko_ttl_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="ko_pend_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="ko_pek_${i}" class="table-input" placeholder="..." /></td>
      </tr>
    `).join('');
  }

  // 3. Ahli Waris (3 Baris)
  const tbodyWaris = document.getElementById('tbody-waris');
  if (tbodyWaris) {
    tbodyWaris.innerHTML = [0, 1, 2].map(i => `
      <tr>
        <td class="p-2 text-center text-slate-500 bg-slate-50/60">${i + 1}</td>
        <td class="p-1"><input type="text" id="aw_nama_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="aw_ttl_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1">
          <select id="aw_lp_${i}" class="table-input">
            <option value=""></option><option value="L">L</option><option value="P">P</option>
          </select>
        </td>
        <td class="p-1"><input type="text" id="aw_hub_${i}" class="table-input" placeholder="Ibu / Suami / Istri / Anak" /></td>
        <td class="p-1"><input type="text" id="aw_pek_${i}" class="table-input" placeholder="..." /></td>
      </tr>
    `).join('');
  }

  // 4. Pendidikan Formal (SMA, Dipl., S1)
  const jenjang = ['SMA', 'Dipl.', 'S1'];
  const tbodyPendidikan = document.getElementById('tbody-pendidikan');
  if (tbodyPendidikan) {
    tbodyPendidikan.innerHTML = jenjang.map((j, i) => `
      <tr>
        <td class="p-2 font-semibold text-slate-700 bg-slate-50/60">${j}</td>
        <td class="p-1"><input type="text" id="pf_nama_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="pf_fak_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="pf_jur_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="pf_prodi_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="pf_kota_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="pf_thn_${i}" class="table-input" placeholder="2020 s/d 2023" /></td>
        <td class="p-1"><input type="text" id="pf_ket_${i}" class="table-input" placeholder="Lulus" /></td>
      </tr>
    `).join('');
  }

  // 5. Kursus (2 Baris)
  const tbodyKursus = document.getElementById('tbody-kursus');
  if (tbodyKursus) {
    tbodyKursus.innerHTML = [0, 1].map(i => `
      <tr>
        <td class="p-2 text-center text-slate-500 bg-slate-50/60">${i + 1}</td>
        <td class="p-1"><input type="text" id="knf_nama_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="knf_tempat_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="knf_thn_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="knf_ket_${i}" class="table-input" placeholder="..." /></td>
      </tr>
    `).join('');
  }

  // 6. Bahasa Asing (2 Baris)
  const tbodyBahasa = document.getElementById('tbody-bahasa');
  if (tbodyBahasa) {
    tbodyBahasa.innerHTML = [0, 1].map(i => `
      <tr>
        <td class="p-2 text-center text-slate-500 bg-slate-50/60">${i + 1}</td>
        <td class="p-1"><input type="text" id="bhs_nama_${i}" class="table-input" placeholder="Contoh: Inggris" /></td>
        <td class="p-1">
          <select id="bhs_lisan_${i}" class="table-input">
            <option value="">-- Pilih --</option><option value="Kurang">Kurang</option><option value="Cukup">Cukup</option><option value="Baik">Baik</option>
          </select>
        </td>
        <td class="p-1">
          <select id="bhs_tulis_${i}" class="table-input">
            <option value="">-- Pilih --</option><option value="Kurang">Kurang</option><option value="Cukup">Cukup</option><option value="Baik">Baik</option>
          </select>
        </td>
      </tr>
    `).join('');
  }

  // 7. Pengalaman Kerja (5 Baris)
  const tbodyKerja = document.getElementById('tbody-kerja');
  if (tbodyKerja) {
    tbodyKerja.innerHTML = [0, 1, 2, 3, 4].map(i => `
      <tr>
        <td class="p-2 text-center text-slate-500 bg-slate-50/60">${i + 1}</td>
        <td class="p-1"><input type="text" id="pk_pt_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="pk_jab_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="pk_thn_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="pk_gaji_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="pk_alasan_${i}" class="table-input" placeholder="..." /></td>
      </tr>
    `).join('');
  }

  // 8. Organisasi (2 Baris)
  const tbodyOrg = document.getElementById('tbody-org');
  if (tbodyOrg) {
    tbodyOrg.innerHTML = [0, 1].map(i => `
      <tr>
        <td class="p-2 text-center text-slate-500 bg-slate-50/60">${i + 1}</td>
        <td class="p-1"><input type="text" id="org_nama_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="org_tempat_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="org_jab_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="org_thn_${i}" class="table-input" placeholder="..." /></td>
      </tr>
    `).join('');
  }

  // 9. Kenalan (2 Baris)
  const tbodyKenalan = document.getElementById('tbody-kenalan');
  if (tbodyKenalan) {
    tbodyKenalan.innerHTML = [0, 1].map(i => `
      <tr>
        <td class="p-2 text-center text-slate-500 bg-slate-50/60">${i + 1}</td>
        <td class="p-1"><input type="text" id="knl_nama_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="knl_jab_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="knl_hub_${i}" class="table-input" placeholder="..." /></td>
      </tr>
    `).join('');
  }

  // 10. Psikotes (2 Baris)
  const tbodyPsiko = document.getElementById('tbody-psiko');
  if (tbodyPsiko) {
    tbodyPsiko.innerHTML = [0, 1].map(i => `
      <tr>
        <td class="p-2 text-center text-slate-500 bg-slate-50/60">${i + 1}</td>
        <td class="p-1"><input type="text" id="psi_tempat_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="psi_thn_${i}" class="table-input" placeholder="..." /></td>
        <td class="p-1"><input type="text" id="psi_tujuan_${i}" class="table-input" placeholder="..." /></td>
      </tr>
    `).join('');
  }
}

// Navigasi Wizard Stepper (Step 1 s/d 6)
function setStep(step) {
  for (let i = 1; i <= 6; i++) {
    const stepEl = document.getElementById('step-' + i);
    const navEl = document.getElementById('step-nav-' + i);
    if (stepEl) {
      stepEl.classList.toggle('hidden', i !== step);
    }
    if (navEl) {
      navEl.className = i === step
        ? 'py-2 px-3 rounded-lg font-semibold bg-slate-900 text-white text-left flex items-center gap-2 shadow-sm transition'
        : 'py-2 px-3 rounded-lg font-medium text-slate-600 hover:bg-slate-50 text-left flex items-center gap-2 transition';
      
      const badge = navEl.querySelector('span:first-child');
      if (badge) {
        badge.className = i === step
          ? 'w-5 h-5 rounded-full bg-white/20 text-[11px] flex items-center justify-center font-bold'
          : 'w-5 h-5 rounded-full bg-slate-100 text-[11px] flex items-center justify-center font-normal';
      }
    }
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mengambil seluruh data form menjadi Object JSON
function getPayload() {
  const relationsInti = ['Suami/Istri', 'Anak 1', 'Anak 2', 'Anak 3', 'Anak 4'];
  const relationsOrtu = ['Ayah', 'Ibu', 'Anak 1', 'Anak 2', 'Anak 3', 'Anak 4', 'Anak 5', 'Anak 6', 'Anak 7'];

  const getValue = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  return {
    timestamp: new Date().toLocaleString('id-ID'),
    posisi: getValue('posisi'),
    nama: getValue('nama').toUpperCase(),
    panggilan: getValue('panggilan').toUpperCase(),
    tempat_lahir: getValue('tempat_lahir'),
    tgl_lahir: getValue('tgl_lahir'),
    jk: getValue('jk'),
    agama: getValue('agama'),
    ktp: getValue('ktp'),
    npwp: getValue('npwp'),
    alamat: getValue('alamat'),
    kota: getValue('kota'),
    kodepos: getValue('kodepos'),
    hp: getValue('hp'),
    telp_rumah: getValue('telp_rumah'),
    email: getValue('email'),
    rumah: getValue('rumah'),
    kendaraan: getValue('kendaraan'),
    status_nikah: getValue('status_nikah'),
    status_dpa: getValue('status_dpa'),
    tgl_nikah: getValue('tgl_nikah'),
    keluarga_inti: relationsInti.map((hub, i) => ({
      hub,
      nama: getValue(`ki_nama_${i}`),
      lp: getValue(`ki_lp_${i}`),
      ttl: getValue(`ki_ttl_${i}`),
      pend: getValue(`ki_pend_${i}`),
      pek: getValue(`ki_pek_${i}`)
    })),
    keluarga_ortu: relationsOrtu.map((hub, i) => ({
      hub,
      nama: getValue(`ko_nama_${i}`),
      lp: getValue(`ko_lp_${i}`),
      ttl: getValue(`ko_ttl_${i}`),
      pend: getValue(`ko_pend_${i}`),
      pek: getValue(`ko_pek_${i}`)
    })),
    waris: [0, 1, 2].map(i => ({
      nama: getValue(`aw_nama_${i}`),
      ttl: getValue(`aw_ttl_${i}`),
      lp: getValue(`aw_lp_${i}`),
      hub: getValue(`aw_hub_${i}`),
      pek: getValue(`aw_pek_${i}`)
    })),
    pendidikan: [0, 1, 2].map(i => ({
      nama: getValue(`pf_nama_${i}`),
      fak: getValue(`pf_fak_${i}`),
      jur: getValue(`pf_jur_${i}`),
      prodi: getValue(`pf_prodi_${i}`),
      kota: getValue(`pf_kota_${i}`),
      thn: getValue(`pf_thn_${i}`),
      ket: getValue(`pf_ket_${i}`)
    })),
    kursus: [0, 1].map(i => ({
      nama: getValue(`knf_nama_${i}`),
      tempat: getValue(`knf_tempat_${i}`),
      thn: getValue(`knf_thn_${i}`),
      ket: getValue(`knf_ket_${i}`)
    })),
    bahasa: [0, 1].map(i => ({
      nama: getValue(`bhs_nama_${i}`),
      lisan: getValue(`bhs_lisan_${i}`),
      tulis: getValue(`bhs_tulis_${i}`)
    })),
    kerja: [0, 1, 2, 3, 4].map(i => ({
      pt: getValue(`pk_pt_${i}`),
      jab: getValue(`pk_jab_${i}`),
      thn: getValue(`pk_thn_${i}`),
      gaji: getValue(`pk_gaji_${i}`),
      alasan: getValue(`pk_alasan_${i}`)
    })),
    pt_senang: getValue('pt_senang'),
    alasan_senang: getValue('alasan_senang'),
    minat: [
      getValue('minat_1'),
      getValue('minat_2'),
      getValue('minat_3')
    ],
    gaji_diinginkan: getValue('gaji_diinginkan'),
    hobi: getValue('hobi'),
    waktu_luang: getValue('waktu_luang'),
    org: [0, 1].map(i => ({
      nama: getValue(`org_nama_${i}`),
      tempat: getValue(`org_tempat_${i}`),
      jab: getValue(`org_jab_${i}`),
      thn: getValue(`org_thn_${i}`)
    })),
    kenalan: [0, 1].map(i => ({
      nama: getValue(`knl_nama_${i}`),
      jab: getValue(`knl_jab_${i}`),
      hub: getValue(`knl_hub_${i}`)
    })),
    psiko: [0, 1].map(i => ({
      tempat: getValue(`psi_tempat_${i}`),
      thn: getValue(`psi_thn_${i}`),
      tujuan: getValue(`psi_tujuan_${i}`)
    })),
    kelebihan: getValue('kelebihan'),
    kekurangan: getValue('kekurangan'),
    gambaran_diri: getValue('gambaran_diri'),
    bank_nama: getValue('bank_nama') || 'BANK PERMATA',
    bank_norek: getValue('bank_norek'),
    bank_alamat: getValue('bank_alamat'),
    bank_pemilik: getValue('bank_pemilik').toUpperCase(),
    bpjs_kes: getValue('bpjs_kes'),
    faskes: getValue('faskes'),
    bpjs_tk: getValue('bpjs_tk'),
    signature: getSignatureDataUrl()
  };
}

function resetCandidateForm() {
  const form = document.getElementById('candidate-form');
  if (form) form.reset();
  clearSig();
  setStep(1);
}

