# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Sistem Digitalisasi Formulir Penerimaan Karyawan Baru (E-PKB)
**PT Astra International Tbk — Daihatsu Sales Operation (DSO)**

---

### 1. Ringkasan Proyek (Project Overview)
* **Nama Produk:** E-PKB Digital Recruitment Portal (`e-pkb-dso`)
* **Tujuan Utama:** Menggantikan proses pengisian formulir Penerimaan Karyawan Baru (PKB) yang sebelumnya dicetak satu per satu oleh HRD dan diisi tulis tangan oleh kandidat menjadi **100% digital berbasis web**.
* **Prinsip Utama ("Single Input, Multi-Sheet Excel PDF Output"):** 
  Peserta rekrutmen cukup mengisi satu rangkaian formulir digital di website tanpa perlu login. Data tersebut otomatis tersimpan di Google Spreadsheet dan ketika Admin HRD menekan tombol Download, sistem akan memasukkan data ke sel-sel asli template Excel (`Kelengkapan PKB DSO.xlsx`), mengonversi tiap sheet menjadi file PDF resmi, lalu mengunduhnya dalam bentuk **file `.ZIP`** (baik per peserta maupun *Bulk Download* seluruh peserta).

---

### 2. Arsitektur Teknologi (Tech Stack)
1. **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript (dikembangkan di VS Code).
2. **Libraries Tambahan Frontend:** 
   * `Signature Pad / HTML5 Canvas` (Tanda tangan digital peserta).
   * `JSZip` (Untuk ekstraksi/penggabungan paket `.ZIP` di sisi klien saat *Bulk Download*).
3. **Hosting & Deployment:** GitHub (`miyuraa1001/e-pkb-dso`) + **Vercel**.
4. **Backend & PDF Engine:** **Google Apps Script (`Code.gs`)** yang di-deploy sebagai *Web App API* (`doGet` & `doPost`).
5. **Database & Master Cetakan:** **Google Spreadsheet** (Hasil konversi langsung dari file asli `Kelengkapan PKB DSO.xlsx`).

---

### 3. Peran Pengguna & Hak Akses (User Roles & Permissions)

Sistem memiliki **2 jalur akses utama** dengan pemisahan hak akses yang tegas:

#### A. Peserta Rekrutmen / Kandidat (Tanpa Login — Public Access)
* **Cara Masuk:** Langsung membuka link utama website (misal: `https://e-pkb-dso.vercel.app`) atau menekan tombol **"Masuk sebagai Peserta / Isi Formulir"**.
* **Karakteristik Akses:**
  * **TIDAK PERLU LOGIN** (agar memudahkan peserta mengisi langsung dari HP atau laptop).
  * Hanya bisa melihat dan mengisi **Form Pertanyaan PKB (Step 1 s/d Step 6)**.
  * **TIDAK BISA** melihat daftar pelamar lain, tidak bisa membuka Dashboard Admin, dan tidak bisa mengunduh dokumen.
  * Setelah klik **Submit**, muncul halaman konfirmasi *"Terima kasih, dokumen PKB Anda telah terkirim ke HRD"* dan form kembali bersih.

#### B. Admin HRD (Wajib Login — Protected Access)
* **Cara Masuk:** Mengklik tombol **"Login Admin HRD"** di pojok kanan atas dan memasukkan `Username / Email` & `Password / PIN Admin` (diverifikasi melalui Google Apps Script / kredensial Admin).
* **Karakteristik Akses:**
  * Melihat **Dashboard Daftar Pelamar** yang sudah mengisi formulir secara *real-time* dari Google Spreadsheet.
  * Mencari (*Search*) dan memfilter pelamar berdasarkan Nama, Posisi, atau Tanggal Pengisian.
  * Mengisi/melengkapi **Kolom Verifikasi Khusus HRD** untuk masing-masing pelamar (`No. Tes`, `NPK/NRP`, `Kode PT`, `Tanggal Masuk`, `Gaji Pokok DPA`, `No. Form PDK`).
  * **Download `.ZIP` Satuan (Per Peserta):** Mengunduh 1 file `.ZIP` bernama `PKB_DSO_[Nama_Peserta].zip` yang berisi seluruh PDF cetakan sheet Excel peserta tersebut.
  * **Download Semua `.ZIP` Sekaligus (*Bulk Download All ZIPs*):** Mengunduh seluruh paket `.ZIP` dari semua pelamar yang dipilih/terdaftar di dashboard dalam satu kali klik.

