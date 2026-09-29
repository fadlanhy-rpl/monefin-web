/**
 * Single Source of Truth (Aturan B4) — Registri Fakta Legal, Privasi, & Keamanan MoneFin.
 * Seluruh nilai teknis (header, algoritma, retensi, sub-prosesor, cookie, kontak, versi,
 * dan changelog) didefinisikan satu kali di sini dan dirujuk oleh:
 * - /terms (Syarat & Ketentuan)
 * - /privacy (Kebijakan Privasi)
 * - /security (Standar Keamanan)
 * - docs/compliance-facts.md
 */

export const COMPLIANCE_FACTS = {
  version: "3.0.0",
  versionLabel: {
    id: "Versi 3.0.0",
    en: "Version 3.0.0",
  },
  effectiveDate: {
    id: "29 September 2026",
    en: "September 29, 2026",
  },
  updatedDate: {
    id: "29 September 2026",
    en: "September 29, 2026",
  },
  documentOwner: {
    id: "Tim Tata Kelola, Keamanan & Privasi MoneFin",
    en: "MoneFin Governance, Security & Privacy Team",
  },
  reviewCycle: {
    id: "Ditinjau berkala minimal setiap 6 bulan",
    en: "Reviewed periodically at least every 6 months",
  },
  governingLanguageNotice: {
    id: "Dokumen ini tersedia dalam Bahasa Indonesia dan Bahasa Inggris. Sesuai UU No. 24 Tahun 2009, apabila terdapat perbedaan penafsiran, versi Bahasa Indonesia yang berlaku dan mengikat secara hukum.",
    en: "This document is provided in Indonesian and English. Pursuant to Law No. 24 of 2009 of the Republic of Indonesia, in the event of any divergence in interpretation, the Indonesian version shall prevail and be legally binding.",
  },
  minAgeYears: 18,
  backupRetentionDays: 30,
  incidentNotificationHours: 72, // 3x24 jam sesuai Pasal 46 UU PDP No. 27/2022
  noticeAdvanceDays: "14–30",

  // Kontak Terpisah per Fungsi (Aturan B8 & Temuan #10)
  contacts: {
    security: {
      email: "security@monefin.web.id",
      role: {
        id: "Tim Keamanan & Pelaporan Kerentanan (CSIRT)",
        en: "Security & Vulnerability Disclosure Team (CSIRT)",
      },
      sla: {
        id: "Konfirmasi awal (acknowledge) maks. 3 hari kerja; triase teknis maks. 7 hari kerja",
        en: "Initial acknowledgment within 3 business days; technical triage within 7 business days",
      },
    },
    privacy: {
      email: "privacy@monefin.web.id",
      role: {
        id: "Pejabat Pelindungan Data Pribadi (DPO / Tim Privasi)",
        en: "Data Protection Officer (DPO / Privacy Team)",
      },
      sla: {
        id: "Konfirmasi awal maks. 3 hari kerja; pemenuhan hak Subjek Data 3×24 jam s/d maks. 30 hari kalender sesuai UU PDP",
        en: "Initial response within 3 business days; Data Subject Rights fulfillment within 72 hours up to max. 30 calendar days under UU PDP",
      },
    },
    legal: {
      email: "legal@monefin.web.id",
      role: {
        id: "Tim Hukum, Kepatuhan & Pengajuan Banding Akun",
        en: "Legal, Compliance & Account Appeals Team",
      },
      sla: {
        id: "Respons awal maks. 5 hari kerja (jendela pengajuan banding akun: 14 hari kalender)",
        en: "Initial response within 5 business days (account appeal window: 14 calendar days)",
      },
    },
    support: {
      email: "support@monefin.web.id",
      role: {
        id: "Layanan Bantuan Pengguna Umum",
        en: "General User Support",
      },
      sla: {
        id: "Respons awal maks. 2 hari kerja",
        en: "Initial response within 2 business days",
      },
    },
  },

  // Tabel Kontrol Keamanan (Bagian C: Kontrol | Deskripsi singkat | Standar acuan | Status)
  securityControls: {
    id: [
      {
        control: "Validasi Kepemilikan Data (Otorisasi Tingkat Baris)",
        description: "Setiap permintaan baca/tulis pada rekening, transaksi, anggaran, target tabungan, dan split bill divalidasi terhadap identitas pengguna yang terautentikasi serta diuji dengan pengujian otomatis.",
        standard: "OWASP API Security Top 10 (API1:2023 BOLA) & OWASP ASVS v4.0",
        status: "Aktif",
      },
      {
        control: "Hashing Kata Sandi & Kebijakan Kredensial",
        description: "Kata sandi minimal 8 karakter tanpa aturan komposisi paksa yang memperlemah entropi, di-hash satu arah menggunakan algoritma Bcrypt dengan salt unik per pengguna.",
        standard: "NIST SP 800-63B & OWASP ASVS V2",
        status: "Aktif",
      },
      {
        control: "Token Sesi Kriptografis & Manajemen Sesi Perangkat",
        description: "Token sesi berawalan 'mnf_' di-hash menggunakan SHA-256 di database. Pengguna dapat melihat daftar perangkat beserta alamat IP aktif dan mencabut sesi dari jarak jauh.",
        standard: "OWASP ASVS V3 (Session Management)",
        status: "Aktif",
      },
      {
        control: "Enkripsi Kunci API BYOK (At-Rest)",
        description: "Kunci API penyedia AI milik pengguna dienkripsi sebelum disimpan ke database menggunakan AES-256-CBC (OpenSSL dengan autentikasi MAC) dan didekripsi hanya di memori saat pemanggilan.",
        standard: "ISO/IEC 27002 (Cryptography) & OWASP ASVS V6",
        status: "Aktif",
      },
      {
        control: "Enkripsi Jalur Komunikasi (In-Transit)",
        description: "Seluruh lalu lintas klien-ke-server menggunakan HTTPS (TLS 1.2+, dengan TLS 1.3 diprioritaskan) dan diperkuat header Strict-Transport-Security (HSTS).",
        standard: "RFC 8446 (TLS 1.3) & OWASP Transport Layer Protection",
        status: "Aktif",
      },
      {
        control: "Integritas Buku Kas (Transaksi ACID & Row Locking)",
        description: "Mutasi saldo dibungkus dalam transaksi database ACID dengan penguncian baris pesimistis (SELECT ... FOR UPDATE) untuk mencegah anomali kondisi pacu (race condition).",
        standard: "ISO/IEC 27002 & Prinsip ACID Database",
        status: "Aktif",
      },
      {
        control: "Autentikasi Dua Faktor (2FA / MFA)",
        description: "2FA berbasis kode OTP 6 digit (CSPRNG random_int) melalui email telah tersedia. Dukungan aplikasi autentikator TOTP dan Passkeys/WebAuthn sedang dalam tahap pengembangan.",
        standard: "NIST SP 800-63B",
        status: "Sebagian (Email OTP Aktif / TOTP Roadmap)",
      },
      {
        control: "Audit Keamanan Pihak Ketiga Independen (Pentest Eksternal)",
        description: "Saat ini pengujian dilakukan melalui pengujian otomatis internal, peninjauan kode, dan program pengungkapan kerentanan publik. Pengujian penetrasi pihak ketiga independen direncanakan pada fase berikutnya.",
        standard: "ISO/IEC 27001 & ISO/IEC 29147",
        status: "Roadmap",
      },
    ],
    en: [
      {
        control: "Data Ownership Validation (Row-Level Authorization)",
        description: "Every read/write request on accounts, transactions, budgets, savings goals, and split bills is validated against the authenticated user ID and verified by automated tests.",
        standard: "OWASP API Security Top 10 (API1:2023 BOLA) & OWASP ASVS v4.0",
        status: "Active",
      },
      {
        control: "Password Hashing & Credential Policy",
        description: "Passwords require a minimum of 8 characters without arbitrary composition rules, hashed one-way using Bcrypt with a unique per-user cryptographic salt.",
        standard: "NIST SP 800-63B & OWASP ASVS V2",
        status: "Active",
      },
      {
        control: "Cryptographic Session Tokens & Device Management",
        description: "Session tokens prefixed with 'mnf_' are stored as SHA-256 hashes. Users can inspect active devices and IP addresses and remotely revoke sessions.",
        standard: "OWASP ASVS V3 (Session Management)",
        status: "Active",
      },
      {
        control: "BYOK API Key Encryption (At-Rest)",
        description: "User-supplied AI API keys are encrypted prior to database storage using AES-256-CBC (OpenSSL with MAC authentication) and decrypted only in memory during requests.",
        standard: "ISO/IEC 27002 (Cryptography) & OWASP ASVS V6",
        status: "Active",
      },
      {
        control: "Transport Layer Encryption (In-Transit)",
        description: "All client-to-server traffic uses HTTPS (TLS 1.2+, with TLS 1.3 prioritized) enforced via Strict-Transport-Security (HSTS).",
        standard: "RFC 8446 (TLS 1.3) & OWASP Transport Layer Protection",
        status: "Active",
      },
      {
        control: "Ledger Integrity (ACID Transactions & Row Locking)",
        description: "Balance updates run inside ACID database transactions with pessimistic row-level locking (SELECT ... FOR UPDATE) to mitigate concurrent race conditions.",
        standard: "ISO/IEC 27002 & Database ACID Principles",
        status: "Active",
      },
      {
        control: "Two-Factor Authentication (2FA / MFA)",
        description: "Email-based 6-digit OTP 2FA (generated via CSPRNG random_int) is active. Authenticator app TOTP and WebAuthn/Passkeys support are on the roadmap.",
        standard: "NIST SP 800-63B",
        status: "Partial (Email OTP Active / TOTP Roadmap)",
      },
      {
        control: "Independent Third-Party Penetration Testing",
        description: "Security verification currently relies on internal automated authorization tests, code reviews, and public vulnerability disclosure. Independent third-party pentesting is scheduled on our roadmap.",
        standard: "ISO/IEC 27001 & ISO/IEC 29147",
        status: "Roadmap",
      },
    ],
  },

  // Tabel HTTP Security Headers (Bagian C6 & Temuan #2, #3 — Identik antara teks dan tabel, tanpa X-XSS-Protection)
  securityHeaders: [
    {
      header: "Content-Security-Policy",
      value: "default-src 'none'; frame-ancestors 'none'",
      scope: {
        id: "Respons API JSON (dikecualikan pada endpoint streaming SSE AI agar aliran data tidak terputus)",
        en: "JSON API responses (exempted on AI SSE streaming endpoints to preserve stream continuity)",
      },
      purpose: {
        id: "Membatasi eksekusi sumber daya dan mencegah penyematan frame lintas-origin",
        en: "Restricts resource loading and prevents cross-origin frame embedding",
      },
    },
    {
      header: "Strict-Transport-Security",
      value: "max-age=31536000; includeSubDomains; preload",
      scope: {
        id: "Seluruh respons Web Frontend & API Backend",
        en: "All Web Frontend & Backend API responses",
      },
      purpose: {
        id: "Mewajibkan peramban berkomunikasi hanya melalui HTTPS selama 1 tahun (31.536.000 detik)",
        en: "Instructs browsers to connect exclusively over HTTPS for 1 year (31,536,000 seconds)",
      },
    },
    {
      header: "X-Content-Type-Options",
      value: "nosniff",
      scope: {
        id: "Seluruh respons Web Frontend & API Backend",
        en: "All Web Frontend & Backend API responses",
      },
      purpose: {
        id: "Mencegah peramban menebak (MIME-sniffing) tipe konten di luar Content-Type resmi",
        en: "Prevents browsers from MIME-sniffing responses away from declared Content-Type",
      },
    },
    {
      header: "X-Frame-Options",
      value: "DENY",
      scope: {
        id: "Seluruh respons Web Frontend & API Backend",
        en: "All Web Frontend & Backend API responses",
      },
      purpose: {
        id: "Melengkapi direktif frame-ancestors untuk mencegah serangan Clickjacking",
        en: "Complements frame-ancestors directive to mitigate Clickjacking attacks",
      },
    },
    {
      header: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
      scope: {
        id: "Seluruh respons Web Frontend & API Backend",
        en: "All Web Frontend & Backend API responses",
      },
      purpose: {
        id: "Mencegah kebocoran path dan parameter URL internal saat menuju situs eksternal",
        en: "Prevents internal URL path and query parameter leakage to external origins",
      },
    },
    {
      header: "Permissions-Policy",
      value: "camera=(self), microphone=(), geolocation=()",
      scope: {
        id: "Web Frontend (API Backend menutup seluruh akses: camera=(), microphone=(), geolocation=())",
        en: "Web Frontend (Backend API disables all: camera=(), microphone=(), geolocation=())",
      },
      purpose: {
        id: "Mematikan akses mikrofon & lokasi, serta membatasi kamera hanya untuk fitur Scan Struk atas izin pengguna",
        en: "Disables microphone & geolocation, and restricts camera strictly to user-initiated Receipt Scanning",
      },
    },
  ],

  // Tabel Kategori Data Pribadi, Tujuan, Dasar Pemrosesan, & Masa Retensi (Bagian D2 & D8)
  dataCategoriesTable: {
    id: [
      {
        category: "Data Identitas & Profil Akun",
        items: "Nama tampilan, alamat email, kata sandi ter-hash (Bcrypt), nomor telepon/pekerjaan/bio (opsional), foto profil (opsional), dan ID Google OAuth (bila login via Google).",
        purpose: "Pembuatan akun, autentikasi identitas, pengiriman OTP keamanan, dan personalisasi antarmuka.",
        legalBasis: "Pelaksanaan Perjanjian Layanan (Pasal 20 ayat (2) huruf b UU PDP) & Persetujuan Eksplisit untuk kolom profil opsional.",
        retention: "Selama akun aktif. Dihapus segera dari sistem aktif saat akun dihapus, dan terhapus dari backup terenkripsi maksimal dalam 30 hari kalender.",
      },
      {
        category: "Data Catatan Keuangan Pribadi (Data Pribadi Spesifik)",
        items: "Nama akun/dompet, saldo yang dicatat, riwayat pemasukan & pengeluaran, kategori, anggaran 50/30/20, target tabungan (Goals), transaksi berulang, dan catatan Split Bill.",
        purpose: "Menyediakan fungsi inti kalkulasi saldo, grafik arus kas, pengingat anggaran, simulasi tabungan, dan ekspor laporan keuangan.",
        legalBasis: "Persetujuan Eksplisit Subjek Data (Pasal 20 ayat (2) huruf a jo. Pasal 4 ayat (2) UU PDP) & Pelaksanaan Perjanjian.",
        retention: "Selama akun aktif. Item yang dihapus masuk ke Trashbin hingga dikosongkan pengguna. Saat akun dihapus, dihapus segera dari sistem aktif dan maksimal 30 hari kalender dari backup.",
      },
      {
        category: "Data Keamanan Sesi & Teknis Perangkat",
        items: "Alamat IP perangkat secara utuh (tidak dianonimkan), string User-Agent (peramban & OS), waktu aktivitas terakhir, dan hash token sesi (SHA-256).",
        purpose: "Menampilkan daftar perangkat yang sedang login kepada pemilik akun, memungkinkan pencabutan sesi jarak jauh, dan melindungi API dari brute-force (rate limiting).",
        legalBasis: "Kepentingan Sah Pengendali Data untuk keamanan sistem & pencegahan penipuan (Pasal 20 ayat (2) huruf f UU PDP).",
        retention: "Disimpan selama sesi aktif. Dihapus segera saat pengguna melakukan logout/revoke sesi, serta log server dibersihkan otomatis maksimal dalam 30 hari kalender.",
      },
      {
        category: "Data Fitur Opsional AI (BYOK) & Scan Struk",
        items: "Kunci API penyedia AI yang dienkripsi (AES-256-CBC), teks pertanyaan ke AI Assistant, ringkasan konteks keuangan, serta foto struk belanja yang diunggah untuk diekstraksi.",
        purpose: "Menjalankan asisten tanya-jawab keuangan dan mengekstrak item belanja dari foto struk secara otomatis atas permintaan pengguna.",
        legalBasis: "Persetujuan Eksplisit Terpisah (Opt-In) saat pengguna mengaktifkan fitur AI BYOK atau mengunggah foto struk.",
        retention: "Riwayat chat AI tidak disimpan di database MoneFin (0 hari; hanya di memori tab peramban). Foto struk hanya diproses di memori kecuali pengguna mencentang opsi 'Simpan Foto Struk' (dihapus saat transaksi/akun dihapus, maks. 30 hari di backup).",
      },
    ],
    en: [
      {
        category: "Account Identity & Profile Data",
        items: "Display name, email address, hashed password (Bcrypt), optional phone/occupation/bio, optional avatar image, and Google OAuth identifier (if using Google Sign-In).",
        purpose: "Account provisioning, authentication, security OTP delivery, and interface personalization.",
        legalBasis: "Contractual Necessity (Art. 20(2)(b) UU PDP / GDPR Art. 6(1)(b)) & Explicit Consent for optional profile fields.",
        retention: "Retained while account is active. Purged immediately from active systems upon account deletion, and within a maximum of 30 calendar days from encrypted backups.",
      },
      {
        category: "Personal Financial Records (Specific Personal Data)",
        items: "Wallet/account labels, recorded balances, income & expense logs, categories, 50/30/20 budgets, savings goals, recurring rules, and Split Bill entries.",
        purpose: "Delivering core balance calculations, cashflow charts, budget alerts, savings simulations, and financial report exports.",
        legalBasis: "Explicit Consent (Art. 20(2)(a) & Art. 4(2) UU PDP) & Contractual Necessity.",
        retention: "Retained while account is active. Deleted items move to Trashbin until permanently emptied. Upon account deletion, purged immediately from active database and within max. 30 calendar days from backups.",
      },
      {
        category: "Session Security & Device Telemetry",
        items: "Full device IP address (unmasked), browser/OS User-Agent string, last active timestamp, and SHA-256 session token hash.",
        purpose: "Displaying active login devices to the account owner, enabling remote session revocation, and enforcing anti-abuse rate limiting.",
        legalBasis: "Legitimate Interest for platform security and fraud prevention (Art. 20(2)(f) UU PDP / GDPR Art. 6(1)(f)).",
        retention: "Retained while session is active. Deleted immediately upon logout/revocation; server security logs rotate within a maximum of 30 calendar days.",
      },
      {
        category: "Optional AI Features (BYOK) & Receipt Scanning",
        items: "Encrypted AI API key (AES-256-CBC), prompts sent to AI Assistant, aggregated financial context, and receipt images uploaded for OCR extraction.",
        purpose: "Providing interactive financial Q&A and automated receipt line-item extraction upon user request.",
        legalBasis: "Separate Explicit Opt-In Consent when enabling BYOK AI or uploading receipt photos.",
        retention: "AI chat history is not stored in MoneFin's database (0 days; kept only in active browser tab memory). Receipt photos are processed in memory and stored only if the user opts to attach the image (purged upon transaction/account deletion, max. 30 days in backups).",
      },
    ],
  },

  // Tabel Pemroses & Sub-Prosesor Pihak Ketiga (Bagian C9 & D5)
  subProcessorsTable: {
    id: [
      {
        name: "Vercel Inc.",
        role: "Hosting aplikasi web frontend (Next.js) & jaringan pengiriman konten (Edge CDN)",
        location: "Global / Singapura & Amerika Serikat",
        safeguard: "Enkripsi TLS in-transit, sertifikasi infrastruktur ISO/IEC 27001 & SOC 2 Type II milik penyedia cloud",
      },
      {
        name: "Penyedia Infrastruktur Cloud & Database (SkipperHost / Infrastruktur Server Backend)",
        role: "Hosting API backend Laravel, basis data relasional MySQL, dan penyimpanan berkas terenkripsi",
        location: "Indonesia / Singapura",
        safeguard: "Isolasi jaringan, kontrol akses ketat, enkripsi jalur TLS, dan cadangan berkala",
      },
      {
        name: "Layanan Pengiriman Email Transaksional (SMTP Resmi)",
        role: "Pengiriman kode verifikasi One-Time Password (OTP) registrasi, 2FA, dan pemulihan kata sandi",
        location: "Global / Amerika Serikat & Uni Eropa",
        safeguard: "Koneksi SMTP terenkripsi TLS; hanya menerima alamat email tujuan dan kode OTP sementara",
      },
      {
        name: "Google LLC (Google OAuth 2.0 — Opsional)",
        role: "Penyedia autentikasi masuk tunggal (Single Sign-On) apabila pengguna memilih tombol 'Masuk dengan Google'",
        location: "Global / Amerika Serikat",
        safeguard: "Protokol standar OAuth 2.0 / OpenID Connect dengan verifikasi token kriptografis",
      },
      {
        name: "Penyedia Model AI Pilihan Pengguna (BYOK: Google Gemini, Groq, OpenAI, Anthropic, OpenRouter — Opsional)",
        role: "Memproses prompt chat keuangan dan ekstraksi gambar struk belanja hanya saat fitur AI diaktifkan oleh pengguna",
        location: "Global (sesuai penyedia API yang dipilih pengguna)",
        safeguard: "Koneksi HTTPS dengan verifikasi sertifikat SSL (verify=true) menggunakan kunci API milik pengguna sendiri",
      },
    ],
    en: [
      {
        name: "Vercel Inc.",
        role: "Frontend web application hosting (Next.js) & Edge Content Delivery Network",
        location: "Global / Singapore & United States",
        safeguard: "TLS encryption in transit; cloud provider holds ISO/IEC 27001 & SOC 2 Type II certifications",
      },
      {
        name: "Backend Cloud & Database Infrastructure Provider (SkipperHost / Server Hosting)",
        role: "Laravel backend API hosting, relational MySQL database, and file storage",
        location: "Indonesia / Singapore",
        safeguard: "Network isolation, strict access controls, TLS transport encryption, and automated backups",
      },
      {
        name: "Transactional Email Delivery Service (Official SMTP)",
        role: "Delivery of registration verification, 2FA, and password reset One-Time Passwords (OTP)",
        location: "Global / United States & European Union",
        safeguard: "TLS-encrypted SMTP transport; receives only recipient email address and ephemeral OTP code",
      },
      {
        name: "Google LLC (Google OAuth 2.0 — Optional)",
        role: "Single Sign-On identity provider when the user chooses 'Continue with Google'",
        location: "Global / United States",
        safeguard: "Standard OAuth 2.0 / OpenID Connect protocol with cryptographic state & token validation",
      },
      {
        name: "User-Selected AI Model Providers (BYOK: Google Gemini, Groq, OpenAI, Anthropic, OpenRouter — Optional)",
        role: "Processes financial chat prompts and receipt OCR images strictly when enabled and triggered by the user",
        location: "Global (depending on the provider selected by the user)",
        safeguard: "HTTPS transport with strict SSL certificate verification (verify=true) using the user's own API key",
      },
    ],
  },

  // Tabel Cookie, Token, & Penyimpanan Lokal (Bagian D12)
  cookiesAndStorageTable: {
    id: [
      {
        name: "auth_token",
        type: "Cookie HTTP (SameSite=Lax, Secure pada HTTPS)",
        purpose: "Menyimpan token sesi autentikasi berawalan 'mnf_' agar pengguna tetap masuk ke akunnya.",
        duration: "7 hari (atau dihapus segera saat pengguna melakukan Logout)",
        required: "Wajib (Esensial untuk Layanan Inti)",
      },
      {
        name: "NEXT_LOCALE / language",
        type: "Cookie & localStorage",
        purpose: "Menyimpan preferensi bahasa antarmuka pengguna (Bahasa Indonesia 'id' atau English 'en').",
        duration: "365 hari",
        required: "Opsional (Fungsional Antarmuka)",
      },
      {
        name: "MONEFIN_CURRENCY / currency",
        type: "Cookie & localStorage",
        purpose: "Menyimpan cerminan preferensi mata uang tampilan (IDR, USD, EUR, SGD) yang bersumber dari pengaturan profil akun.",
        duration: "365 hari",
        required: "Opsional (Fungsional Antarmuka)",
      },
      {
        name: "monefin_hide_balance",
        type: "localStorage",
        purpose: "Menyimpan status fitur sensor nominal saldo (Privacy Mode) pada perangkat lokal.",
        duration: "Persisten di peramban lokal hingga diubah pengguna",
        required: "Opsional (Privasi Visual)",
      },
      {
        name: "user_data & monefin_api_pcache_v2",
        type: "localStorage",
        purpose: "Menyimpan cache profil dan respons API sementara di perangkat pengguna untuk mempercepat waktu muat halaman; dibersihkan otomatis saat Logout.",
        duration: "TTL cache 1–10 menit; dihapus segera saat Logout",
        required: "Wajib (Kinerja Aplikasi)",
      },
    ],
    en: [
      {
        name: "auth_token",
        type: "HTTP Cookie (SameSite=Lax, Secure on HTTPS)",
        purpose: "Stores the 'mnf_' prefixed session token to keep the authenticated user signed in.",
        duration: "7 days (or deleted immediately upon Logout)",
        required: "Strictly Necessary (Core Authentication)",
      },
      {
        name: "NEXT_LOCALE / language",
        type: "Cookie & localStorage",
        purpose: "Remembers the user's interface language preference (Indonesian 'id' or English 'en').",
        duration: "365 days",
        required: "Optional (UI Preference)",
      },
      {
        name: "MONEFIN_CURRENCY / currency",
        type: "Cookie & localStorage",
        purpose: "Mirrors the user's display currency preference (IDR, USD, EUR, SGD) synchronized from account settings.",
        duration: "365 days",
        required: "Optional (UI Preference)",
      },
      {
        name: "monefin_hide_balance",
        type: "localStorage",
        purpose: "Stores the local toggle state for masking monetary balances on screen (Privacy Mode).",
        duration: "Persistent in local browser until toggled",
        required: "Optional (Visual Privacy)",
      },
      {
        name: "user_data & monefin_api_pcache_v2",
        type: "localStorage",
        purpose: "Caches user profile metadata and short-lived API responses locally to reduce page load latency; wiped immediately upon Logout.",
        duration: "Cache TTL 1–10 minutes; cleared immediately upon Logout",
        required: "Necessary (Application Performance)",
      },
    ],
  },

  // Changelog Publik Lintas Dokumen (Aturan B1 & Temuan #12)
  changelog: {
    id: [
      {
        version: "3.0.0",
        date: "29 September 2026",
        type: "Mayor (Perubahan Hak, Struktur & Kepatuhan)",
        changes: [
          "Menyelaraskan ketiga dokumen dengan Pedoman Kepatuhan UU PDP No. 27/2022, UU Perlindungan Konsumen No. 8/1999, NIST SP 800-63B, ISO/IEC 27002/27701/29147, dan OWASP ASVS.",
          "Menaikkan batas usia minimum kelayakan pengguna menjadi 18 tahun (atau di bawah 18 tahun dengan persetujuan orang tua/wali sah sesuai Pasal 25 UU PDP).",
          "Menambahkan pengecualian tegas (Safe Harbor) pada Syarat & Ketentuan bagi peneliti keamanan yang melapor sesuai kebijakan Pengungkapan Kerentanan Terkoordinasi dan menerbitkan /.well-known/security.txt (RFC 9116).",
          "Memisahkan penjelasan penyimpanan data AI antara MoneFin (0 hari untuk riwayat chat di database) dan penyedia AI pihak ketiga (BYOK), serta memperjelas pencatatan alamat IP utuh pada fitur Manajemen Sesi.",
          "Menghapus klaim absolut/superlatif, menghapus header usang X-XSS-Protection, menstandarkan penyebutan algoritma Bcrypt/SHA-256/AES-256-CBC, dan memisahkan kontak resmi (security@, privacy@, legal@, support@monefin.web.id).",
          "Menambahkan Tabel Kategori & Retensi Data, Tabel Sub-Prosesor, Tabel Cookie & Penyimpanan Lokal, Tabel Kontrol Keamanan, serta hak pengaduan ke otoritas PDP.",
        ],
      },
      {
        version: "2.4.0",
        date: "5 September 2026",
        type: "Minor (Penambahan Fitur)",
        changes: [
          "Pembaruan ketentuan penggunaan fitur AI Scan Struk Belanja (1–8 foto) dengan arsitektur Bring Your Own Key (BYOK) dan fitur Smart Split Bill.",
          "Penambahan informasi manajemen sesi multi-perangkat dan re-autentikasi kata sandi untuk penghapusan akun.",
        ],
      },
      {
        version: "2.0.0",
        date: "15 Juli 2026",
        type: "Mayor",
        changes: [
          "Peluncuran MoneFin Trust Center dalam dua bahasa (Bahasa Indonesia & Bahasa Inggris) beserta modul gamifikasi non-moneter.",
        ],
      },
    ],
    en: [
      {
        version: "3.0.0",
        date: "September 29, 2026",
        type: "Major (Rights, Structural & Regulatory Alignment)",
        changes: [
          "Aligned all three documents with Indonesian PDP Law No. 27/2022, Consumer Protection Law No. 8/1999, NIST SP 800-63B, ISO/IEC 27002/27701/29147, and OWASP ASVS guidelines.",
          "Updated minimum user age requirement to 18 years old (or under 18 with verifiable parental/guardian consent pursuant to Article 25 of UU PDP).",
          "Added an explicit Safe Harbor exemption in the Terms of Service for good-faith security researchers and published /.well-known/security.txt (RFC 9116).",
          "Clarified the distinction between MoneFin's AI data handling (0-day database retention for chat history) and upstream BYOK AI providers, and clarified full IP address logging for active session management.",
          "Removed unverified superlative claims, removed deprecated X-XSS-Protection header, specified exact cryptographic algorithms (Bcrypt, SHA-256, AES-256-CBC), and separated official contact channels (security@, privacy@, legal@, support@monefin.web.id).",
          "Added structured Data Retention Table, Sub-Processor Registry, Cookie & LocalStorage Table, Security Controls Matrix, and Data Protection Authority complaint procedures.",
        ],
      },
      {
        version: "2.4.0",
        date: "September 5, 2026",
        type: "Minor (Feature Addition)",
        changes: [
          "Added terms and privacy disclosures for Multi-Photo AI Receipt Scanning (1–8 photos) using Bring Your Own Key (BYOK) and Smart Split Bill.",
          "Added multi-device session management and password re-authentication disclosures.",
        ],
      },
      {
        version: "2.0.0",
        date: "July 15, 2026",
        type: "Major",
        changes: [
          "Launched the bilingual MoneFin Trust Center (Indonesian & English) and non-monetary gamification terms.",
        ],
      },
    ],
  },
};
