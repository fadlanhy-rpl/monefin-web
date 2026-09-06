// Data and copy for MoneFin Legal & Trust Pages (Terms, Privacy, Security)
// Tailored specifically to MoneFin's personal finance platform, UU PDP No. 27/2022, and latest security hardening.

export const legalData = {
  id: {
    common: {
      back: "Kembali",
      lastUpdated: "Terakhir Diperbarui",
      effectiveDate: "Berlaku Efektif: September 2026",
      jurisdiction: "Yurisdiksi: Republik Indonesia",
      tableOfContents: "Daftar Isi",
      quickSummaryTitle: "Ringkasan Cepat dalam 30 Detik",
      copyLink: "Salin Tautan Halaman",
      linkCopied: "Tautan berhasil disalin ke clipboard!",
      print: "Cetak Dokumen",
      contactTitle: "Pertanyaan atau Bantuan?",
      contactDesc: "Tim kepatuhan dan keamanan MoneFin siap membantu Anda.",
      responseTime: "Waktu respons rata-rata: < 24 jam kerja",
      otherDocuments: "Dokumen Kepatuhan Terkait",
      readNext: "Lanjutkan membaca",
      feedbackTitle: "Apakah informasi ini jelas bagi Anda?",
      feedbackDesc: "Kami berkomitmen untuk menyajikan ketentuan secara transparan tanpa klausa tersembunyi.",
      tabs: {
        terms: "Syarat & Ketentuan",
        privacy: "Kebijakan Privasi",
        security: "Standar Keamanan"
      }
    },
    terms: {
      title: "Syarat & Ketentuan Layanan",
      subtitle: "Perjanjian transparansi penggunaan platform pencatatan keuangan, split bill, dan asisten analitik MoneFin.",
      badge: "Perjanjian Layanan Digital",
      version: "Versi 2.4",
      updatedDate: "5 September 2026",
      summaryPoints: [
        "MoneFin adalah perangkat lunak manajemen keuangan pribadi mandiri, bukan lembaga perbankan, penasihat keuangan berlisensi, atau pengelola dana investasi.",
        "Fitur Split Bill memfasilitasi kalkulasi dan pencatatan administratif pembagian tagihan; MoneFin tidak memegang saldo escrow atau memproses dana secara langsung antar-rekan.",
        "Pengguna memiliki kendali penuh atas akunnya, wajib menjaga kredensial, dan re-autentikasi kata sandi diwajibkan untuk tindakan kritis seperti penghapusan akun permanen."
      ],
      sections: [
        {
          id: "scope",
          number: "01",
          title: "Penerimaan Ketentuan & Ruang Lingkup Layanan",
          paragraphs: [
            "Selamat datang di MoneFin. Syarat dan Ketentuan Layanan ini ('Ketentuan') merupakan perjanjian hukum yang mengikat antara Anda sebagai pengguna ('Pengguna' atau 'Anda') dengan MoneFin ('Kami'). Dengan membuat akun, mengunduh, mengakses, atau menggunakan platform MoneFin, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan ini.",
            "MoneFin menyediakan layanan perangkat lunak berbasis web dan mobile untuk pencatatan transaksi keuangan mandiri, agregasi saldo dompet/rekening, perencanaan anggaran bulanan (budgeting), simulasi tabungan (goals), pembagian tagihan bersama (split bill), serta wawasan analitik berbantuan kecerdasan buatan (AI Assistant)."
          ]
        },
        {
          id: "disclaimer",
          number: "02",
          title: "Sifat Layanan — Non-Penasihat Keuangan Berlisensi",
          callout: {
            type: "important",
            title: "Pernyataan Batasan Sifat Layanan",
            text: "MoneFin bukan lembaga perbankan, bukan penasihat keuangan terdaftar, bukan manajer investasi, dan bukan perantara pedagang efek. Segala ringkasan analitik dan saran dari AI Assistant bersifat edukatif dan informatif."
          },
          paragraphs: [
            "MoneFin dirancang murni sebagai alat bantu pencatatan, kalkulasi matematis, dan visualisasi data keuangan pribadi yang Anda inputkan secara mandiri.",
            "Segala wawasan pengeluaran, proyeksi anggaran, maupun rekomendasi yang dihasilkan oleh sistem otomatis atau AI Assistant tidak dapat dianggap sebagai saran investasi legal, anjuran perpajakan, maupun nasihat perencanaan keuangan formal. Setiap keputusan alokasi dana, pembelian instrumen keuangan, maupun tindakan pengeluaran sepenuhnya merupakan pertimbangan dan tanggung jawab pribadi Anda."
          ]
        },
        {
          id: "account",
          number: "03",
          title: "Akun Pengguna, Keabsahan Data, & Batas Usia",
          paragraphs: [
            "Untuk menggunakan fitur MoneFin secara penuh, Anda wajib mendaftarkan akun dengan memasukkan alamat email yang valid dan aktif serta kata sandi yang memenuhi standar keamanan kami (minimal 8 karakter).",
            "Layanan ini diperuntukkan bagi individu yang telah berusia minimal 17 (tujuh belas) tahun atau telah memiliki kartu identitas resmi dan kecakapan hukum untuk mengikatkan diri dalam perjanjian menurut peraturan perundang-undangan di Republik Indonesia.",
            "Satu akun hanya diperuntukkan bagi satu pengguna individu. Anda dilarang meminjamkan, mengalihkan, atau menjual akses akun MoneFin Anda kepada pihak lain."
          ]
        },
        {
          id: "security-responsibility",
          number: "04",
          title: "Tanggung Jawab Keamanan Akun & Kredensial",
          paragraphs: [
            "Anda bertanggung jawab penuh untuk menjaga kerahasiaan kata sandi akun Anda, kode One-Time Password (OTP) verifikasi yang dikirimkan ke email Anda, serta token akses sesi Anda.",
            "MoneFin tidak akan pernah meminta kata sandi akun, kode OTP, atau informasi kredensial perbankan Anda melalui pesan pribadi, telepon, email tidak resmi, atau media sosial.",
            "Untuk melindungi data sensitif Anda, MoneFin menerapkan re-autentikasi kata sandi untuk aksi destruktif: Anda wajib mengonfirmasi kata sandi Anda kembali saat hendak menghapus akun secara permanen. Anda dapat memantau dan memutus sesi login pada perangkat lain sewaktu-waktu melalui menu Pengaturan Keamanan."
          ]
        },
        {
          id: "split-bill",
          number: "05",
          title: "Fitur Split Bill & Pelunasan Antar-Pengguna",
          paragraphs: [
            "Fitur Split Bill di MoneFin memfasilitasi perhitungan matematis pembagian tagihan bersama (proporsional sama rata, persentase kontribusi, atau alokasi nominal eksak per item), termasuk kalkulasi pajak dan biaya layanan secara otomatis.",
            "MoneFin bukan penyedia dompet digital penampung dana bersama (escrow) dan tidak memotong atau mentransfer uang dari rekening peserta tagihan. Status 'Lunas' atau 'Menunggu Pembayaran' di dalam fitur Split Bill merupakan catatan administratif internal pengguna.",
            "Pelunasan tagihan fisik atau transfer dana riil dilakukan secara langsung dan independen antar-individu yang bersangkutan melalui saluran pembayaran pilihan masing-masing (transfer bank, e-wallet, atau tunai)."
          ]
        },
        {
          id: "ai-terms",
          number: "06",
          title: "Penggunaan Asisten AI & Pembatasan Data Sangat Rahasia",
          callout: {
            type: "warning",
            title: "Jangan Pernah Memasukkan Kredensial Rahasia",
            text: "Dilarang keras memasukkan PIN ATM, kode OTP perbankan, password akun bank, nomor kartu kredit/debit lengkap, atau kode CVV ke dalam percakapan AI maupun kolom catatan transaksi."
          },
          paragraphs: [
            "MoneFin mengintegrasikan teknologi model bahasa tingkat lanjut untuk membantu Anda mengkategorikan pengeluaran dan memberikan wawasan keuangan interaktif.",
            "Pemrosesan prompt AI dilakukan melalui lingkungan API perusahaan yang terisolasi secara privat tanpa penyimpanan jangka panjang oleh penyedia model publik. Meskipun demikian, demi keamanan berlapis, Anda diwajibkan untuk tidak pernah mencantumkan nomor rekening bank lengkap, PIN, CVV, atau kredensial rahasia apa pun ke dalam sistem MoneFin."
          ]
        },
        {
          id: "gamification",
          number: "07",
          title: "Fitur Gamifikasi, Lencana (Badges), XP, & Sifat Non-Moneter",
          callout: {
            type: "important",
            title: "Poin Gamifikasi Bukan Saldo Moneter Riil",
            text: "Seluruh poin pengalaman (XP), lencana pencapaian (badges), dan streak harian dirancang murni sebagai motivasi kebiasaan finansial sehat. Poin ini tidak memiliki nilai konversi ke uang tunai (fiat) dan tidak dapat dicairkan atau diperjualbelikan."
          },
          paragraphs: [
            "MoneFin menyediakan modul gamifikasi edukatif yang memberikan reward berupa XP dan lencana prestasi ketika Anda konsisten mencatat pengeluaran, mencapai target tabungan (Goals), atau menjaga pengeluaran tetap di bawah batas anggaran.",
            "Bonus penyelesaian target (completion bonus) dan lencana bersifat virtual di dalam aplikasi MoneFin. Pengguna dilarang memanipulasi atau mengeksploitasi celah data untuk mengubah saldo XP secara artifisial."
          ]
        },
        {
          id: "intellectual-property",
          number: "08",
          title: "Hak Kekayaan Intelektual",
          paragraphs: [
            "Seluruh hak cipta, merek dagang, desain antarmuka pengguna (UI/UX), logo visual, maskot, kode sumber perangkat lunak, algoritma analitik, dan materi dokumentasi MoneFin adalah milik eksklusif MoneFin.",
            "Kami memberikan Anda lisensi terbatas, non-eksklusif, tidak dapat dipindahtangankan, dan dapat ditarik kembali semata-mata untuk menggunakan aplikasi MoneFin pada perangkat pribadi Anda sesuai Ketentuan ini.",
            "Anda dilarang mendekompilasi, merekayasa balik (reverse engineer), menyalin, mendistribusikan ulang, melakukan automated scraping pada endpoint API, atau membuat karya turunan dari platform MoneFin tanpa persetujuan tertulis resmi dari kami."
          ]
        },
        {
          id: "liability",
          number: "09",
          title: "Batasan Tanggung Jawab & Jaminan Sistem",
          paragraphs: [
            "MoneFin berupaya semaksimal mungkin memastikan keandalan, uptime sistem yang tinggi, serta integritas data saldo Anda melalui arsitektur database modern berstandar ACID. Namun demikian, layanan ini disediakan atas dasar 'sebagaimana adanya' ('as is') dan 'sebagaimana tersedia' ('as available').",
            "MoneFin tidak bertanggung jawab atas kegagalan akses yang disebabkan oleh gangguan koneksi internet pengguna, kerusakan perangkat lokal, tindakan pihak ketiga yang tidak berwenang akibat kelalaian pengguna dalam menjaga kredensial, atau kondisi force majeure di luar kendali wajar kami.",
            "MoneFin menyediakan fitur ekspor data riwayat transaksi sehingga Anda dapat melakukan pencadangan (backup) catatan keuangan secara mandiri kapan pun diperlukan."
          ]
        },
        {
          id: "termination",
          number: "10",
          title: "Penutupan Akun & Pemutusan Layanan",
          paragraphs: [
            "Anda berhak menutup dan menghapus akun Anda kapan pun melalui aplikasi. Penghapusan akun secara permanen akan menghapus seluruh profil pengguna, catatan rekening, transaksi, budget, split bill, dan token sesi aktif secara permanen dari server aktif kami.",
            "MoneFin berhak menangguhkan atau menghentikan akses Anda jika ditemukan indikasi kuat bahwa akun Anda digunakan untuk aktivitas yang melanggar hukum, upaya penyerangan siber terhadap infrastruktur MoneFin (seperti serangan IDOR, SQL injection, atau brute-force), atau pelanggaran berat terhadap Ketentuan ini."
          ]
        },
        {
          id: "governing-law",
          number: "11",
          title: "Hukum yang Berlaku & Penyelesaian Sengketa",
          paragraphs: [
            "Syarat & Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Negara Kesatuan Republik Indonesia.",
            "Segala perselisihan yang timbul sehubungan dengan penafsiran atau pelaksanaan Ketentuan ini akan diupayakan untuk diselesaikan terlebih dahulu secara musyawarah mufakat. Apabila dalam waktu 30 (tiga puluh) hari musyawarah tidak mencapai kesepakatan, perselisihan akan diselesaikan melalui yurisdiksi pengadilan negeri yang berwenang di Republik Indonesia.",
            "Untuk pertanyaan hukum resmi atau klarifikasi ketentuan, silakan hubungi tim hukum kami melalui email legal@monefin.com."
          ]
        }
      ]
    },
    privacy: {
      title: "Kebijakan Privasi",
      subtitle: "Komitmen perlindungan data pribadi berlandaskan UU PDP No. 27/2022. Privasi finansial Anda adalah prioritas non-kompromi kami.",
      badge: "Kepatuhan UU PDP No. 27/2022",
      version: "Versi 2.4",
      updatedDate: "5 September 2026",
      summaryPoints: [
        "MoneFin menerapkan prinsip Zero Data Brokering: kami TIDAK PERNAH menjual, menyewakan, atau memperdagangkan data transaksi keuangan Anda kepada pihak ketiga atau pengiklan.",
        "Pemrosesan analitik AI dilakukan secara privat dan terisolasi: prompt keuangan Anda TIDAK PERNAH digunakan untuk melatih model AI publik pihak ketiga.",
        "Anda memiliki hak penuh sebagai Subjek Data (akses, ekspor, perbaikan, dan penghapusan permanen akun beserta seluruh riwayat transaksi tanpa penundaan)."
      ],
      sections: [
        {
          id: "pdp-commitment",
          number: "01",
          title: "Komitmen Privasi & Landasan Hukum (UU PDP No. 27/2022)",
          paragraphs: [
            "Di MoneFin, kami memandang privasi keuangan sebagai hak fundamental setiap individu. Kebijakan Privasi ini disusun berdasarkan kepatuhan penuh terhadap Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi ('UU PDP') serta standar tata kelola data digital terkini.",
            "Kebijakan ini menguraikan jenis data pribadi yang kami kumpulkan, dasar pemrosesan yang sah, perlindungan teknis yang kami terapkan, serta hak-hak hukum Anda sebagai Subjek Data saat menggunakan ekosistem MoneFin."
          ]
        },
        {
          id: "data-collected",
          number: "02",
          title: "Kategori Data Pribadi yang Kami Kumpulkan",
          paragraphs: [
            "Kami hanya mengumpulkan data pribadi yang benar-benar relevan dan diperlukan secara proporsional untuk mengoperasikan fungsi aplikasi keuangan:",
            "1. Data Identitas Akun: Nama lengkap atau nama panggilan, alamat email aktif, kata sandi ter-hash (menggunakan algoritma adaptif kuat berstandar industri), serta foto profil jika Anda memilih untuk mengunggahnya.",
            "2. Data Catatan Finansial yang Anda Masukkan: Label nama rekening/dompet (misal: 'Tabungan BCA', 'Kantong Jago', 'Uang Tunai'), saldo awal yang Anda cantumkan, riwayat transaksi pemasukan dan pengeluaran, kategori pengeluaran, anggaran bulanan, target tabungan, dan partisipan split bill.",
            "3. Data Teknis & Keamanan Sesi: Alamat IP yang disamarkan (anonymized), tipe peramban web (User-Agent), sistem operasi perangkat, serta riwayat cap waktu login aktif yang digunakan untuk fitur deteksi sesi multi-perangkat.",
            "4. Query Percakapan Asisten AI: Teks pertanyaan yang Anda ajukan ke asisten cerdas MoneFin terkait analisis pengeluaran Anda, yang disimpan secara terenkripsi dan terikat khusus pada akun Anda."
          ]
        },
        {
          id: "zero-data-brokering",
          number: "03",
          title: "Prinsip Nol Penjualan Data (Zero Data Brokering)",
          callout: {
            type: "shield",
            title: "Jaminan Transparansi 100%",
            text: "MoneFin tidak memonetisasi data pengguna melalui periklanan pihak ketiga. Data transaksi dan saldo Anda adalah milik Anda sepenuhnya, bukan komoditas bisnis."
          },
          paragraphs: [
            "Kami memberikan jaminan tegas: MoneFin tidak pernah dan tidak akan pernah menjual, menyewakan, memperdagangkan, atau membagikan catatan transaksi, riwayat saldo, atau informasi pribadi Anda kepada perusahaan periklanan, broker data, atau entitas pemasaran pihak ketiga mana pun.",
            "Pendapatan MoneFin tidak berasal dari penjualan profil pengguna atau penargetan iklan. Model operasional kami berfokus murni pada penyediaan perangkat lunak manajemen keuangan berkualitas tinggi dan aman."
          ]
        },
        {
          id: "purpose",
          number: "04",
          title: "Tujuan & Dasar Pemrosesan Data yang Sah",
          paragraphs: [
            "Sesuai Pasal 20 UU PDP, pemrosesan data pribadi oleh MoneFin berlandaskan pada persetujuan eksplisit Anda dan pelaksanaan kontrak layanan, yang bertujuan semata-mata untuk:",
            "• Menghitung dan menyajikan ringkasan saldo, arus kas harian, mingguan, dan bulanan.",
            "• Memvisualisasikan grafik laporan perbandingan kategori pengeluaran dan capaian anggaran Anda.",
            "• Memproses formula pembagian tagihan split bill antar-peserta dengan pembulatan matematis yang tepat.",
            "• Mengirimkan kode keamanan One-Time Password (OTP) ke email terdaftar Anda saat verifikasi registrasi atau pemulihan kata sandi.",
            "• Memfasilitasi fitur keamanan seperti pemberitahuan aktivitas sesi baru dan perlindungan dari akses tidak sah.",
            "• Menyediakan respon analitik keuangan cerdas melalui integrasi AI Assistant."
          ]
        },
        {
          id: "ai-privacy",
          number: "05",
          title: "Pemrosesan AI yang Terisolasi & Tanpa Pelatihan Publik",
          callout: {
            type: "important",
            title: "Privasi Percakapan AI Terisolasi",
            text: "Data keuangan dan percakapan Anda tidak pernah digunakan sebagai bahan pelatihan (training data) untuk model AI publik pihak ketiga mana pun."
          },
          paragraphs: [
            "Fitur asisten cerdas di MoneFin memproses pertanyaan Anda melalui sambungan API perusahaan yang memiliki perjanjian privasi ketat (Zero Data Retention by upstream AI providers).",
            "Data masukan Anda dienkripsi saat transit menggunakan TLS 1.3 dan diproses hanya untuk menghasilkan respons finansial seketika. Penyedia model AI pihak ketiga terikat kontrak larangan penggunaan data pelanggan untuk melatih atau menyempurnakan model bahasa publik mereka."
          ]
        },
        {
          id: "storage-retention",
          number: "06",
          title: "Penyimpanan, Retensi, & Enkripsi Data",
          paragraphs: [
            "Data Anda disimpan pada pusat data komputasi awan yang menerapkan sertifikasi keamanan internasional (ISO 27001 dan SOC 2). Seluruh lalu lintas data antara peramban Anda dan server backend MoneFin dilindungi oleh enkripsi Transport Layer Security (TLS 1.3 / HTTPS).",
            "Kata sandi pengguna dienkripsi secara satu arah (one-way hashing) menggunakan algoritma Bcrypt/Argon2id dengan salt unik. Token otentikasi Sanctum disimpan dalam bentuk cryptographic hash di basis data kami.",
            "Data keuangan Anda disimpan selama akun Anda aktif. Apabila Anda memutuskan untuk menghapus akun Anda, seluruh data rekening, mutasi transaksi, budget, split bill, serta riwayat sesi akan dihapus secara permanen dan tidak dapat dipulihkan kembali dari sistem aktif kami."
          ]
        },
        {
          id: "data-subject-rights",
          number: "07",
          title: "Hak Anda sebagai Subjek Data Sesuai UU PDP",
          paragraphs: [
            "Berdasarkan Bab IV UU PDP, Anda memiliki hak-hak hukum berikut yang dapat Anda jalankan secara mandiri langsung melalui aplikasi MoneFin:",
            "1. Hak Mendapatkan Akses & Portabilitas Data: Anda berhak melihat seluruh data catatan keuangan Anda kapan saja serta mengekspornya ke format digital (CSV/Excel/PDF).",
            "2. Hak Pembaruan & Koreksi (Rektifikasi): Anda bebas mengubah, menyunting nama rekening, rincian transaksi, anggaran, dan profil akun Anda sewaktu-waktu.",
            "3. Hak Menghapus Data (Right to Erasure / Hak untuk Dilupakan): Anda berhak menghapus akun Anda beserta seluruh riwayat transaksi secara mandiri melalui menu Pengaturan Profil dengan konfirmasi kata sandi.",
            "4. Hak Memutus Sesi & Akses (Revokasi): Anda berhak memutuskan sesi login aktif pada perangkat lain dari jarak jauh jika perangkat tersebut tidak lagi Anda gunakan.",
            "5. Hak Penarikan Persetujuan: Anda dapat menghentikan penggunaan layanan dan meminta penutupan akun tanpa biaya atau penalti apa pun."
          ]
        },
        {
          id: "cookies-tokens",
          number: "08",
          title: "Kebijakan Cookies, Token Sesi, & Penyimpanan Lokal",
          paragraphs: [
            "MoneFin tidak menggunakan tracking cookies pihak ketiga untuk melacak aktivitas Anda di situs web lain.",
            "Kami menggunakan token sesi otentikasi ber-prefix 'mnf_' yang disimpan secara aman untuk menjaga sesi login Anda tetap valid.",
            "Penyimpanan lokal peramban (localStorage) hanya digunakan untuk menyimpan preferensi tampilan antarmuka yang tidak sensitif, seperti pilihan bahasa (Indonesia / English) dan status mode sembunyikan saldo (Privacy Mode)."
          ]
        },
        {
          id: "dpo-contact",
          number: "09",
          title: "Kontak Petugas Perlindungan Data Pribadi (DPO)",
          paragraphs: [
            "MoneFin telah menunjuk tim kepatuhan dan perlindungan data yang bertugas memastikan seluruh operasional data berjalan sesuai dengan regulasi perlindungan data pribadi yang berlaku.",
            "Apabila Anda memiliki pertanyaan, keluhan, permohonan ekspor khusus, atau ingin menjalankan hak Subjek Data Anda, silakan hubungi Pejabat Perlindungan Data kami melalui email:",
            "Email: privacy@monefin.com"
          ]
        }
      ]
    },
    security: {
      title: "Standar Keamanan & Arsitektur Sistem",
      subtitle: "Transparansi perlindungan berlapis (Defense in Depth), pencegahan IDOR, enkripsi modern, dan audit integritas data.",
      badge: "Keamanan Tingkat Enterprise · Level A",
      version: "Versi 2.4",
      updatedDate: "5 September 2026",
      summaryPoints: [
        "Isolasi multi-tenant 100%: Seluruh endpoint transaksi, rekening, anggaran, dan split bill divalidasi dengan aturan kepemilikan user (IDOR Shield) pada level baris database.",
        "Integritas transaksi finansial: Mutasi saldo dilindungi transaksi database ACID dan pessimistic row locking untuk mencegah anomali race condition atau double-spending.",
        "Autentikasi & respon diperkuat: CSPRNG OTP generator (random_int), anti-email enumeration, token prefix 'mnf_', dan HTTP security headers tingkat perbankan (X-Frame-Options DENY, CSP, nosniff)."
      ],
      sections: [
        {
          id: "philosophy",
          number: "01",
          title: "Filosofi Keamanan: Defense in Depth & Zero Trust",
          paragraphs: [
            "Keamanan di MoneFin bukan sekadar fitur tempelan di akhir pengembangan, melainkan prinsip utama yang mendasari setiap keputusan arsitektur perangkat lunak kami. Kami menerapkan pendekatan Defense in Depth (Pertahanan Berlapis) dan Zero Trust di seluruh spektrum sistem.",
            "Setiap permintaan data (request) yang masuk melalui API kami melewati serangkaian lapisan validasi: verifikasi firewall, middleware security headers, rate limiting anti-abuse, verifikasi token otentikasi kriptografis, otorisasi kepemilikan data di level service, hingga eksekusi query berparameter pada basis data."
          ]
        },
        {
          id: "idor-protection",
          number: "02",
          title: "Proteksi IDOR & Otorisasi Baris (Row-Level Isolation)",
          callout: {
            type: "shield",
            title: "Perlindungan Kepemilikan Data Pengguna (IDOR Shield)",
            text: "Setiap resource (rekening, kategori, transaksi, budget, split bill, goals) divalidasi kepemilikannya terhadap identitas pengguna yang terotentikasi. Akses lintas-pengguna dicegah secara mutlak."
          },
          paragraphs: [
            "Insecure Direct Object References (IDOR) adalah salah satu kerentanan paling krusial pada aplikasi web modern. Di MoneFin, kami menerapkan validasi kepemilikan ketat menggunakan aturan validasi berlapis dan scoping query database.",
            "Pada seluruh controller utama (termasuk TransactionController, BudgetController, SplitBillController, IncomeSettingController, dan CategoryController), setiap field referensi foreign-key (seperti account_id, category_id, goal_id) divalidasi secara eksplisit bahwa record tersebut memang milik pengguna yang sedang terotentikasi:",
            "Mekanisme ini menjamin bahwa Pengguna A mustahil membaca, mengubah, mengaitkan, atau mendebit rekening/kategori milik Pengguna B, sekalipun ID angka pada parameter request sengaja dimanipulasi."
          ]
        },
        {
          id: "encryption-standards",
          number: "03",
          title: "Standar Enkripsi: In-Transit & At-Rest",
          paragraphs: [
            "MoneFin menerapkan protokol kriptografi mutakhir untuk mengamankan data Anda baik saat berpindah maupun saat tersimpan:",
            "• Enkripsi Saat Transit (In-Transit): Semua komunikasi antara aplikasi front-end peramban web dan server API backend diwajibkan menggunakan protokol TLS 1.3 / HTTPS dengan cipher suite modern yang mendukung Perfect Forward Secrecy (PFS). Sambungan HTTP polos otomatis dialihkan ke HTTPS. Selain itu, panggilan komunikasi API internal backend ke provider AI mewajibkan verifikasi sertifikat SSL ketat (verify = true).",
            "• Enkripsi Kata Sandi (At-Rest): Kata sandi Anda tidak pernah disimpan dalam bentuk teks biasa (plaintext). Kami menggunakan algoritma adaptif kuat berstandar industri (Bcrypt/Argon2id) dengan salt unik untuk mencegah serangan rainbow table dan cracking berkecepatan tinggi.",
            "• Token Hashing: Token otentikasi Sanctum yang disimpan di database disimpan dalam representasi cryptographic hash SHA-256; token mentah hanya diserahkan satu kali saat otentikasi berhasil."
          ]
        },
        {
          id: "ledger-integrity",
          number: "04",
          title: "Integritas Buku Kas & Pessimistic Concurrency Locking",
          paragraphs: [
            "Pada aplikasi keuangan, integritas mutasi saldo rekening adalah hal yang sangat vital. Kesalahan perhitungan akibat eksekusi simultan (race condition) dapat menyebabkan anomali saldo.",
            "MoneFin mengisolasi setiap operasi mutasi keuangan di dalam Database Transaction yang mematuhi prinsip ACID (Atomicity, Consistency, Isolation, Durability).",
            "Kami menerapkan Pessimistic Row Locking (SELECT ... FOR UPDATE) pada baris akun sebelum perhitungan penambahan atau pengurangan saldo dieksekusi. Hal ini menjamin bahwa mutasi transaksi paralel, proses recurring income terjadwal, dan pelunasan split bill dieksekusi secara terurut tanpa kemungkinan double-spending atau saldo tidak sinkron."
          ]
        },
        {
          id: "auth-hardening",
          number: "05",
          title: "Autentikasi Modern, CSPRNG, & Anti-Brute Force",
          paragraphs: [
            "Sistem autentikasi MoneFin telah diperkuat dengan sejumlah standar keamanan tinggi:",
            "1. CSPRNG OTP Generator: Pembuatan kode verifikasi 6 digit (One-Time Password) menggunakan generator angka acak kriptografis sejati (Cryptographically Secure Pseudo-Random Number Generator / random_int()), menggantikan fungsi acak pseudo-random biasa (rand()) yang rentan ditebak.",
            "2. Anti-Email Enumeration: Endpoint pemulihan kata sandi (Forgot Password) dan pengiriman ulang OTP merespons secara seragam dengan status HTTP 200 OK dan pesan umum yang ramah: 'Jika email terdaftar, kode OTP akan segera dikirimkan.' Hal ini mencegah penyerang memanfaatkan respon error untuk mendeteksi email siapa saja yang terdaftar di MoneFin.",
            "3. Rate Limiting Berlapis: Endpoint otentikasi (/api/auth/*) dilindungi pembatasan frekuensi request (rate limiting) ketat berbasis IP dan identitas untuk menangkal serangan brute-force, dictionary attack, dan credential stuffing.",
            "4. Sanctum Token Prefix 'mnf_': Token akses sesi dilengkapi awalan unik 'mnf_', memungkinkan sistem pemindaian keamanan repositori otomatis (seperti GitHub Secret Scanning) untuk mendeteksi kebocoran token secara instan."
          ]
        },
        {
          id: "security-headers",
          number: "06",
          title: "Security Response Headers Tingkat Perbankan",
          callout: {
            type: "shield",
            title: "Perlindungan Browser-Level",
            text: "Middleware SecurityHeaders aktif pada seluruh respons API untuk mencegah serangan injeksi antarmuka, clickjacking, dan pencurian MIME-type."
          },
          paragraphs: [
            "Setiap respons HTTP yang dikirimkan oleh backend MoneFin diperkaya dengan rangkaian security headers berstandar internasional:",
            "• X-Frame-Options: DENY — Melindungi pengguna dari serangan Clickjacking dengan melarang antarmuka aplikasi disematkan ke dalam <iframe> atau frame situs luar.",
            "• X-Content-Type-Options: nosniff — Mencegah peramban melakukan MIME-sniffing yang dapat mengeksekusi konten berbahaya sebagai skrip.",
            "• X-XSS-Protection: 1; mode=block — Mengaktifkan filter pencegahan Cross-Site Scripting bawaan peramban.",
            "• Referrer-Policy: strict-origin-when-cross-origin — Memastikan rute URL internal tidak bocor saat pengguna berpindah ke domain eksternal.",
            "• Permissions-Policy: geolocation=(), microphone=(), camera=() — Menutup akses perangkat keras yang tidak dibutuhkan oleh platform keuangan.",
            "• Content-Security-Policy (CSP): default-src 'none'; frame-ancestors 'none' — Membatasi domain asal eksekusi skrip (dengan pengecualian cerdas otomatis untuk Server-Sent Events / SSE streaming pada AI Assistant)."
          ]
        },
        {
          id: "session-management",
          number: "07",
          title: "Manajemen Sesi Multi-Perangkat & Remote Revocation",
          paragraphs: [
            "MoneFin memberi Anda kendali penuh atas sesi masuk aktif Anda. Melalui antarmuka Pengaturan Keamanan, Anda dapat memeriksa:",
            "• Daftar seluruh perangkat dan peramban yang saat ini memiliki sesi aktif di akun Anda.",
            "• Waktu aktivitas terakhir dan alamat IP perangkat yang terhubung.",
            "• Tombol 'Putuskan Sesi Lain' (Revoke Other Sessions) yang memungkinkan Anda mencabut akses di semua perangkat lain dengan sekali klik apabila Anda menduga perangkat Anda tertinggal di tempat umum atau dicuri."
          ]
        },
        {
          id: "reauthentication",
          number: "08",
          title: "Konfirmasi Re-autentikasi untuk Tindakan Berisiko Tinggi",
          paragraphs: [
            "Untuk mencegah tindakan sabotase atau kelalaian saat perangkat Anda ditinggalkan dalam keadaan login, MoneFin mewajibkan konfirmasi kata sandi ulang untuk aksi berisiko tinggi.",
            "Sebagai contoh, permintaan penghapusan akun permanen (DELETE /api/auth/profile) tidak dapat dieksekusi hanya dengan token sesi biasa. Pengguna wajib menyertakan kata sandi akun di dalam request body untuk diverifikasi secara kriptografis oleh server sebelum proses penghapusan data dijalankan."
          ]
        },
        {
          id: "responsible-disclosure",
          number: "09",
          title: "Program Pengungkapan Kerentanan Bertanggung Jawab (Responsible Disclosure)",
          paragraphs: [
            "Kami sangat menghargai kontribusi komunitas peneliti keamanan siber independen (security researchers) dalam membantu menjaga ekosistem MoneFin tetap aman.",
            "Apabila Anda menemukan potensi celah keamanan atau kerentanan pada infrastruktur MoneFin, kami mengundang Anda untuk melaporkannya secara bertanggung jawab dan beretika melalui saluran khusus:",
            "Email Tim Keamanan: security@monefin.com",
            "Kebijakan kami terhadap pelapor yang beriktikad baik: Kami berkomitmen merespons dan memverifikasi laporan Anda dalam waktu maksimal 1x24 jam kerja, tidak akan mengambil tindakan hukum terhadap pengujian yang wajar dan bertanggung jawab, serta mencantumkan nama Anda dalam Hall of Fame kontributor keamanan kami."
          ]
        }
      ]
    }
  },
  en: {
    common: {
      back: "Back",
      lastUpdated: "Last Updated",
      effectiveDate: "Effective Date: September 2026",
      jurisdiction: "Jurisdiction: Republic of Indonesia",
      tableOfContents: "Table of Contents",
      quickSummaryTitle: "Quick Summary in 30 Seconds",
      copyLink: "Copy Page Link",
      linkCopied: "Page link copied to clipboard!",
      print: "Print Document",
      contactTitle: "Questions or Inquiries?",
      contactDesc: "MoneFin's compliance and security teams are here to assist you.",
      responseTime: "Average response time: < 24 business hours",
      otherDocuments: "Related Compliance Documents",
      readNext: "Continue reading",
      feedbackTitle: "Was this document clear and helpful?",
      feedbackDesc: "We are dedicated to presenting terms transparently with zero hidden fine print.",
      tabs: {
        terms: "Terms of Service",
        privacy: "Privacy Policy",
        security: "Security Standards"
      }
    },
    terms: {
      title: "Terms of Service",
      subtitle: "Transparency agreement governing the use of MoneFin's financial tracking, split bill, and AI analytics platform.",
      badge: "Digital Service Agreement",
      version: "Version 2.4",
      updatedDate: "September 5, 2026",
      summaryPoints: [
        "MoneFin is a self-directed personal finance tool, not a banking institution, licensed financial advisor, or investment manager.",
        "Split Bill facilitates computational and administrative expense allocation; MoneFin does not hold escrow balances or transfer funds directly between peers.",
        "Users hold full responsibility for their credentials, and password re-authentication is strictly enforced for destructive actions such as permanent account deletion."
      ],
      sections: [
        {
          id: "scope",
          number: "01",
          title: "Acceptance of Terms & Scope of Services",
          paragraphs: [
            "Welcome to MoneFin. These Terms of Service ('Terms') constitute a legally binding agreement between you as an individual user ('User' or 'You') and MoneFin ('We' or 'Us'). By creating an account, downloading, accessing, or using MoneFin, you acknowledge that you have read, understood, and agreed to be bound by these Terms.",
            "MoneFin provides software solutions for self-directed personal financial logging, wallet aggregation, monthly budgeting, financial goal simulations, social split bills, and artificial intelligence-assisted analytical insights (AI Assistant)."
          ]
        },
        {
          id: "disclaimer",
          number: "02",
          title: "Nature of Service — Non-Licensed Financial Advisor",
          callout: {
            type: "important",
            title: "Important Non-Advisory Disclaimer",
            text: "MoneFin is not a bank, not a registered financial planner, not an investment advisor, and not a securities broker. All analytical summaries and AI assistant responses are purely informational and educational."
          },
          paragraphs: [
            "MoneFin is engineered purely as a tool for computational recording, aggregation, and visualization of personal financial data manually entered or authorized by you.",
            "Spending insights, budget projections, and recommendations provided by automated algorithms or the AI Assistant must not be construed as certified legal, tax, or investment advice. Any allocation of capital, purchase of financial instruments, or budgeting decision remains entirely your personal prerogative and responsibility."
          ]
        },
        {
          id: "account",
          number: "03",
          title: "User Account, Data Accuracy, & Age Eligibility",
          paragraphs: [
            "To unlock MoneFin's complete feature set, you must register using a valid email address and a password that meets our strict security criteria (minimum 8 characters).",
            "This service is strictly intended for individuals who are at least 17 (seventeen) years old or possess legal capacity under the laws of the Republic of Indonesia.",
            "Each account is designated for a single individual. You are expressly prohibited from renting, transferring, or delegating your account access to third parties."
          ]
        },
        {
          id: "security-responsibility",
          number: "04",
          title: "Account Security Responsibilities & Credentials",
          paragraphs: [
            "You are solely responsible for maintaining the confidentiality of your account credentials, One-Time Password (OTP) verification codes, and active session tokens.",
            "MoneFin will never contact you via private message, phone, or unofficial email requesting your password, banking PIN, or OTP codes.",
            "To safeguard your data against accidental or unauthorized sabotage, MoneFin mandates password re-authentication for critical destructive operations: you must re-verify your password when permanently deleting your profile. You can monitor and revoke active logins at any time in Security Settings."
          ]
        },
        {
          id: "split-bill",
          number: "05",
          title: "Split Bill Feature & Peer-to-Peer Settlement",
          paragraphs: [
            "MoneFin's Split Bill feature calculates bill allocations among friends (equal distribution, percentage shares, or exact itemized nominal amounts) along with applicable taxes and service fees.",
            "MoneFin does not act as an escrow custodian or payment gateway. MoneFin does not hold, deduct, or escrow user funds. Settlement statuses such as 'Settled' or 'Pending' are internal bookkeeping aids.",
            "Physical debt settlement and financial reimbursement are executed directly between participants via their chosen payment methods (bank transfer, e-wallet, or cash)."
          ]
        },
        {
          id: "ai-terms",
          number: "06",
          title: "AI Financial Assistant & Restricted Sensitive Inputs",
          callout: {
            type: "warning",
            title: "Never Submit Highly Sensitive Credentials",
            text: "You are strictly forbidden from entering ATM PINs, banking passwords, banking OTP codes, complete credit/debit card numbers, or CVV security codes into AI chats or memo fields."
          },
          paragraphs: [
            "MoneFin integrates cutting-edge large language models to assist you with intelligent transaction categorization and interactive financial Q&A.",
            "AI prompt processing is executed in private, isolated enterprise environments with strict zero data retention policies. Nevertheless, as defense-in-depth, you must never input confidential banking credentials or CVV numbers into the platform."
          ]
        },
        {
          id: "gamification",
          number: "07",
          title: "Gamification Features, Badges, XP, & Non-Monetary Nature",
          callout: {
            type: "important",
            title: "Virtual Experience Points Have Zero Cash Value",
            text: "All experience points (XP), achievement badges, and saving streaks are designed solely to encourage sound financial habits. They possess no fiat currency value, cannot be redeemed for cash, and cannot be transferred or traded."
          },
          paragraphs: [
            "MoneFin incorporates educational gamification elements that award XP and milestone badges when you consistently record transactions, achieve financial goals, or maintain spending within budget limits.",
            "Goal completion bonuses and badges are entirely virtual within the MoneFin platform. Users are strictly prohibited from exploiting bugs or tampering with payloads to artificially inflate points or badges."
          ]
        },
        {
          id: "intellectual-property",
          number: "08",
          title: "Intellectual Property Rights",
          paragraphs: [
            "All copyrights, trademarks, UI/UX designs, brand logos, software source code, database architectures, and analytical algorithms within MoneFin are the exclusive property of MoneFin.",
            "We grant you a revocable, non-exclusive, non-transferable, limited license to access and use MoneFin on your personal devices strictly in accordance with these Terms.",
            "You may not decompile, reverse-engineer, mirror, redistribute, conduct unauthorized automated API scraping, or produce derivative works without our prior written consent."
          ]
        },
        {
          id: "liability",
          number: "09",
          title: "Limitation of Liability & System Availability",
          paragraphs: [
            "MoneFin employs enterprise-grade infrastructure and ACID-compliant transaction mechanics to ensure data integrity and high availability. Nonetheless, the service is provided on an 'as is' and 'as available' basis.",
            "MoneFin disclaims liability for service interruptions arising from ISP outages, local device malware, user negligence in safeguarding credentials, or force majeure events beyond our reasonable control.",
            "MoneFin includes dedicated export capabilities so you can download and retain local backups of your financial records whenever you wish."
          ]
        },
        {
          id: "termination",
          number: "10",
          title: "Account Termination & Service Cessation",
          paragraphs: [
            "You hold the unconditional right to close and delete your account at any time via Profile Settings. Permanent account deletion irreversibly purges your profile, connected wallets, transactions, budgets, split bills, and session tokens from active production servers.",
            "MoneFin reserves the right to suspend or terminate accounts engaging in illicit conduct, cybersecurity attacks against our API infrastructure (such as IDOR tampering, SQL injection, or brute-force requests), or severe breaches of these Terms."
          ]
        },
        {
          id: "governing-law",
          number: "11",
          title: "Governing Law & Dispute Resolution",
          paragraphs: [
            "These Terms shall be governed by and construed in accordance with the laws of the Republic of Indonesia.",
            "Any disputes arising from these Terms shall initially be resolved amicably through good-faith consultation. If unresolved within 30 (thirty) calendar days, the dispute shall be submitted to the exclusive jurisdiction of the competent courts of the Republic of Indonesia.",
            "For formal legal inquiries or service notices, please contact us at legal@monefin.com."
          ]
        }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      subtitle: "Full compliance with Indonesia's Personal Data Protection Law (UU PDP No. 27/2022). Your financial confidentiality is non-negotiable.",
      badge: "UU PDP No. 27/2022 Compliant",
      version: "Version 2.4",
      updatedDate: "September 5, 2026",
      summaryPoints: [
        "MoneFin operates on a strict Zero Data Brokering standard: we NEVER sell, rent, or trade your financial transactions to third parties or advertising networks.",
        "AI processing is fully isolated: your prompts and transactions are NEVER used to train public third-party AI models.",
        "You possess complete Data Subject Rights under Indonesian law (access, export, rectification, and instantaneous permanent deletion of your data)."
      ],
      sections: [
        {
          id: "pdp-commitment",
          number: "01",
          title: "Privacy Commitment & Regulatory Framework (UU PDP)",
          paragraphs: [
            "At MoneFin, we view financial privacy as a fundamental individual right. This Privacy Policy is constructed under comprehensive compliance with Law of the Republic of Indonesia No. 27 of 2022 on Personal Data Protection ('UU PDP') and modern global data privacy standards.",
            "This policy outlines the categories of data we collect, our lawful bases for processing, the technical safeguards we enforce, and your enforceable rights as a Data Subject within MoneFin."
          ]
        },
        {
          id: "data-collected",
          number: "02",
          title: "Categories of Personal Data We Collect",
          paragraphs: [
            "We collect only data that is strictly proportionate and necessary to power your personal finance management:",
            "1. Account Identity Data: Full name or nickname, active email address, securely hashed password (using industry-standard adaptive cryptography), and profile avatar if voluntarily uploaded.",
            "2. User-Entered Financial Records: Custom account/wallet labels (e.g., 'BCA Savings', 'Jago Pocket', 'Cash Wallet'), recorded starting balances, income and expense entries, budget categories, monthly thresholds, savings goals, and split bill participant lists.",
            "3. Device & Security Telemetry: Anonymized IP addresses, browser User-Agent strings, operating system identifiers, and active login session timestamps used for multi-device management.",
            "4. AI Assistant Interaction Logs: Financial queries submitted to the MoneFin AI assistant, stored in an encrypted state bound exclusively to your user account."
          ]
        },
        {
          id: "zero-data-brokering",
          number: "03",
          title: "Zero Data Brokering Principle",
          callout: {
            type: "shield",
            title: "100% Data Integrity Guarantee",
            text: "MoneFin does not monetize user data via ad exchanges. Your financial balances and transactions belong solely to you, never to advertisers."
          },
          paragraphs: [
            "We make an unyielding commitment: MoneFin has never and will never sell, rent, lease, or distribute your personal financial records to advertising networks, commercial data brokers, or marketing syndicates.",
            "Our corporate revenue model is entirely independent of targeted advertising. We are funded strictly to engineer robust, private, and secure personal finance management tools."
          ]
        },
        {
          id: "purpose",
          number: "04",
          title: "Lawful Purposes of Data Processing",
          paragraphs: [
            "Pursuant to Article 20 of the UU PDP, MoneFin processes data under your explicit consent and for contract fulfillment, strictly to:",
            "• Aggregate, calculate, and present your cash flow, account balances, and net worth summaries.",
            "• Render comparative expense analytics, category breakdowns, and goal tracking charts.",
            "• Compute automated mathematical allocations for group split bills.",
            "• Dispatch transactional security One-Time Passwords (OTP) to your verified email.",
            "• Detect unauthorized login attempts and enable remote session termination.",
            "• Generate contextual AI analytics responses upon your active request."
          ]
        },
        {
          id: "ai-privacy",
          number: "05",
          title: "Isolated AI Processing & Zero Public Model Training",
          callout: {
            type: "important",
            title: "Strict AI Isolation",
            text: "Your prompts and financial queries are strictly shielded and NEVER utilized to train public large language models."
          },
          paragraphs: [
            "The AI Assistant in MoneFin operates via dedicated enterprise API channels bound by zero data retention agreements with upstream AI model providers.",
            "Your telemetry and queries are encrypted in transit via TLS 1.3 and processed instantaneously in ephemeral memory. Upstream providers are contractually prohibited from using MoneFin customer data to train or fine-tune public models."
          ]
        },
        {
          id: "storage-retention",
          number: "06",
          title: "Data Storage, Retention, & Cryptographic Protection",
          paragraphs: [
            "Data is hosted within cloud data centers maintaining ISO 27001 and SOC 2 certifications. All client-to-server traffic is shielded by Transport Layer Security (TLS 1.3 / HTTPS).",
            "Passwords are irreversibly hashed using Bcrypt/Argon2id algorithms with unique cryptographic salts. Sanctum session tokens are stored as cryptographic SHA-256 hashes in our database.",
            "Your financial data is retained for the lifespan of your account. When you delete your account, your profile, wallets, transactions, split bills, and session records are permanently and irrecoverably purged from production databases."
          ]
        },
        {
          id: "data-subject-rights",
          number: "07",
          title: "Your Rights as a Data Subject Under UU PDP",
          paragraphs: [
            "In compliance with Chapter IV of the Indonesian PDP Law, you enjoy the following enforceable rights, operable directly within the app:",
            "1. Right of Access & Data Portability: You may view all stored transaction history at any time and export your records into standard formats (CSV/Excel/PDF).",
            "2. Right to Rectification: You may update your display name, wallet labels, transaction entries, and category allocations at will.",
            "3. Right to Erasure ('Right to be Forgotten'): You hold the absolute right to permanently delete your account and all associated financial history via Profile Settings, validated with password re-confirmation.",
            "4. Right to Revocation: You may terminate active remote sessions on any other device with a single click.",
            "5. Right to Withdraw Consent: You may cease using the platform and request immediate closure of your account without penalty."
          ]
        },
        {
          id: "cookies-tokens",
          number: "08",
          title: "Cookie Policy & Session Token Architecture",
          paragraphs: [
            "MoneFin does not employ third-party cross-site advertising cookies.",
            "We utilize securely configured Sanctum authentication tokens bearing the 'mnf_' prefix to manage authorized session states.",
            "Browser local storage (localStorage) is reserved strictly for non-sensitive presentation preferences such as language (ID/EN) and the Balance Privacy toggle."
          ]
        },
        {
          id: "dpo-contact",
          number: "09",
          title: "Data Protection Officer (DPO) Contact",
          paragraphs: [
            "MoneFin has appointed dedicated data compliance personnel to oversee and guarantee alignment with personal data protection regulations.",
            "For inquiries, subject access requests, or regulatory questions, please contact our Data Protection Officer at:",
            "Email: privacy@monefin.com"
          ]
        }
      ]
    },
    security: {
      title: "Security Standards & System Architecture",
      subtitle: "Multi-layered Defense in Depth, row-level IDOR mitigation, cryptographic integrity, and continuous security audits.",
      badge: "Enterprise Grade Level A Security",
      version: "Version 2.4",
      updatedDate: "September 5, 2026",
      summaryPoints: [
        "100% Row-Level Isolation: All transaction, wallet, budget, and split bill endpoints are strictly validated against user ownership (IDOR Shield) at the database tier.",
        "Ledger & Concurrency Protection: Balance mutations are shielded by ACID database transactions and pessimistic row locking to prevent race condition anomalies.",
        "Hardened Auth & HTTP Response Headers: CSPRNG OTP generator (random_int), anti-email enumeration, 'mnf_' token prefix, and bank-grade headers (X-Frame-Options DENY, CSP, nosniff)."
      ],
      sections: [
        {
          id: "philosophy",
          number: "01",
          title: "Security Philosophy: Defense in Depth & Zero Trust",
          paragraphs: [
            "Security at MoneFin is an foundational architecture tenet rather than a superficial afterthought. We enforce Defense in Depth and Zero Trust principles across every layer of the tech stack.",
            "Every inbound API request traverses multiple verification boundaries: firewall scrubbing, security headers middleware, anti-abuse rate limits, cryptographic token verification, service-layer ownership authorization, and parameterized query execution."
          ]
        },
        {
          id: "idor-protection",
          number: "02",
          title: "IDOR Protection & Row-Level Authorization",
          callout: {
            type: "shield",
            title: "Data Ownership Verification (IDOR Shield)",
            text: "Every single resource (account, category, transaction, budget, split bill, goal) is strictly validated against the authenticated user ID. Cross-tenant access is unconditionally blocked."
          },
          paragraphs: [
            "Insecure Direct Object References (IDOR) represent one of the most critical vulnerabilities in modern web applications. MoneFin implements row-level ownership validation across all controller endpoints.",
            "In controllers including TransactionController, BudgetController, SplitBillController, IncomeSettingController, and CategoryController, every foreign key parameter (such as account_id, category_id, goal_id) is explicitly scoped to verify that the entity belongs to the authenticated user ID:",
            "This mechanism guarantees that User A can never inspect, alter, associate, or debit User B's accounts or categories, even if request parameter IDs are deliberately tampered with."
          ]
        },
        {
          id: "encryption-standards",
          number: "03",
          title: "Encryption Standards: In-Transit & At-Rest",
          paragraphs: [
            "MoneFin deploys robust cryptographic protocols to safeguard data in flight and on disk:",
            "• Encryption In-Transit: All network communications between client browsers and backend APIs require TLS 1.3 / HTTPS with ciphers supporting Perfect Forward Secrecy. Unencrypted HTTP requests are automatically upgraded. Internal AI provider HTTP calls enforce strict SSL certificate validation (verify = true).",
            "• Password Security At-Rest: Passwords are never stored in cleartext. We employ industry-standard adaptive hashing algorithms (Bcrypt/Argon2id) with unique cryptographic salts to resist brute-force and rainbow table attacks.",
            "• Token Hashing: Sanctum authentication tokens stored in our database are maintained as SHA-256 cryptographic hashes; raw tokens are revealed only once upon initial issuance."
          ]
        },
        {
          id: "ledger-integrity",
          number: "04",
          title: "Ledger Integrity & Pessimistic Concurrency Locking",
          paragraphs: [
            "In financial software, balance mutation consistency is paramount. Unsynchronized simultaneous operations can produce race condition anomalies.",
            "MoneFin wraps balance updates in ACID-compliant Database Transactions.",
            "We employ Pessimistic Row Locking (SELECT ... FOR UPDATE) on target account records prior to computing credits or debits. This guarantees that concurrent transactions, scheduled recurring batch jobs, and split bill settlements execute sequentially without double-spending or balance desynchronization."
          ]
        },
        {
          id: "auth-hardening",
          number: "05",
          title: "Hardened Authentication, CSPRNG, & Anti-Brute Force",
          paragraphs: [
            "MoneFin's authentication architecture incorporates enterprise-grade hardening:",
            "1. CSPRNG OTP Generation: 6-digit One-Time Passwords are generated using a true Cryptographically Secure Pseudo-Random Number Generator (random_int()), eliminating the predictability of legacy pseudo-random algorithms (rand()).",
            "2. Anti-Email Enumeration: Password recovery and OTP resend endpoints return uniform HTTP 200 responses with the generic message: 'If the email exists, an OTP code will be dispatched.' This prevents malicious actors from harvesting registered email directories.",
            "3. Tiered Rate Limiting: Authentication routes (/api/auth/*) enforce strict per-IP and per-identity throttling to defeat automated credential stuffing and dictionary attacks.",
            "4. Sanctum Token Prefix 'mnf_': Access tokens are prefixed with 'mnf_', enabling automated code scanning tools (such as GitHub Secret Scanning) to immediately detect leaked tokens in developer environments."
          ]
        },
        {
          id: "security-headers",
          number: "06",
          title: "Bank-Grade Security Response Headers",
          callout: {
            type: "shield",
            title: "Browser-Level Defense Headers",
            text: "SecurityHeaders middleware is active across all API responses to prevent UI redressing, clickjacking, and MIME-sniffing."
          },
          paragraphs: [
            "Every HTTP response from MoneFin's backend is armed with comprehensive security headers:",
            "• X-Frame-Options: DENY — Prevents clickjacking by forbidding embedding into external <iframe> elements.",
            "• X-Content-Type-Options: nosniff — Stops browsers from guessing MIME types, preventing executable payload attacks.",
            "• X-XSS-Protection: 1; mode=block — Enforces browser-native Cross-Site Scripting blocks.",
            "• Referrer-Policy: strict-origin-when-cross-origin — Prevents internal path leaks when navigating offsite.",
            "• Permissions-Policy: geolocation=(), microphone=(), camera=() — Disables superfluous hardware APIs.",
            "• Content-Security-Policy (CSP): default-src 'none'; frame-ancestors 'none' — Restricts script origins (with intelligent exemptions for AI streaming Server-Sent Events)."
          ]
        },
        {
          id: "session-management",
          number: "07",
          title: "Active Multi-Device Sessions & Remote Revocation",
          paragraphs: [
            "MoneFin grants you granular control over active login sessions. From the Security Settings dashboard, you can view:",
            "• All connected devices and browser user agents associated with your account.",
            "• Timestamps of recent activity and originating IP addresses.",
            "• The 'Revoke Other Sessions' button, allowing instant termination of foreign sessions with a single click if a device is misplaced or compromised."
          ]
        },
        {
          id: "reauthentication",
          number: "08",
          title: "Mandatory Re-Authentication for Destructive Operations",
          paragraphs: [
            "To guard against unauthorized tampering when a device is left unattended, MoneFin mandates explicit password re-authentication for high-risk operations.",
            "For example, permanent account deletion (DELETE /api/auth/profile) cannot be authorized with a bearer token alone. The request payload must supply the current password, which is cryptographically verified by the server prior to data purge."
          ]
        },
        {
          id: "responsible-disclosure",
          number: "09",
          title: "Responsible Vulnerability Disclosure Program",
          paragraphs: [
            "We warmly welcome collaboration with ethical security researchers to help keep MoneFin's ecosystem resilient.",
            "If you discover a potential vulnerability or security gap in MoneFin, please report it responsibly to our dedicated team:",
            "Security Team Email: security@monefin.com",
            "Our commitment: We verify reports within 1 business day, commit to zero legal action against researchers acting in good faith, and honor your contribution in our Security Hall of Fame."
          ]
        }
      ]
    }
  }
};