---

### 4. Alur Pengguna (User Flow)

```
[ HALAMAN UTAMA WEBSITE ]
        │
        ├──► 1. JALUR PESERTA REKRUTMEN (Default / Tanpa Login)
        │       ├─► Mengisi Wizard Form 6 Bagian (Identitas s/d TTD Digital)
        │       ├─► Klik "Kirim Formulir"
        │       ├─► Data terkirim via POST ke Google Apps Script (Sheet: DB_KANDIDAT)
        │       └─► Tampil Layar Sukses Terkirim
        │
        └──► 2. JALUR ADMIN HRD (Klik "Login Admin")
                ├─► Input Password / PIN Admin HRD
                ├─► Masuk ke Dashboard Admin HRD
                ├─► Melihat Tabel Pelamar yang Sudah Mengisi
                ├─► (Opsional) Input Kolom HRD: NPK, No. Tes, Gaji Pokok, Tgl Masuk
                ├─► Aksi 1: Klik "Download .ZIP" pada 1 Pelamar
                └─► Aksi 2: Klik "Download Semua .ZIP (Bulk)" untuk seluruh pelamar
```

---

### 5. Spesifikasi Modul & Kebutuhan Fungsional (Functional Requirements)

#### Modul 1: Form Pengisian Peserta (Frontend — Clean UI & Kosongan)
Seluruh input wajib mencerminkan seluruh pertanyaan yang ada pada dokumen `Kelengkapan PKB DSO.xlsx` tanpa ada yang terlewat:
1. **Step 1 — Identitas Diri & Posisi:**
   * Posisi yang dilamar (`Sales`, `Counter Sales`, `Kasir`, `Administrasi`, `Accounting`, `Service/Mekanik`, dll).
   * Nama Lengkap (Huruf Cetak), Nama Panggilan, Tempat & Tanggal Lahir, Jenis Kelamin (`L/P`), Agama, No. KTP/SIM (16 digit), No. NPWP.
   * Alamat Lengkap (Sesuai KTP), Kota, Kode Pos, No. HP, No. Telp Rumah, Email.
   * Status Rumah yang ditempati & Kendaraan yang digunakan.
2. **Step 2 — Lingkungan Keluarga & Ahli Waris:**
   * Status Pernikahan (`Single`, `Tunangan`, `Menikah`, `Bercerai`) & Tanggalnya.
   * Status Keluarga khusus DPA (`Tidak kawin`, `Kawin tanpa anak`, `Kawin - 1 anak`, `Kawin - 2 anak`, `Kawin - 3 anak`, `Kawin - > 3 anak`).
   * Tabel Susunan Keluarga Inti (Suami/Istri & Anak 1 s/d 4).
   * Tabel Susunan Keluarga Orang Tua & Saudara Kandung (Ayah, Ibu, Anak 1 s/d 7 termasuk peserta).
   * Tabel Penunjukan Ahli Waris (Nama, Tempat/Tgl Lahir, L/P, Hubungan Keluarga, Pekerjaan).
3. **Step 3 — Pendidikan & Bahasa:**
   * Tabel Pendidikan Formal (`SMA`, `Dipl.`, `S1`: Nama Sekolah, Fakultas, Jurusan, Prodi, Tempat, Tahun, Ket Lulus).
   * Tabel Pendidikan Non-Formal / Kursus (2 baris).
   * Tabel Bahasa Asing yang Dikuasai (2 baris: Lisan & Tulisan — `Kurang / Cukup / Baik`).
4. **Step 4 — Riwayat Pekerjaan & Minat:**
   * Tabel Pengalaman Kerja (5 baris: Nama Perusahaan, Jabatan, Periode, Gaji, Alasan Pindah).
   * Perusahaan paling disenangi & Alasannya.
   * Pilihan 3 Prioritas Bidang Pekerjaan yang Diminati (10 opsi bidang di FLK) & Ekspektasi Gaji.
5. **Step 5 — Aktivitas Sosial & Gambaran Diri:**
   * Hobi/Kegemaran & Cara Mengisi Waktu Luang.
   * Tabel Organisasi (2 baris), Tabel Kenalan di Perusahaan (2 baris), Tabel Riwayat Psikotes (2 baris).
   * Kelebihan (*Strong Point* min. 3 sifat), Kekurangan (*Weak Point* min. 3 sifat), dan Essay Gambaran Diri Pribadi.
6. **Step 6 — Rekening Bank Permata, BPJS & Tanda Tangan Digital:**
   * Nama Bank (`BANK PERMATA`), Nomor Rekening, Cabang/Alamat Bank, Nama Pemegang Rekening.
   * No. BPJS Kesehatan, Faskes Tingkat I, No. KPJ BPJS Ketenagakerjaan (Jamsostek).
   * Canvas Tanda Tangan Digital (disimpan sebagai *Base64 PNG*).

---

#### Modul 2: Autentikasi & Dashboard Admin HRD
1. **Modal / Halaman Login Admin:**
   * Meminta Password/PIN Admin sebelum membuka tampilan Dashboard HRD.
   * Menyimpan sesi login di `sessionStorage` agar Admin tidak perlu login berulang saat *refresh* halaman, dilengkapi tombol **Logout**.
2. **Tabel Monitoring Pelamar:**
   * Menampilkan: `No`, `Checkbox Pilihan`, `Waktu Submit`, `Nama Pelamar`, `Posisi`, `No. KTP`, `No. HP`, `No. Rekening Permata`, `Status Dokumen`, dan `Tombol Aksi`.
   * Fitur Pencarian Cepat (*Search bar* berdasarkan Nama/Posisi).
3. **Panel Input Data Internal HRD:**
   * Sebelum men-download ZIP (atau disimpan ke baris kandidat), Admin bisa menginput: `No. Tes`, `NPK/NRP`, `Kode PT`, `Tanggal Masuk`, `Gaji Pokok DPA`, dan `No. Form PDK`.
4. **Fitur Download `.ZIP` Satuan & Semua (*Bulk Download*):**
   * **Download Satuan:** Tombol pada baris pelamar untuk mengunduh `PKB_DSO_[Nama_Pelamar].zip`.
   * **Download Semua / Terpilih (`Download Semua ZIP`):** Tombol di atas tabel untuk memproses seluruh pelamar yang dicentang (atau semua pelamar) secara berurutan dengan *Progress Bar* yang jelas, menghasilkan file `.ZIP` per pelamar atau 1 Master `.ZIP` berisi folder masing-masing pelamar.

---

### 6. Struktur Google Spreadsheet & Pemetaan Sel (Database & Template Mapping)

Di dalam file Google Spreadsheet hasil konversi `Kelengkapan PKB DSO.xlsx`, susunan Sheet yang digunakan adalah:

| No | Nama Sheet di Spreadsheet | Fungsi | Di-export ke PDF dalam ZIP? |
| :--- | :--- | :--- | :--- |
| 1 | **`DB_KANDIDAT`** *(Sheet Baru)* | Menyimpan database seluruh pelamar (1 baris = 1 pelamar + JSON lengkap) | ❌ Tidak (Khusus Database) |
| 2 | **`List Kelengkapan`** *(Asli)* | Checklist 20 dokumen kelengkapan PKB | ✅ Ya (`01_List_Kelengkapan.pdf`) |
| 3 | **`FLK`** *(Asli)* | Formulir Lamaran Kerja (2 Halaman) | ✅ Ya (`02_FLK.pdf`) |
| 4 | **`No.Rekening`** *(Asli)* | Form Karyawan Baru — Rekening Bank Permata | ✅ Ya (`03_No_Rekening.pdf`) |
| 5 | **`S Setor Uang (SLS,CASHIER)`** *(Asli)* | Surat Pernyataan Penyetoran Uang Langsung | ✅ Ya (`04_Surat_Setor_Uang.pdf`)* |
| 6 | **`DPA`** *(Asli)* | Form 2 — Pendaftaran Peserta Baru Dana Pensiun Astra Dua | ✅ Ya (`05_DPA.pdf`) |
| 7 | **`PDK`** *(Asli)* | Form Pembaruan Data Karyawan (`/HR/AI-DSO`) | ✅ Ya (`06_PDK.pdf`) |
| 8 | **`BPJS`** *(Opsional/Tambahan)* | Form Pendaftaran BPJS Kesehatan & Ketenagakerjaan | ✅ Ya (`07_BPJS.pdf`) |

*\*Catatan: Sheet `S Setor Uang (SLS,CASHIER)` otomatis disertakan jika posisi pelamar adalah Sales, Counter Sales, atau Kasir (atau tetap bisa disertakan semua sesuai kebijakan HRD).*

---

### 7. Spesifikasi API Google Apps Script (`Code.gs`)

Backend Apps Script hanya membutuhkan 1 URL Web App (`/exec`) yang menangani beberapa `action`:

1. **`GET` Request (`?action=LIST_CANDIDATES`)**:
   * Mengambil seluruh daftar pelamar dari sheet `DB_KANDIDAT` untuk ditampilkan di Dashboard Admin HRD.
2. **`POST` Request (`action: "SUBMIT_FORM"`)**:
   * Menerima data dari Peserta Rekrutmen dan menambahkan baris baru di sheet `DB_KANDIDAT`.
3. **`POST` Request (`action: "GENERATE_ZIP"`)**:
   * Menerima `ID_Kandidat` / data kandidat beserta data tambahan HRD.
   * Menduplikasi sementara (*temporary copy*) spreadsheet template, memasukkan data + gambar tanda tangan tepat ke koordinat sel di tiap sheet (`FLK`, `No.Rekening`, `S Setor Uang`, `DPA`, `PDK`), melakukan *export* PDF ukuran A4 untuk tiap sheet, membungkusnya menjadi `PKB_DSO_[Nama].zip` (dalam format Base64), menghapus file sementara, lalu mengirimkan file `.ZIP` tersebut ke browser HRD.

---

### 8. Tahapan Eksekusi Pembangunan (Development Roadmap)

* **Tahap 1 — Persiapan Spreadsheet & Apps Script:**
  1. Upload `Kelengkapan PKB DSO.xlsx` ke Google Drive dan simpan sebagai Google Spreadsheet.
  2. Pasang kode `Code.gs` di menu *Extensions > Apps Script* dan Deploy sebagai Web App (*Anyone*).
* **Tahap 2 — Pembuatan Kode Frontend (`index.html`) di VS Code:**
  1. Membuat tampilan *Landing / Form Peserta* (langsung terbuka tanpa login, tampilan *clean* & kosongan).
  2. Membuat fitur *Login Admin HRD* & *Dashboard Admin HRD* (tabel daftar pelamar, pencarian, input kolom HRD, tombol Download ZIP satuan & tombol Download Semua ZIP).
* **Tahap 3 — Integrasi & Deployment ke Vercel:**
  1. Memasukkan URL Web App Apps Script ke dalam kode.
  2. Push kode ke GitHub (`miyuraa1001/e-pkb-dso`) dan hubungkan ke Vercel.
  3. Uji coba *End-to-End* (Peserta isi form dari HP $\rightarrow$ Admin login di laptop $\rightarrow$ Admin klik Download ZIP $\rightarrow$ Cek kesesuaian PDF dengan cetakan Excel).