// Data and copy for MoneFin Legal & Trust Center Pages (Terms, Privacy, Security) — v3.0.0
// Aligned with Pedoman Penyusunan Dokumen Legal & Keamanan MoneFin:
// UU PDP No. 27/2022, UU Perlindungan Konsumen No. 8/1999, UU ITE & PP 71/2019,
// GDPR (global benchmark), ISO/IEC 27001/27002/27701/29147, NIST SP 800-63B, OWASP ASVS/Top 10, RFC 9116.

import { COMPLIANCE_FACTS } from "../lib/compliance-facts";

export const legalData = {
  id: {
    common: {
      back: "Kembali",
      lastUpdated: "Terakhir Diperbarui",
      effectiveDate: `Berlaku Efektif: ${COMPLIANCE_FACTS.effectiveDate.id}`,
      jurisdiction: "Yurisdiksi: Republik Indonesia",
      owner: COMPLIANCE_FACTS.documentOwner.id,
      reviewCycle: COMPLIANCE_FACTS.reviewCycle.id,
      languageNotice: COMPLIANCE_FACTS.governingLanguageNotice.id,
      tableOfContents: "Daftar Isi",
      quickSummaryTitle: "Ringkasan Cepat (5 Poin Utama)",
      copyLink: "Salin Tautan Halaman",
      linkCopied: "Tautan berhasil disalin ke clipboard!",
      print: "Cetak / Simpan PDF",
      contactTitle: "Saluran Kontak Resmi MoneFin",
      contactDesc: "Hubungi tim khusus kami sesuai kebutuhan Anda. Kami berupaya merespons setiap permohonan dalam batas waktu layanan (SLA) berikut:",
      otherDocuments: "Dokumen Kepatuhan Terkait",
      readNext: "Lanjutkan membaca",
      feedbackTitle: "Apakah dokumen ini mudah dipahami?",
      feedbackDesc: "Kami menyusun dokumen ini dengan kalimat yang lugas, terukur, dan tanpa klaim berlebihan.",
      changelogTitle: "Riwayat Perubahan Dokumen (Changelog Publik)",
      tabs: {
        terms: "Syarat & Ketentuan",
        privacy: "Kebijakan Privasi",
        security: "Standar Keamanan",
      },
    },

    // =========================================================================
    // E. SYARAT & KETENTUAN (18 Bagian Wajib)
    // =========================================================================
    terms: {
      title: "Syarat & Ketentuan Penggunaan Layanan",
      subtitle:
        "Ketentuan hukum yang mengatur hak dan kewajiban antara Pengguna dan MoneFin dalam penggunaan aplikasi pencatatan keuangan pribadi, anggaran 50/30/20, Split Bill, dan fitur AI BYOK.",
      badge: "Perjanjian Layanan Digital",
      version: COMPLIANCE_FACTS.versionLabel.id,
      effectiveDate: COMPLIANCE_FACTS.effectiveDate.id,
      updatedDate: COMPLIANCE_FACTS.updatedDate.id,
      owner: COMPLIANCE_FACTS.documentOwner.id,
      contactRole: COMPLIANCE_FACTS.contacts.legal,
      summaryPoints: [
        "MoneFin adalah perangkat lunak pencatatan keuangan pribadi mandiri; kami bukan bank, bukan penasihat keuangan berlisensi, bukan penyelenggara transfer dana, dan tidak memegang saldo rekening penampungan (escrow).",
        "Pengguna harus berusia minimal 18 tahun (atau telah menikah/cakap hukum), atau memperoleh persetujuan orang tua/wali sah sesuai Pasal 25 UU PDP No. 27/2022.",
        "Fitur Split Bill hanya mencatat pembagian tagihan secara administratif, fitur AI (BYOK) bersifat informatif dan akurasinya wajib diverifikasi pengguna, serta poin gamifikasi (XP/lencana) tidak memiliki nilai uang.",
        "Pengujian keamanan beriktikad baik yang mematuhi kebijakan Pengungkapan Kerentanan Terkoordinasi (ISO/IEC 29147) dilindungi oleh pengecualian Safe Harbor.",
        "Batasan tanggung jawab disusun proporsional sesuai UU Perlindungan Konsumen No. 8/1999; pengguna berhak mengekspor data (CSV) dan mengajukan banding jika terjadi penangguhan akun.",
      ],
      sections: [
        {
          id: "scope",
          number: "01",
          title: "Para Pihak, Penerimaan, & Cara Persetujuan",
          paragraphs: [
            "Syarat dan Ketentuan Layanan ini ('Ketentuan') merupakan perjanjian yang sah antara Anda sebagai pengguna individu ('Pengguna' atau 'Anda') dan penyelenggara platform MoneFin ('MoneFin' atau 'Kami').",
            "Persetujuan terhadap Ketentuan ini dan Kebijakan Privasi diberikan secara sadar melalui pencentangan kotak persetujuan (checkbox) terpisah yang tidak dicentang secara bawaan (unchecked by default) pada saat pendaftaran akun, atau saat Anda mengautentikasi akun melalui layanan masuk tunggal (Google OAuth 2.0).",
            "Persetujuan untuk fitur opsional tambahan—seperti aktivasi Asisten AI berbasis Bring Your Own Key (BYOK) atau penyimpanan lampiran foto struk—diberikan secara terpisah ketika Anda mengaktifkan fitur tersebut di dalam aplikasi. Apabila Anda tidak menyetujui Ketentuan ini, mohon untuk tidak melanjutkan pendaftaran atau penggunaan Layanan.",
          ],
        },
        {
          id: "definitions",
          number: "02",
          title: "Definisi Istilah Utama",
          paragraphs: [
            "1. Layanan: Aplikasi web dan perangkat bergerak (mobile APK/PWA) MoneFin beserta seluruh fitur pencatatan keuangan yang disediakan di dalamnya.",
            "2. Data Keuangan Pribadi: Catatan nominal saldo, pemasukan, pengeluaran, anggaran, target tabungan, dan pembagian tagihan yang dimasukkan secara mandiri oleh Pengguna ke dalam Layanan.",
            "3. Fitur AI BYOK (Bring Your Own Key): Fitur opsional tanya-jawab asisten keuangan dan pemindaian struk belanja (OCR/Vision) yang berjalan menggunakan kunci API milik Pengguna sendiri pada penyedia model bahasa pihak ketiga.",
            "4. Split Bill: Fitur kalkulasi administratif untuk menghitung pembagian tagihan bersama antar-individu tanpa pemindahan dana riil.",
            "5. Subjek Data: Individu pemilik data pribadi sebagaimana dimaksud dalam Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi ('UU PDP').",
          ],
        },
        {
          id: "service-description",
          number: "03",
          title: "Deskripsi Layanan & Batasan Tegas",
          callout: {
            type: "important",
            title: "Bukan Lembaga Perbankan, Penasihat Keuangan, atau Escrow",
            text: "MoneFin adalah perangkat lunak pencatatan administratif. Kami tidak menghimpun dana masyarakat, tidak terhubung langsung untuk mendebit rekening bank Anda, tidak memindahkan dana, dan tidak memberikan nasihat investasi, pajak, atau hukum berlisensi.",
          },
          paragraphs: [
            "MoneFin dirancang untuk membantu Pengguna mencatat pemasukan dan pengeluaran harian, mengelompokkan anggaran (termasuk metode 50/30/20), memantau target tabungan (sinking funds), menghitung pembagian tagihan (Split Bill), dan melihat ringkasan grafik keuangan.",
            "Seluruh angka saldo yang tampil di MoneFin adalah catatan pembukuan mandiri berdasarkan data yang Anda masukkan, bukan saldo rekening bank waktu nyata (real-time bank ledger). Setiap keputusan finansial, investasi, atau perpajakan yang Anda ambil sepenuhnya menjadi tanggung jawab pribadi Anda.",
          ],
        },
        {
          id: "eligibility",
          number: "04",
          title: "Kelayakan Pengguna: Batas Usia & Kecakapan Hukum",
          paragraphs: [
            "Untuk membuat akun dan mengikatkan diri pada Ketentuan ini secara mandiri, Anda harus berusia minimal 18 (delapan belas) tahun atau telah menikah dan memiliki kecakapan hukum penuh menurut hukum Republik Indonesia (Kitab Undang-Undang Hukum Perdata dan UU PDP No. 27/2022).",
            "Apabila Anda berusia di bawah 18 tahun, penggunaan Layanan hanya diperkenankan dengan persetujuan eksplisit dan pengawasan langsung dari orang tua atau wali sah Anda sesuai Pasal 25 UU PDP. Wali sah bertanggung jawab atas seluruh aktivitas akun yang dilakukan oleh pengguna di bawah umur tersebut.",
            "Setiap akun diperuntukkan bagi satu pengguna individu. Anda tidak diperkenankan menjual, menyewakan, atau memindahtangankan akun Anda kepada pihak lain.",
          ],
        },
        {
          id: "credentials-responsibility",
          number: "05",
          title: "Akun & Keamanan Kredensial (Tanggung Jawab Bersama)",
          paragraphs: [
            "Keamanan akun berjalan di atas prinsip tanggung jawab bersama (shared responsibility) antara MoneFin dan Pengguna:",
            "• Kewajiban MoneFin: Kami menerapkan hashing kata sandi satu arah menggunakan algoritma Bcrypt, menyimpan token sesi dalam bentuk hash SHA-256, menyediakan fitur pemantauan serta pencabutan sesi perangkat aktif, dan mewajibkan verifikasi ulang kata sandi (re-autentikasi) untuk tindakan berisiko tinggi seperti penghapusan akun permanen.",
            "• Kewajiban Pengguna: Anda wajib menggunakan kata sandi yang kuat (minimal 8 karakter), menjaga kerahasiaan kode One-Time Password (OTP) dan kunci API BYOK Anda, serta segera mencabut sesi perangkat di menu Pengaturan Keamanan atau menghubungi kami di security@monefin.web.id apabila mencurigai adanya akses tanpa izin.",
            "Petugas MoneFin tidak pernah meminta kata sandi akun, kode OTP, PIN perbankan, atau kode CVV kartu Anda melalui saluran komunikasi mana pun.",
          ],
        },
        {
          id: "prohibited-use",
          number: "06",
          title: "Penggunaan yang Dilarang & Pengecualian Safe Harbor",
          callout: {
            type: "shield",
            title: "Pengecualian Safe Harbor untuk Peneliti Keamanan",
            text: "Pengujian keamanan beriktikad baik yang dilakukan sesuai batas ruang lingkup dan aturan pada Kebijakan Pengungkapan Kerentanan Terkoordinasi (/security#vulnerability-disclosure dan /.well-known/security.txt) diizinkan dan tidak dianggap sebagai pelanggaran Ketentuan ini.",
          },
          paragraphs: [
            "Selama menggunakan Layanan, Anda dilarang melakukan tindakan berikut:",
            "1. Mengambil data secara otomatis (automated scraping/crawling) atau membebani infrastruktur secara tidak wajar (Denial of Service / spam request) di luar penggunaan aplikasi normal.",
            "2. Merekayasa balik (reverse engineer), mendekompilasi, atau mencoba mengakses data milik pengguna lain tanpa hak.",
            "3. Memanipulasi parameter permintaan API untuk mengubah perolehan poin pengalaman (XP), lencana gamifikasi, atau kuota sistem secara tidak sah.",
            "4. Menggunakan Layanan untuk mencatat, menyembunyikan, atau memfasilitasi tindak pidana pencucian uang, pendanaan ilegal, atau penipuan.",
            "Pengecualian Pengungkapan Kerentanan (Safe Harbor): Larangan pengujian teknis di atas dikecualikan bagi peneliti keamanan independen yang melakukan pengujian secara beriktikad baik, tidak mengakses atau mengubah data milik pengguna lain, tidak mengganggu ketersediaan layanan (DoS), dan segera melaporkan temuannya ke security@monefin.web.id sesuai pedoman di halaman Standar Keamanan.",
          ],
        },
        {
          id: "special-features",
          number: "07",
          title: "Ketentuan Fitur Khusus: Split Bill, AI (BYOK), & Gamifikasi",
          callout: {
            type: "warning",
            title: "Verifikasi Hasil AI & Jangan Masukkan Kredensial Perbankan",
            text: "Hasil pembacaan struk (OCR) dan jawaban AI Assistant dapat mengandung ketidakakuratan (halusinasi model). Selalu periksa kembali nominal sebelum menyimpan, dan jangan pernah memasukkan PIN ATM, password bank, nomor kartu lengkap, atau CVV ke kolom catatan maupun chat AI.",
          },
          paragraphs: [
            "• Fitur Split Bill (Catatan Administratif): Split Bill berfungsi menghitung pembagian tagihan grup beserta pajak/biaya layanan secara proporsional. Status 'Lunas' atau 'Belum Bayar' hanyalah penanda pembukuan pribadi. Penyelesaian pembayaran dilakukan secara mandiri oleh para peserta di luar platform MoneFin.",
            "• Fitur AI Assistant & Scan Struk (BYOK): Fitur AI bersifat opsional. Keluaran AI dihasilkan secara probabilistik oleh model bahasa pihak ketiga dan bukan merupakan nasihat keuangan atau pajak profesional. Anda wajib memeriksa kebenaran nominal, tanggal, dan item hasil pindaian struk sebelum menekan tombol konfirmasi.",
            "• Fitur Gamifikasi (Tanpa Nilai Uang): Poin pengalaman (XP), level, misi (quests), dan lencana pencapaian (badges) dirancang semata-mata sebagai sarana edukasi dan motivasi pencatatan keuangan. Seluruh atribut gamifikasi tidak memiliki nilai mata uang fiat, tidak dapat diuangkan, dan tidak dapat diperjualbelikan.",
          ],
        },
        {
          id: "user-content",
          number: "08",
          title: "Konten & Data Pengguna",
          paragraphs: [
            "Anda tetap memegang hak kepemilikan penuh atas seluruh Data Keuangan Pribadi, catatan transaksi, dan berkas gambar struk yang Anda unggah ke dalam akun MoneFin Anda.",
            "Dengan memasukkan data ke dalam Layanan, Anda memberikan lisensi terbatas, non-eksklusif, dapat ditarik kembali, dan bebas royalti kepada MoneFin semata-mata untuk menyimpan, mencadangkan, memproses secara komputasi, dan menampilkan kembali data tersebut kepada Anda sesuai fungsi Layanan yang Anda gunakan. Lisensi ini berakhir secara otomatis ketika Anda menghapus data atau menutup akun Anda, dengan tunduk pada masa pembersihan cadangan teknis (maksimal 30 hari kalender) sebagaimana dijelaskan dalam Kebijakan Privasi.",
          ],
        },
        {
          id: "intellectual-property",
          number: "09",
          title: "Hak Kekayaan Intelektual Platform",
          paragraphs: [
            "Seluruh perangkat lunak, kode sumber antarmuka, desain visual, logo, nama merek 'MoneFin', serta dokumentasi resmi pada platform ini dilindungi oleh undang-undang hak cipta dan kekayaan intelektual yang berlaku di Republik Indonesia.",
            "MoneFin memberikan Anda hak penggunaan pribadi, non-eksklusif, dan tidak dapat dipindahtangankan untuk mengakses Layanan sesuai Ketentuan ini. Penggunaan nama merek atau aset visual MoneFin untuk tujuan komersial pihak ketiga memerlukan izin tertulis sebelumnya dari kami.",
          ],
        },
        {
          id: "third-party-services",
          number: "10",
          title: "Layanan Pihak Ketiga",
          paragraphs: [
            "Layanan kami mengintegrasikan komponen opsional dari pihak ketiga atas pilihan Anda, seperti autentikasi Google OAuth 2.0 dan penyedia API model kecerdasan buatan melalui skema Bring Your Own Key (Google Gemini, Groq, OpenAI, Anthropic, atau OpenRouter).",
            "Saat Anda menggunakan integrasi pihak ketiga tersebut, ketersediaan API dan ketentuan pemrosesan di sisi penyedia tunduk pada syarat layanan masing-masing pihak ketiga. Rincian daftar sub-prosesor dan jaminan pelindungan datanya dapat dilihat secara transparan pada dokumen Kebijakan Privasi (/privacy#subprocessors).",
          ],
        },
        {
          id: "fees-pricing",
          number: "11",
          title: "Biaya Layanan & Kebijakan Perubahan Harga",
          paragraphs: [
            "Saat ini, seluruh fitur inti MoneFin disediakan secara gratis (Rp0) bagi pengguna individu tanpa tayangan iklan pihak ketiga.",
            "Catatan Penggunaan BYOK AI: Apabila Anda mengaktifkan fitur AI menggunakan kunci API milik Anda sendiri (BYOK), biaya kuota pemakaian token API (jika Anda menggunakan paket berbayar pada penyedia AI terkait) ditagihkan langsung oleh penyedia AI tersebut kepada Anda sesuai tarif mereka, bukan oleh MoneFin.",
            "Apabila di masa mendatang MoneFin memperkenalkan paket fitur tambahan berbayar (opsional), kami akan memberikan pemberitahuan minimal 30 (tiga puluh) hari kalender sebelumnya dan tidak akan pernah mengenakan biaya tanpa persetujuan pemesanan eksplisit dari Anda.",
          ],
        },
        {
          id: "availability-maintenance",
          number: "12",
          title: "Ketersediaan Layanan, Pemeliharaan, & Ekspor Mandiri",
          paragraphs: [
            "Kami berupaya menjaga agar Layanan dapat diakses secara stabil dan berkelanjutan. Namun, akses ke Layanan dapat mengalami jeda sementara sewaktu-waktu karena pemeliharaan terjadwal, pembaruan keamanan mendesak, atau gangguan jaringan pada penyedia infrastruktur hulu.",
            "Untuk pemeliharaan terencana yang berdampak pada penghentian akses sementara, kami berupaya memberikan pemberitahuan di muka melalui banner aplikasi. Kami juga menyediakan fitur Ekspor Data (format CSV) di halaman Transaksi dan Laporan agar Anda dapat menyimpan salinan cadangan lokal kapan saja.",
          ],
        },
        {
          id: "liability",
          number: "13",
          title: "Pernyataan Penyangkalan (Disclaimer) & Batasan Tanggung Jawab",
          paragraphs: [
            "MoneFin menerapkan kontrol keamanan teknis dan transaksi database berprinsip ACID sebagaimana dirinci dalam dokumen Standar Keamanan (/security). Meskipun demikian, perangkat lunak tidak dapat dijamin sepenuhnya bebas dari kemungkinan gangguan jaringan, keterlambatan sinkronisasi, atau ketidakakuratan pembacaan OCR/AI.",
            "Sejauh diizinkan oleh hukum yang berlaku, MoneFin tidak bertanggung jawab atas kerugian tidak langsung, hilangnya keuntungan investasi, atau kerugian yang timbul akibat: (a) keputusan finansial yang diambil Pengguna berdasarkan ringkasan analitik/AI, (b) kelalaian Pengguna dalam menjaga kerahasiaan kredensial login atau kunci API BYOK, atau (c) gangguan pada penyedia jaringan internet/API pihak ketiga di luar kendali wajar kami.",
            "Perlindungan Hak Wajib Konsumen (Pasal 18 UU No. 8 Tahun 1999): Tidak ada satu pun ketentuan dalam perjanjian ini yang ditujukan untuk mengecualikan, membatasi, atau menghapus tanggung jawab hukum MoneFin atas kerugian yang terbukti secara sah disebabkan oleh kesengajaan, kelalaian berat (gross negligence) MoneFin, atau kegagalan pelindungan data pribadi yang menjadi kewajiban hukum Pengendali Data berdasarkan UU PDP No. 27/2022.",
          ],
        },
        {
          id: "termination",
          number: "14",
          title: "Penangguhan, Penghentian Akun, Banding, & Akses Ekspor Data",
          paragraphs: [
            "• Penutupan Akun oleh Pengguna: Anda dapat menutup dan menghapus akun Anda secara permanen kapan saja melalui menu Pengaturan Profil dengan verifikasi kata sandi.",
            "• Penangguhan atau Penghentian oleh MoneFin: Kami dapat menangguhkan sementara atau menghentikan akses akun Anda apabila terdapat bukti yang terverifikasi bahwa akun tersebut: (a) digunakan untuk aktivitas pelanggaran hukum/penipuan, (b) melakukan serangan eksploitasi di luar cakupan Safe Harbor Pengungkapan Kerentanan, atau (c) melanggar ketentuan batas usia tanpa persetujuan wali.",
            "• Pemberitahuan, Ekspor Data, & Hak Banding: Kecuali dilarang oleh perintah penegak hukum atau dalam kondisi darurat serangan aktif yang membahayakan sistem, kami akan mengirimkan pemberitahuan alasan penangguhan ke email terdaftar Anda, memberikan kesempatan selama 14 (empat belas) hari kalender untuk mengunduh/mengekspor data catatan transaksi Anda (CSV), serta menyediakan jalur pengajuan klarifikasi/banding melalui email ke legal@monefin.web.id.",
          ],
        },
        {
          id: "amendments",
          number: "15",
          title: "Perubahan Syarat & Ketentuan",
          paragraphs: [
            "Kami meninjau Ketentuan ini secara berkala minimal setiap 6 (enam) bulan atau ketika terdapat perubahan fitur, sub-prosesor, maupun peraturan perundang-undangan yang berlaku.",
            "Apabila terdapat perubahan material yang memengaruhi hak atau kewajiban Anda, kami akan memberitahukan perubahan tersebut minimal 14 hingga 30 hari kalender sebelum tanggal berlaku efektif melalui email terdaftar dan pemberitahuan (banner) di dalam aplikasi. Apabila Anda tidak menyetujui perubahan material tersebut, Anda berhak mengekspor seluruh data Anda dan menutup akun sebelum tanggal berlaku baru tanpa dikenakan biaya atau penalti apa pun.",
          ],
        },
        {
          id: "governing-law",
          number: "16",
          title: "Hukum yang Berlaku & Penyelesaian Sengketa",
          paragraphs: [
            "Ketentuan ini diatur dan ditafsirkan berdasarkan hukum Negara Kesatuan Republik Indonesia, termasuk namun tidak terbatas pada UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi, UU No. 8 Tahun 1999 tentang Perlindungan Konsumen, dan UU Informasi dan Transaksi Elektronik beserta perubahannya.",
            "Setiap perselisihan yang timbul dari pelaksanaan Ketentuan ini akan diselesaikan terlebih dahulu secara musyawarah untuk mufakat dalam jangka waktu 30 (tiga puluh) hari kalender sejak pemberitahuan tertulis diterima salah satu pihak.",
            "Apabila musyawarah tidak mencapai kesepakatan, para pihak dapat menempuh mediasi atau mengajukan penyelesaian sengketa melalui Pengadilan Negeri Bandung, dengan tetap menghormati hak konsumen untuk mengajukan gugatan melalui badan penyelesaian sengketa konsumen atau pengadilan negeri di tempat kedudukan konsumen sesuai Pasal 23 dan Pasal 45 UU No. 8 Tahun 1999 tentang Perlindungan Konsumen.",
          ],
        },
        {
          id: "general-provisions",
          number: "17",
          title: "Ketentuan Umum: Keterpisahan, Force Majeure, & Bahasa",
          paragraphs: [
            "• Keterpisahan (Severability): Apabila terdapat satu atau lebih pasal dalam Ketentuan ini yang dinyatakan batal atau tidak dapat dilaksanakan oleh pengadilan atau peraturan perundang-undangan, maka pasal-pasal lainnya tetap berlaku penuh dan mengikat.",
            "• Keseluruhan Perjanjian & Pengalihan: Ketentuan ini bersama Kebijakan Privasi dan Standar Keamanan merupakan keseluruhan perjanjian layanan antara Anda dan MoneFin. Anda tidak dapat mengalihkan hak akun Anda tanpa izin kami; MoneFin hanya dapat mengalihkan perjanjian ini dalam rangka restrukturisasi badan usaha dengan pemberitahuan terlebih dahulu kepada Pengguna dan jaminan bahwa tingkat pelindungan data tidak berkurang.",
            "• Keadaan Kahar (Force Majeure): Tidak ada pihak yang dianggap wanprestasi atas keterlambatan pelaksanaan kewajiban yang disebabkan langsung oleh bencana alam, pemadaman tulang punggung internet nasional, perang, atau perubahan regulasi pemerintah yang berada di luar kendali wajar.",
            "• Bahasa yang Mengikat: Sesuai Undang-Undang Nomor 24 Tahun 2009, Ketentuan ini disusun dalam Bahasa Indonesia dan Bahasa Inggris. Apabila terdapat perbedaan penafsiran antara kedua versi bahasa tersebut, maka teks Bahasa Indonesia yang berlaku dan mengikat secara hukum.",
          ],
        },
        {
          id: "contact-changelog",
          number: "18",
          title: "Kontak Resmi & Riwayat Perubahan Dokumen",
          paragraphs: [
            "Untuk pertanyaan hukum, penafsiran klausul, atau pengajuan banding akun, silakan hubungi kami melalui saluran resmi terpisah berikut:",
            `• Hukum & Syarat Ketentuan: ${COMPLIANCE_FACTS.contacts.legal.email} (${COMPLIANCE_FACTS.contacts.legal.sla.id})`,
            `• Privasi & Hak Subjek Data (DPO): ${COMPLIANCE_FACTS.contacts.privacy.email} (${COMPLIANCE_FACTS.contacts.privacy.sla.id})`,
            `• Pelaporan Kerentanan Keamanan: ${COMPLIANCE_FACTS.contacts.security.email} (${COMPLIANCE_FACTS.contacts.security.sla.id})`,
            `• Bantuan Pengguna Umum: ${COMPLIANCE_FACTS.contacts.support.email} (${COMPLIANCE_FACTS.contacts.support.sla.id})`,
          ],
        },
      ],
    },

    // =========================================================================
    // D. KEBIJAKAN PRIVASI (15 Bagian Wajib)
    // =========================================================================
    privacy: {
      title: "Kebijakan Privasi & Pelindungan Data Pribadi",
      subtitle:
        "Penjelasan transparan mengenai bagaimana MoneFin mengumpulkan, memproses, menyimpan, dan melindungi data pribadi Anda sesuai UU PDP No. 27 Tahun 2022.",
      badge: "Kepatuhan UU PDP No. 27/2022",
      version: COMPLIANCE_FACTS.versionLabel.id,
      effectiveDate: COMPLIANCE_FACTS.effectiveDate.id,
      updatedDate: COMPLIANCE_FACTS.updatedDate.id,
      owner: COMPLIANCE_FACTS.documentOwner.id,
      contactRole: COMPLIANCE_FACTS.contacts.privacy,
      summaryPoints: [
        "Kami tidak menjual, menyewakan, atau memperdagangkan data pribadi maupun catatan keuangan Anda kepada pengiklan atau pialang data (data broker).",
        "Data keuangan pribadi diperlakukan sebagai Data Pribadi Spesifik sesuai Pasal 4 ayat (2) UU PDP No. 27/2022 dengan prinsip minimisasi data.",
        "Alamat IP perangkat dicatat secara utuh pada sesi aktif semata-mata untuk fitur keamanan Manajemen Sesi dan pencegahan penyalahgunaan, serta dihapus saat sesi dicabut atau maksimal 30 hari di log.",
        "Riwayat percakapan (chat) AI Assistant tidak disimpan di basis data MoneFin (0 hari); pemrosesan pada penyedia AI pihak ketiga mengikuti kebijakan kunci API BYOK yang Anda gunakan.",
        "Saat Anda menghapus akun, data dihapus segera dari basis data produksi aktif dan terhapus otomatis dari cadangan terenkripsi (backup) dalam maksimal 30 hari kalender.",
      ],
      sections: [
        {
          id: "controller-identity",
          number: "01",
          title: "Identitas Pengendali Data & Ruang Lingkup",
          callout: {
            type: "important",
            title: "Perlakuan Khusus Data Keuangan Pribadi (UU PDP Pasal 4 ayat (2))",
            text: "Berdasarkan Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP), data keuangan pribadi termasuk dalam kategori Data Pribadi Spesifik. Oleh karena itu, MoneFin menerapkan pembatasan akses ketat, enkripsi, dan prinsip minimisasi data.",
          },
          paragraphs: [
            "Kebijakan Privasi ini menjelaskan praktik pelindungan data pribadi yang dijalankan oleh MoneFin ('Kami') selaku Pengendali Data Pribadi atas layanan aplikasi manajemen keuangan pribadi MoneFin yang beroperasi di wilayah hukum Republik Indonesia.",
            "Kebijakan ini disusun dengan mengacu pada Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi ('UU PDP'), peraturan pelaksananya, serta menggunakan General Data Protection Regulation (GDPR) dan kerangka ISO/IEC 27701 / ISO/IEC 29100 sebagai panduan tata kelola privasi internal (bukan klaim sertifikasi pihak ketiga).",
            `Identitas & Kontak Pengendali Data: Pengelola Platform MoneFin (Domisili Operasional: Bandung, Jawa Barat, Republik Indonesia). Email Pejabat/Tim Pelindungan Data Pribadi (DPO): ${COMPLIANCE_FACTS.contacts.privacy.email}.`,
          ],
        },
        {
          id: "data-collected",
          number: "02",
          title: "Data yang Dikumpulkan, Tujuan, Dasar Pemrosesan, & Retensi",
          paragraphs: [
            "Kami menerapkan prinsip minimisasi data: kami hanya mengumpulkan data pribadi yang memiliki tujuan pemrosesan yang jelas untuk menjalankan fungsi aplikasi yang Anda gunakan. Kami tidak meminta nomor rekening bank lengkap, PIN ATM, password internet banking, atau nomor CVV kartu Anda.",
            "Tabel di bawah ini merinci setiap kategori data pribadi yang kami kumpulkan beserta tujuan, dasar hukum pemrosesan menurut Pasal 20 UU PDP, dan masa retensinya:",
          ],
        },
        {
          id: "data-sources",
          number: "03",
          title: "Sumber Pengumpulan Data Pribadi",
          paragraphs: [
            "Data pribadi yang kami proses diperoleh dari tiga sumber berikut:",
            "1. Diberikan Langsung oleh Pengguna: Nama, alamat email, kata sandi, catatan transaksi, saldo rekening/dompet, kategori anggaran, target tabungan, peserta split bill, kunci API BYOK, dan foto struk belanja yang Anda unggah secara sukarela.",
            "2. Dikumpulkan Secara Otomatis untuk Keamanan Sesi: Ketika Anda mengakses Layanan, sistem mencatat alamat IP perangkat secara utuh (tidak dianonimkan), informasi peramban dan sistem operasi (User-Agent), serta waktu aktivitas terakhir. Berbeda dengan klaim penyamaran penuh, alamat IP utuh ini diperlukan dan ditampilkan langsung kepada Anda pada halaman Pengaturan Keamanan agar Anda dapat mengenali perangkat yang sedang login dan mencabut sesi yang mencurigakan.",
            "3. Sumber Pihak Ketiga Atas Instruksi Pengguna: Apabila Anda memilih masuk menggunakan tombol 'Masuk dengan Google' (Google OAuth 2.0), kami menerima nama profil, alamat email terverifikasi, dan URL foto profil dari Google LLC sesuai izin yang Anda berikan.",
          ],
        },
        {
          id: "lawful-basis",
          number: "04",
          title: "Dasar Hukum Pemrosesan & Cara Menarik Persetujuan",
          paragraphs: [
            "Sesuai Pasal 20 UU PDP, kami memproses data pribadi Anda berdasarkan dasar hukum berikut:",
            "• Persetujuan Eksplisit yang Sah (Pasal 20 ayat (2) huruf a): Digunakan untuk pemrosesan data keuangan pribadi yang Anda masukkan, kolom profil opsional, serta fitur opsional yang memerlukan persetujuan terpisah (seperti aktivasi AI Assistant BYOK dan pemindaian foto struk). Kotak persetujuan tidak pernah dicentang secara otomatis.",
            "• Pemenuhan Kewajiban Perjanjian Layanan (Pasal 20 ayat (2) huruf b): Digunakan untuk mengelola akun, autentikasi login, pengiriman email OTP verifikasi, dan sinkronisasi preferensi mata uang/bahasa.",
            "• Kepentingan Sah yang Terukur (Pasal 20 ayat (2) huruf f): Digunakan secara terbatas untuk keamanan jaringan, pembatasan laju permintaan (rate limiting anti-brute force), dan pencatatan sesi aktif guna melindungi akun Anda dari pengambilalihan.",
            "Cara Menarik Persetujuan: Anda dapat menarik persetujuan untuk fitur opsional kapan saja (misalnya dengan mematikan toggle AI Assistant atau menghapus kunci API BYOK di menu Pengaturan). Untuk menarik persetujuan pemrosesan layanan inti, Anda dapat mengekspor data Anda lalu menghapus akun secara mandiri di Pengaturan Profil atau mengirim permintaan ke privacy@monefin.web.id.",
          ],
        },
        {
          id: "subprocessors",
          number: "05",
          title: "Pembagian Data & Daftar Pemroses / Sub-Prosesor",
          callout: {
            type: "shield",
            title: "Komitmen Tidak Menjual Data Pribadi",
            text: "Kami tidak menjual, menyewakan, atau memperdagangkan data pribadi maupun riwayat transaksi keuangan Anda kepada pialang data (data broker) atau jaringan periklanan pihak ketiga.",
          },
          paragraphs: [
            "Untuk menjalankan infrastruktur aplikasi, kami bekerja sama dengan penyedia layanan infrastruktur (Pemroses Data / Sub-Prosesor) yang memproses data semata-mata atas instruksi teknis kami atau instruksi langsung Anda. Daftar sub-prosesor kami beserta lokasi dan tujuannya tercantum pada tabel berikut:",
          ],
        },
        {
          id: "cross-border-transfer",
          number: "06",
          title: "Transfer Data Pribadi Lintas Negara & Jaminannya",
          paragraphs: [
            "Sebagian sub-prosesor infrastruktur kami (seperti jaringan pengiriman konten web Vercel, layanan pengiriman email transaksional OTP, Google OAuth, atau penyedia API AI yang Anda pilih melalui BYOK) mengoperasikan server di luar wilayah Republik Indonesia (seperti Singapura, Amerika Serikat, atau Uni Eropa).",
            "Sesuai Pasal 56 UU PDP No. 27/2022, transfer data lintas negara tersebut dilakukan berdasarkan pelaksanaan kontrak layanan dan/atau persetujuan eksplisit Anda saat mengaktifkan fitur terkait, serta dilindungi dengan langkah pengamanan teknis berupa enkripsi jalur komunikasi TLS 1.2+/1.3, pembatasan muatan data seminimal mungkin (data minimization), dan enkripsi kunci API.",
          ],
        },
        {
          id: "ai-privacy",
          number: "07",
          title: "Pemrosesan Kecerdasan Buatan (AI Assistant & Scan Struk BYOK)",
          callout: {
            type: "important",
            title: "Pemisahan Penyimpanan: MoneFin vs. Penyedia AI (BYOK)",
            text: "MoneFin tidak menyimpan riwayat percakapan (chat) AI Anda di dalam basis data MoneFin. Ketika Anda mengirimkan pertanyaan atau foto struk, data tersebut dikirimkan ke penyedia model AI sesuai kunci API (BYOK) yang Anda konfigurasikan.",
          },
          paragraphs: [
            "Agar tidak menimbulkan ambiguitas, berikut adalah pemisahan tegas antara apa yang diproses oleh MoneFin dan apa yang diproses oleh penyedia model AI pihak ketiga:",
            "1. Apa yang Disimpan dan Diproses oleh MoneFin: (a) Kunci API BYOK yang Anda masukkan dienkripsi menggunakan AES-256-CBC sebelum disimpan di profil akun Anda; (b) Riwayat percakapan (chat) dengan AI Assistant TIDAK disimpan di basis data MoneFin (retensi 0 hari di server kami)—riwayat hingga 20 pesan terakhir hanya dipegang sementara di memori peramban Anda selama tab terbuka; (c) Untuk fitur Scan Struk, foto struk diproses di memori untuk diekstraksi dan tidak disimpan di server kami kecuali Anda secara sadar mengaktifkan opsi 'Simpan Foto Struk' saat mengonfirmasi transaksi.",
            "2. Data yang Dikirim ke Penyedia AI Pilihan Anda: Saat Anda mengirim pesan ke AI Assistant, backend kami mengirimkan teks pertanyaan Anda beserta ringkasan konteks agregat keuangan akun Anda (total saldo, ringkasan anggaran, dan daftar transaksi relevan tanpa kata sandi/email) ke endpoint penyedia AI yang Anda pilih (Google Gemini, Groq, OpenAI, Anthropic, atau OpenRouter).",
            "3. Apakah Data Dipakai untuk Pelatihan Model oleh Penyedia AI? Karena MoneFin menggunakan arsitektur Bring Your Own Key (BYOK), kebijakan penyimpanan log dan penggunaan data untuk pelatihan model pada penyedia AI mengikuti jenis akun kunci API milik Anda sendiri. Umumnya, kunci API berbayar (Paid/Enterprise API Tier) pada Google Gemini, OpenAI, Anthropic, dan Groq menerapkan kebijakan tidak menggunakan data API untuk melatih model publik (Zero Data Training), sedangkan kunci API gratis (Free Tier, seperti Google AI Studio Free Tier) dapat ditinjau oleh penyedia tersebut sesuai syarat layanan mereka. Kami menyarankan Anda menggunakan Paid API Tier jika menginginkan jaminan tanpa pelatihan dari penyedia AI Anda.",
          ],
        },
        {
          id: "storage-retention",
          number: "08",
          title: "Masa Retensi & Prosedur Penghapusan Data",
          paragraphs: [
            "Kami menyimpan data pribadi Anda hanya selama diperlukan untuk memenuhi tujuan pengumpulannya:",
            "• Sistem Produksi Aktif: Data profil dan catatan keuangan disimpan selama akun Anda berstatus aktif. Apabila Anda menghapus transaksi/rekening, item tersebut berpindah ke fitur Trashbin (Tempat Sampah) agar dapat dipulihkan jika tidak sengaja terhapus, dan dapat Anda hapus permanen (Force Delete) kapan saja.",
            "• Penghapusan Akun Permanen: Saat Anda menghapus akun melalui menu Pengaturan Profil (dengan konfirmasi kata sandi), seluruh data profil, rekening, transaksi, anggaran, target tabungan, split bill, dan token sesi dihapus segera dari basis data produksi aktif kami.",
            `• Cadangan (Backup) & Log Sistem: Salinan data yang masih tersimpan di dalam arsip cadangan basis data terenkripsi (encrypted daily backups) dan log keamanan server akan terhapus serta tertimpa secara otomatis dalam siklus rotasi maksimal ${COMPLIANCE_FACTS.backupRetentionDays} (tiga puluh) hari kalender.`,
          ],
        },
        {
          id: "security-reference",
          number: "09",
          title: "Keamanan Data Pribadi",
          paragraphs: [
            "Kami melindungi data pribadi Anda menggunakan kontrol keamanan berlapis yang mencakup enkripsi jalur komunikasi TLS 1.2+/1.3 (HTTPS), hashing kata sandi menggunakan Bcrypt, hashing token sesi menggunakan SHA-256, enkripsi kunci API BYOK menggunakan AES-256-CBC, serta validasi otorisasi kepemilikan baris pada setiap permintaan API.",
            "Untuk menjaga konsistensi dan menghindari duplikasi teknis, penjelasan lengkap mengenai arsitektur keamanan, tabel kontrol, HTTP security headers, dan kebijakan pengungkapan kerentanan dapat Anda baca langsung pada dokumen Standar Keamanan (/security).",
          ],
        },
        {
          id: "data-subject-rights",
          number: "10",
          title: "Hak-Hak Subjek Data & Waktu Pemenuhan (UU PDP Bab IV)",
          paragraphs: [
            "Sebagai Subjek Data berdasarkan Pasal 5 hingga Pasal 13 UU PDP No. 27/2022, Anda memiliki hak-hak berikut beserta cara menjalankannya:",
            "1. Hak mendapatkan informasi & akses atas data pribadi Anda (dapat dilihat langsung di Dashboard & Pengaturan Profil).",
            "2. Hak melengkapi, memperbarui, dan/atau memperbaiki kesalahan data (Rektifikasi — dapat dilakukan langsung di aplikasi, atau melalui permintaan tertulis yang kami proses sesuai batas waktu UU PDP paling lambat 3×24 jam sejak verifikasi identitas lengkap).",
            "3. Hak mendapatkan salinan dan portabilitas data dalam format terstruktur yang umum digunakan (tersedia fitur Ekspor mandiri dalam format CSV pada halaman Transaksi dan Laporan).",
            "4. Hak mengakhiri pemrosesan dan menghapus data pribadi (Right to Erasure — tersedia mandiri melalui tombol Hapus Akun di Pengaturan Profil).",
            "5. Hak menarik kembali persetujuan pemrosesan data, hak menunda/membatasi pemrosesan secara proporsional, serta hak mengajukan keberatan atas tindakan pengambilan keputusan yang hanya didasarkan pada pemrosesan otomatis (catatan: MoneFin tidak melakukan penilaian kredit otomatis/automated credit scoring yang menimbulkan akibat hukum bagi Anda).",
            `Prosedur & Batas Waktu: Sebagian besar hak di atas dapat dieksekusi langsung secara instan (0 hari tunggu) di dalam aplikasi. Apabila Anda mengajukan permohonan khusus melalui email ke ${COMPLIANCE_FACTS.contacts.privacy.email}, kami akan memberikan konfirmasi awal dalam maksimal 3 hari kerja dan menyelesaikan permohonan paling lambat dalam 3×24 jam (untuk koreksi/pembaruan sesuai UU PDP) hingga maksimal 30 hari kalender (untuk permintaan kompleks yang memerlukan verifikasi tambahan).`,
          ],
        },
        {
          id: "children-privacy",
          number: "11",
          title: "Pelindungan Data Anak-Anak",
          paragraphs: [
            `Layanan MoneFin dirancang untuk pengguna dewasa yang berusia minimal ${COMPLIANCE_FACTS.minAgeYears} (delapan belas) tahun atau telah menikah sesuai ketentuan kecakapan hukum di Indonesia.`,
            "Sesuai Pasal 25 UU PDP No. 27/2022, pemrosesan data pribadi anak (di bawah 18 tahun) wajib mendapatkan persetujuan secara eksplisit dari orang tua atau wali sah anak yang bersangkutan. Kami tidak secara sengaja mengumpulkan data pribadi dari anak di bawah usia 18 tahun tanpa persetujuan orang tua/wali. Apabila orang tua atau wali mengetahui bahwa anaknya telah mendaftarkan akun tanpa persetujuan mereka, silakan hubungi kami di privacy@monefin.web.id agar kami dapat memverifikasi dan menghapus akun serta data terkait segera.",
          ],
        },
        {
          id: "cookies-tokens",
          number: "12",
          title: "Cookie, Token Autentikasi, & Penyimpanan Lokal Peramban",
          paragraphs: [
            "MoneFin tidak memasang cookie pelacak periklanan lintas situs (third-party advertising/tracking pixels). Kami hanya menggunakan cookie fungsional dan penyimpanan lokal peramban (localStorage / sessionStorage) yang diperlukan untuk menjaga sesi autentikasi, mengingat preferensi tampilan, dan mempercepat pemuatan halaman.",
            "Rincian lengkap setiap cookie dan kunci penyimpanan lokal yang digunakan oleh MoneFin tercantum pada tabel di bawah ini:",
          ],
        },
        {
          id: "incident-notification",
          number: "13",
          title: "Notifikasi Kegagalan Pelindungan Data Pribadi (Insiden Data)",
          paragraphs: [
            `Apabila terjadi kegagalan pelindungan data pribadi (kebocoran atau akses tidak sah terhadap data pribadi di sistem kami), MoneFin berkomitmen menyampaikan pemberitahuan tertulis paling lambat 3×24 jam (${COMPLIANCE_FACTS.incidentNotificationHours} jam) sejak insiden diketahui secara terverifikasi kepada Subjek Data yang terdampak dan kepada lembaga penyelenggara pelindungan data pribadi sesuai Pasal 46 UU PDP No. 27/2022.`,
            "Pemberitahuan tertulis tersebut sekurang-kurangnya memuat: (a) rincian kategori data pribadi yang terungkap, (b) kapan dan bagaimana data pribadi tersebut terungkap, (c) upaya penanganan dan pemulihan yang telah serta sedang dilakukan oleh MoneFin, serta (d) langkah mitigasi yang disarankan bagi Pengguna dan titik kontak resmi tim tanggap insiden kami.",
          ],
        },
        {
          id: "policy-changes",
          number: "14",
          title: "Perubahan Kebijakan Privasi & Riwayat Versi",
          paragraphs: [
            "Kebijakan Privasi ini ditinjau secara berkala minimal setiap 6 (enam) bulan atau saat terdapat penambahan fitur baru, perubahan sub-prosesor, atau pembaruan regulasi pelindungan data.",
            `Setiap perubahan material akan diumumkan minimal ${COMPLIANCE_FACTS.noticeAdvanceDays} hari kalender sebelum berlaku efektif melalui email terdaftar dan banner pemberitahuan di dalam aplikasi. Versi terdahulu dicatat dalam bagian Riwayat Perubahan (Changelog Publik) di bagian bawah halaman ini.`,
          ],
        },
        {
          id: "dpo-contact",
          number: "15",
          title: "Kontak Pejabat PDP (DPO) & Hak Mengadu ke Otoritas",
          paragraphs: [
            "Apabila Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, ingin menggunakan hak Subjek Data Anda, atau ingin menyampaikan keluhan terkait pemrosesan data pribadi, silakan hubungi Pejabat/Tim Pelindungan Data Pribadi (DPO) kami:",
            `• Email Privasi & DPO: ${COMPLIANCE_FACTS.contacts.privacy.email} (${COMPLIANCE_FACTS.contacts.privacy.sla.id})`,
            "• Hak Mengajukan Pengaduan ke Otoritas: Apabila Anda menilai bahwa permohonan atau keluhan pelindungan data pribadi Anda belum ditangani secara memadai oleh kami sesuai ketentuan UU PDP No. 27 Tahun 2022, Anda berhak mengajukan pengaduan resmi kepada Lembaga Pelindungan Data Pribadi / Direktorat Jenderal Pengawasan Ruang Digital di bawah Kementerian Komunikasi dan Digital (Komdigi) Republik Indonesia.",
          ],
        },
      ],
    },

    // =========================================================================
    // C. STANDAR KEAMANAN (12 Bagian Wajib)
    // =========================================================================
    security: {
      title: "Standar Keamanan & Arsitektur Pelindungan",
      subtitle:
        "Dokumentasi transparan dan terukur mengenai kontrol keamanan aplikasi, kriptografi, integritas buku kas, serta program pengungkapan kerentanan MoneFin.",
      badge: "Berpanduan OWASP ASVS · NIST SP 800-63B · ISO/IEC 27002",
      version: COMPLIANCE_FACTS.versionLabel.id,
      effectiveDate: COMPLIANCE_FACTS.effectiveDate.id,
      updatedDate: COMPLIANCE_FACTS.updatedDate.id,
      owner: COMPLIANCE_FACTS.documentOwner.id,
      contactRole: COMPLIANCE_FACTS.contacts.security,
      summaryPoints: [
        "Dokumen ini menjelaskan kontrol keamanan yang benar-benar kami terapkan hari ini secara jujur dan terukur; kami menggunakan OWASP ASVS, NIST SP 800-63B, dan ISO/IEC 27002 sebagai kerangka panduan teknis (bukan klaim sertifikasi).",
        "Setiap permintaan API untuk membaca atau mengubah data keuangan divalidasi kepemilikannya terhadap identitas pengguna yang terautentikasi dan diverifikasi melalui pengujian otomatis.",
        "Kata sandi di-hash dengan Bcrypt, token sesi berawalan 'mnf_' di-hash dengan SHA-256, kunci API BYOK dienkripsi dengan AES-256-CBC, dan jalur komunikasi diamankan dengan TLS 1.2+/1.3 serta HSTS.",
        "Mutasi saldo rekening dijalankan di dalam transaksi database berprinsip ACID dengan penguncian baris pesimistis (SELECT ... FOR UPDATE) untuk mencegah kondisi pacu (race condition).",
        "Kami menyediakan kebijakan Pengungkapan Kerentanan Terkoordinasi sesuai ISO/IEC 29147 dan RFC 9116 (/.well-known/security.txt) dengan perlindungan Safe Harbor dan waktu konfirmasi awal maksimal 3 hari kerja.",
      ],
      sections: [
        {
          id: "scope-principles",
          number: "01",
          title: "Ruang Lingkup, Prinsip, & Kerangka Acuan Keamanan",
          callout: {
            type: "important",
            title: "Kejujuran Teknis & Status Kerangka Panduan",
            text: "MoneFin menggunakan OWASP Application Security Verification Standard (ASVS), NIST SP 800-63B, ISO/IEC 27002, dan ISO/IEC 29147 sebagai kerangka panduan rekayasa internal. Penyebutan standar tersebut merupakan acuan praktik terbaik yang kami ikuti, bukan klaim bahwa entitas MoneFin telah memegang sertifikasi audit pihak ketiga.",
          },
          paragraphs: [
            "Dokumen Standar Keamanan ini mencakup aplikasi web frontend, antarmuka pemrograman aplikasi (API) backend, basis data relasional, serta alur integrasi pihak ketiga pada platform MoneFin. Kami merancang arsitektur keamanan berdasarkan tiga prinsip utama:",
            "1. Hak Akses Minimum (Least Privilege): Setiap sesi pengguna, token API, dan komponen layanan hanya diberikan hak akses minimum yang diperlukan untuk menjalankan fungsinya.",
            "2. Pertahanan Berlapis (Defense in Depth): Keamanan tidak bergantung pada satu lapisan tunggal, melainkan kombinasi perlindungan jaringan (TLS/HSTS), pembatasan laju permintaan (rate limiting), autentikasi token, validasi skema input, otorisasi kepemilikan data, dan transaksi database.",
            "3. Aman Secara Bawaan (Secure by Default): Fitur opsional yang melibatkan pihak ketiga (seperti AI Assistant BYOK dan penyimpanan lampiran foto struk) berada dalam kondisi nonaktif secara bawaan hingga diaktifkan oleh pengguna.",
            "Tabel di bawah ini merangkum status implementasi kontrol keamanan MoneFin saat ini (Aktif / Sebagian / Roadmap):",
          ],
        },
        {
          id: "security-governance",
          number: "02",
          title: "Tata Kelola Keamanan Informasi",
          paragraphs: [
            `Pengelolaan keamanan informasi di MoneFin dikoordinasikan oleh ${COMPLIANCE_FACTS.documentOwner.id} yang bertanggung jawab menetapkan kebijakan kontrol akses, meninjau perubahan arsitektur, memelihara registri fakta kepatuhan internal, serta menangani laporan insiden maupun kerentanan.`,
            "Setiap perubahan kode produksi wajib melewati pemeriksaan ketergantungan paket (dependency check), verifikasi kompilasi statis, serta pengujian otomatis sebelum diterapkan. Dokumen keamanan dan kebijakan privasi ditinjau ulang secara berkala minimal setiap 6 (enam) bulan atau setiap kali terdapat penambahan fitur dan integrasi vendor baru.",
          ],
        },
        {
          id: "authorization-isolation",
          number: "03",
          title: "Otorisasi & Isolasi Data Antar-Pengguna",
          paragraphs: [
            "Pada aplikasi keuangan multi-pengguna, risiko Broken Object Level Authorization (BOLA / IDOR) merupakan ancaman utama yang harus dicegah secara sistematis. MoneFin merancang setiap operasi pembacaan, pembuatan, pembaruan, dan penghapusan data agar selalu terikat pada identitas pengguna yang sedang terautentikasi.",
            "Setiap permintaan yang menyertakan pengenal sumber daya (seperti rekening/dompet, kategori, transaksi, anggaran, target tabungan, maupun tagihan split bill) diperiksa kepemilikannya pada tingkat kueri basis data dan lapisan aturan validasi sebelum dieksekusi. Selain itu, kami memelihara rangkaian pengujian otomatis (automated authorization & isolation tests) di lingkungan pengujian internal untuk memverifikasi bahwa upaya mengakses atau memanipulasi data milik pengguna lain ditolak oleh sistem.",
          ],
        },
        {
          id: "authentication-sessions",
          number: "04",
          title: "Autentikasi, Kebijakan Kata Sandi, & Manajemen Sesi",
          paragraphs: [
            "Mengacu pada panduan identitas digital NIST SP 800-63B, MoneFin menerapkan kontrol autentikasi dan manajemen sesi berikut:",
            "• Kebijakan Kata Sandi: Mewajibkan panjang minimal 8 karakter tanpa memaksakan aturan komposisi karakter artifisial yang justru mendorong pola kata sandi mudah ditebak, serta tanpa pemaksaan pergantian kata sandi berkala kecuali terdapat indikasi kompromi kredensial.",
            "• Kode Verifikasi OTP Berbasis CSPRNG: Kode One-Time Password (6 digit) untuk verifikasi email, 2FA, dan pemulihan kata sandi dibangkitkan menggunakan generator angka acak kriptografis (CSPRNG random_int()) dengan masa berlaku pendek (5 menit) dan perlindungan penalti percobaan berulang.",
            "• Pencegahan Enumerasi Email: Alur lupa kata sandi dan pengiriman ulang OTP dirancang memberikan respons yang seragam sehingga pihak luar tidak dapat memetakan daftar alamat email yang terdaftar di sistem.",
            "• Autentikasi Dua Faktor (2FA): Saat ini MoneFin menyediakan fitur 2FA berbasis OTP Email yang dapat diaktifkan pengguna di Pengaturan Keamanan. Dukungan aplikasi autentikator berbasis TOTP (RFC 6238) dan Passkeys/WebAuthn berada dalam peta jalan pengembangan (Roadmap).",
            "• Manajemen Sesi Perangkat & Re-Autentikasi: Pengguna dapat melihat daftar perangkat yang sedang aktif (termasuk jenis peramban, waktu aktif terakhir, dan alamat IP perangkat) serta mencabut sesi pada perangkat lain dari jarak jauh. Untuk tindakan berisiko tinggi seperti penghapusan akun permanen, sistem mewajibkan konfirmasi ulang kata sandi (re-autentikasi).",
          ],
        },
        {
          id: "cryptography",
          number: "05",
          title: "Kriptografi: Saat Transit, Saat Tersimpan, & Pengelolaan Kunci",
          paragraphs: [
            "Kami menerapkan algoritma kriptografi standar industri yang terverifikasi pada kode produksi kami:",
            "1. Perlindungan Saat Transit (In-Transit): Seluruh komunikasi antara peramban/aplikasi pengguna dan server MoneFin dienkripsi menggunakan protokol HTTPS (TLS 1.2 minimum, dengan TLS 1.3 diprioritaskan pada negosiasi koneksi) serta kebijakan Strict-Transport-Security (HSTS). Panggilan keluar (outbound) dari server backend ke API penyedia AI menerapkan verifikasi sertifikat SSL/TLS secara ketat.",
            "2. Hashing Kata Sandi & Token Sesi: Kata sandi pengguna di-hash secara satu arah menggunakan algoritma Bcrypt dengan salt kriptografis unik per pengguna. Token akses sesi berawalan 'mnf_' disimpan di basis data dalam bentuk hash satu arah SHA-256; nilai token asli hanya dikirimkan satu kali saat sesi dibuat.",
            "3. Enkripsi Kunci API BYOK (At-Rest): Kunci API penyedia AI yang dimasukkan pengguna dienkripsi pada lapisan aplikasi menggunakan algoritma simetris AES-256-CBC (melalui modul OpenSSL dengan kode autentikasi pesan / MAC) sebelum disimpan ke basis data. Kunci enkripsi aplikasi disimpan secara terpisah pada variabel lingkungan server yang terbatas aksesnya.",
            "4. Enkripsi Penyimpanan Infrastruktur: Enkripsi pada tingkat media penyimpanan fisik (disk/volume) dan cadangan (backup) dikelola oleh penyedia infrastruktur pusat data/cloud kami.",
          ],
        },
        {
          id: "api-security-headers",
          number: "06",
          title: "Keamanan Aplikasi, API, & HTTP Security Headers",
          paragraphs: [
            "Untuk memitigasi risiko pada OWASP Top 10 dan OWASP API Security Top 10, MoneFin menerapkan kontrol keamanan aplikasi dan API berikut:",
            "• Validasi Skema Input & Kueri Berparameter: Seluruh input pengguna divalidasi tipe data, panjang, dan formatnya di sisi server. Interaksi basis data menggunakan kueri berparameter (prepared statements) untuk mencegah injeksi SQL.",
            "• Pembatasan Laju Permintaan (Rate Limiting): Endpoint sensitif dilindungi oleh pembatasan frekuensi permintaan berbasis IP dan identitas pengguna (misalnya batas ketat pada percobaan login, pengiriman OTP, pemindaian struk AI, dan percakapan AI).",
            "• Perlindungan SSRF pada Endpoint AI Kustom: Ketika pengguna mengonfigurasi URL endpoint AI kustom (BYOK), sistem memvalidasi skema HTTPS dan memblokir alamat IP privat/loopback/metadata internal guna mencegah serangan Server-Side Request Forgery (SSRF).",
            "• HTTP Security Headers (Sesuai Rekomendasi OWASP Secure Headers Project): Kami tidak lagi mengklaim atau mengandalkan header usang X-XSS-Protection, melainkan menerapkan kebijakan Content-Security-Policy dan header keamanan modern yang nilainya identik antara dokumentasi ini dan konfigurasi server sebagaimana tertera pada tabel di bawah ini:",
          ],
        },
        {
          id: "financial-integrity",
          number: "07",
          title: "Integritas Data Finansial: Transaksi ACID & Penguncian Baris",
          paragraphs: [
            "Akurasi pencatatan saldo merupakan aspek krusial dalam aplikasi manajemen keuangan. Eksekusi permintaan secara bersamaan (concurrent requests) tanpa pengendalian konkurensi dapat memicu selisih perhitungan saldo (race condition).",
            "Di MoneFin, setiap operasi yang memengaruhi saldo rekening—baik pencatatan pemasukan/pengeluaran baru, pembaruan atau penghapusan transaksi, konfirmasi struk belanja, maupun setoran/penarikan target tabungan—dieksekusi di dalam transaksi basis data yang mematuhi prinsip ACID (Atomicity, Consistency, Isolation, Durability).",
            "Sebelum memperbarui nilai saldo pada suatu rekening, sistem menerapkan penguncian baris pesimistis (pessimistic row-level locking melalui klausa SELECT ... FOR UPDATE) pada baris rekening terkait hingga transaksi selesai di-commit. Jika salah satu langkah di dalam transaksi gagal, seluruh perubahan dibatalkan secara utuh (rollback) sehingga saldo tetap konsisten.",
          ],
        },
        {
          id: "infrastructure-backup",
          number: "08",
          title: "Infrastruktur, Pencatatan Log, & Pencadangan (Backup)",
          paragraphs: [
            "• Infrastruktur Hosting & Klarifikasi Sertifikasi: Aplikasi web frontend di-hosting pada jaringan edge Vercel Inc., sedangkan API backend dan basis data dijalankan pada infrastruktur server cloud yang terisolasi. Sertifikasi keamanan pusat data seperti ISO/IEC 27001 dan SOC 2 merupakan sertifikasi milik penyedia layanan infrastruktur cloud pihak ketiga tersebut, bukan sertifikasi yang dimiliki oleh entitas MoneFin.",
            `• Pencatatan Log Keamanan: Sistem mencatat peristiwa keamanan penting (seperti kegagalan autentikasi berulang, pembuatan/pencabutan sesi, dan error sistem) tanpa mencatat kata sandi teks biasa atau kunci API mentah. Log keamanan disimpan maksimal selama ${COMPLIANCE_FACTS.backupRetentionDays} hari kalender.`,
            `• Kebijakan Pencadangan (Backup) & Pemulihan: Basis data dicadangkan secara berkala setiap hari (daily automated backup) ke penyimpanan terpisah yang terlindungi. Arsip cadangan disimpan dengan masa retensi maksimal ${COMPLIANCE_FACTS.backupRetentionDays} hari kalender dan diuji prosedur pemulihannya (restore test) secara berkala untuk mendukung kelangsungan layanan.`,
          ],
        },
        {
          id: "vendor-security",
          number: "09",
          title: "Keamanan Vendor & Sub-Prosesor",
          paragraphs: [
            "Kami membatasi penggunaan vendor pihak ketiga hanya pada fungsi infrastruktur dan integrasi yang esensial. Sebelum mengintegrasikan layanan pihak ketiga, kami mengevaluasi reputasi keamanan, dukungan enkripsi transport (HTTPS/TLS), serta cakupan data minimum yang dikirimkan.",
            "Daftar lengkap pemroses dan sub-prosesor pihak ketiga yang digunakan oleh MoneFin (konsisten dengan Kebijakan Privasi bagian 05) disajikan pada tabel berikut:",
          ],
        },
        {
          id: "incident-response",
          number: "10",
          title: "Respons Insiden & Komitmen Notifikasi (3×24 Jam)",
          paragraphs: [
            "MoneFin memelihara prosedur penanganan insiden keamanan yang mencakup empat tahapan: (1) Deteksi & Triase Awal, (2) Isolasi & Pembatasan Dampak (Containment), (3) Pembersihan & Pemulihan Layanan (Eradication & Recovery), serta (4) Evaluasi Pasca-Insiden (Post-Mortem).",
            `Komitmen Notifikasi Sesuai Pasal 46 UU PDP No. 27/2022: Apabila terjadi insiden keamanan yang mengakibatkan kegagalan pelindungan data pribadi pengguna, kami berkomitmen mengirimkan pemberitahuan tertulis paling lambat 3×24 jam (${COMPLIANCE_FACTS.incidentNotificationHours} jam) sejak insiden terverifikasi kepada pengguna yang terdampak dan kepada otoritas pelindungan data pribadi yang berwenang. Pemberitahuan tersebut memuat sekurang-kurangnya: kategori data yang terdampak, waktu dan kronologi kejadian, langkah penanganan yang telah diambil, serta kontak tim tanggap insiden (${COMPLIANCE_FACTS.contacts.security.email}).`,
          ],
        },
        {
          id: "vulnerability-disclosure",
          number: "11",
          title: "Pengungkapan Kerentanan Terkoordinasi (ISO/IEC 29147 & RFC 9116)",
          callout: {
            type: "shield",
            title: "Safe Harbor & Berkas /.well-known/security.txt Aktif",
            text: "Kami mengundang peneliti keamanan untuk melaporkan celah keamanan secara bertanggung jawab ke security@monefin.web.id. Kebijakan mesin-terbaca (RFC 9116) tersedia di https://www.monefin.web.id/.well-known/security.txt.",
          },
          paragraphs: [
            "Mengacu pada standar ISO/IEC 29147 (Vulnerability Disclosure) dan RFC 9116, MoneFin menyediakan jalur pelaporan kerentanan keamanan terkoordinasi dengan ketentuan berikut:",
            `• Saluran Pelaporan & Waktu Respons (SLA): Kirimkan laporan lengkap (langkah reproduksi, endpoint terkait, dan dampak potensial) ke ${COMPLIANCE_FACTS.contacts.security.email}. Kami berkomitmen mengirimkan konfirmasi penerimaan awal (acknowledgment) dalam waktu maksimal 3 (tiga) hari kerja dan hasil triase teknis dalam maksimal 7 (tujuh) hari kerja.`,
            "• Ruang Lingkup (In-Scope): Aplikasi web utama (https://www.monefin.web.id), aplikasi Android resmi MoneFin, serta endpoint API produksi MoneFin. (Out-of-Scope: serangan rekayasa sosial/phishing terhadap staf atau pengguna, serangan Denial of Service / DDoS / spam otomatis, serta kerentanan pada situs pihak ketiga di luar kendali kami).",
            "• Aturan Pengujian & Larangan Tegas: Peneliti wajib menggunakan akun pengujian milik sendiri, dilarang keras mengakses, membaca, memodifikasi, atau menghapus data milik pengguna lain, dilarang menurunkan ketersediaan layanan, dan wajib menjaga kerahasiaan temuan hingga perbaikan selesai diterapkan.",
            "• Jaminan Perlindungan Hukum (Safe Harbor): Selaras dengan Syarat & Ketentuan Bagian 06, MoneFin tidak akan mengajukan tuntutan hukum perdata maupun laporan pidana, serta tidak akan memblokir secara permanen akun pengujian milik peneliti yang melakukan pengujian secara beriktikad baik dan mematuhi aturan pada bagian ini.",
          ],
        },
        {
          id: "shared-responsibility",
          number: "12",
          title: "Batasan Sistem, Tanggung Jawab Bersama, & Riwayat Perubahan",
          paragraphs: [
            "Tidak ada sistem perangkat lunak yang dapat mengklaim kekebalan mutlak terhadap seluruh risiko siber. Keamanan data keuangan Anda di MoneFin merupakan hasil kerja sama antara kontrol teknis yang kami terapkan di sisi server dan praktik keamanan yang Anda jalankan di sisi perangkat:",
            "• Pastikan perangkat telepon pintar dan komputer Anda menggunakan sistem operasi serta peramban yang diperbarui dan terlindungi kunci layar.",
            "• Gunakan kata sandi yang unik untuk akun MoneFin (jangan gunakan ulang kata sandi dari layanan lain yang pernah mengalami kebocoran).",
            "• Aktifkan fitur Autentikasi Dua Faktor (2FA) di menu Pengaturan Keamanan dan periksa daftar sesi perangkat aktif secara berkala.",
            "• Simpan kunci API BYOK Anda dengan aman dan gunakan kunci dengan batas kuota pengeluaran pada penyedia AI Anda.",
          ],
        },
      ],
    },
  },

  // ===========================================================================
  // ENGLISH VERSION (Translation — Indonesian version is legally binding)
  // ===========================================================================
  en: {
    common: {
      back: "Back",
      lastUpdated: "Last Updated",
      effectiveDate: `Effective Date: ${COMPLIANCE_FACTS.effectiveDate.en}`,
      jurisdiction: "Jurisdiction: Republic of Indonesia",
      owner: COMPLIANCE_FACTS.documentOwner.en,
      reviewCycle: COMPLIANCE_FACTS.reviewCycle.en,
      languageNotice: COMPLIANCE_FACTS.governingLanguageNotice.en,
      tableOfContents: "Table of Contents",
      quickSummaryTitle: "Quick Summary (Top 5 Takeaways)",
      copyLink: "Copy Page Link",
      linkCopied: "Page link copied to clipboard!",
      print: "Print / Save PDF",
      contactTitle: "Official MoneFin Contact Channels",
      contactDesc: "Reach out to our dedicated teams based on your inquiry. We aim to respond within the following realistic service level targets:",
      otherDocuments: "Related Compliance Documents",
      readNext: "Continue reading",
      feedbackTitle: "Was this document clear and easy to understand?",
      feedbackDesc: "We write our policies in plain, verifiable language with zero unverified claims.",
      changelogTitle: "Document Revision History (Public Changelog)",
      tabs: {
        terms: "Terms of Service",
        privacy: "Privacy Policy",
        security: "Security Standards",
      },
    },

    // =========================================================================
    // E. TERMS OF SERVICE (18 Mandatory Sections)
    // =========================================================================
    terms: {
      title: "Terms of Service",
      subtitle:
        "Legal terms governing the rights and obligations between Users and MoneFin regarding personal finance tracking, 50/30/20 budgeting, Split Bill, and BYOK AI features.",
      badge: "Digital Service Agreement",
      version: COMPLIANCE_FACTS.versionLabel.en,
      effectiveDate: COMPLIANCE_FACTS.effectiveDate.en,
      updatedDate: COMPLIANCE_FACTS.updatedDate.en,
      owner: COMPLIANCE_FACTS.documentOwner.en,
      contactRole: COMPLIANCE_FACTS.contacts.legal,
      summaryPoints: [
        "MoneFin is a self-directed personal finance bookkeeping tool; we are not a bank, licensed financial advisor, money transmitter, or escrow custodian.",
        "Users must be at least 18 years old (or legally emancipated/married), or act with verifiable parental/guardian consent pursuant to Article 25 of Indonesia's PDP Law No. 27/2022.",
        "Split Bill provides administrative calculation only; BYOK AI outputs are informational and require user verification; gamification XP and badges carry no monetary value.",
        "Good-faith security research conducted in compliance with our Coordinated Vulnerability Disclosure policy (ISO/IEC 29147) is protected under our Safe Harbor exemption.",
        "Liability limitations are proportionate under Indonesian Consumer Protection Law No. 8/1999; users retain the right to export data (CSV) and appeal account suspensions.",
      ],
      sections: [
        {
          id: "scope",
          number: "01",
          title: "Parties, Acceptance, & Method of Consent",
          paragraphs: [
            "These Terms of Service ('Terms') form a binding legal agreement between you as an individual user ('User' or 'You') and the operator of the MoneFin platform ('MoneFin' or 'We').",
            "Your agreement to these Terms and our Privacy Policy is given explicitly by checking a separate consent checkbox (unchecked by default) during account registration, or when authenticating via Google OAuth 2.0 Single Sign-On.",
            "Consent for optional features—such as enabling the Bring Your Own Key (BYOK) AI Assistant or choosing to store receipt image attachments—is obtained separately when you opt in to those features within the app. If you do not agree to these Terms, please do not register or use the Services.",
          ],
        },
        {
          id: "definitions",
          number: "02",
          title: "Key Definitions",
          paragraphs: [
            "1. Services: The MoneFin web application and mobile application (APK/PWA) together with all personal finance management features provided therein.",
            "2. Personal Financial Data: Account balances, income and expense entries, budgets, savings goals, and split bill records manually entered or confirmed by the User.",
            "3. BYOK (Bring Your Own Key) AI Features: Optional financial Q&A and receipt OCR scanning features powered by third-party language models using the User's own API key.",
            "4. Split Bill: An administrative calculation tool for dividing shared expenses among participants without executing actual fund transfers.",
            "5. Data Subject: An individual to whom personal data relates, as defined under Law of the Republic of Indonesia No. 27 of 2022 on Personal Data Protection ('UU PDP').",
          ],
        },
        {
          id: "service-description",
          number: "03",
          title: "Service Description & Explicit Limitations",
          callout: {
            type: "important",
            title: "Not a Bank, Licensed Financial Advisor, or Escrow Agent",
            text: "MoneFin is an administrative bookkeeping application. We do not accept deposits, do not connect directly to debit your bank accounts, do not transfer funds, and do not provide licensed investment, tax, or legal advice.",
          },
          paragraphs: [
            "MoneFin is designed to help Users log daily income and expenses, allocate budgets (including the 50/30/20 rule), track savings goals (sinking funds), calculate shared expenses (Split Bill), and visualize cashflow reports.",
            "All balances displayed in MoneFin represent self-recorded bookkeeping entries rather than real-time bank ledger balances. Any financial, investment, or tax decision you make remains solely your personal responsibility.",
          ],
        },
        {
          id: "eligibility",
          number: "04",
          title: "User Eligibility: Minimum Age & Legal Capacity",
          paragraphs: [
            "To independently register an account and enter into these Terms, you must be at least 18 (eighteen) years of age or legally married and possess full legal capacity under the laws of the Republic of Indonesia (Indonesian Civil Code and UU PDP No. 27/2022).",
            "If you are under 18 years old, you may only use the Services with the explicit consent and supervision of your parent or legal guardian in accordance with Article 25 of the UU PDP. The legal guardian assumes full responsibility for the minor's account usage.",
            "Each account is intended for a single individual User. You may not sell, rent, or transfer your account credentials to any other person.",
          ],
        },
        {
          id: "credentials-responsibility",
          number: "05",
          title: "Account & Credential Security (Shared Responsibility)",
          paragraphs: [
            "Account security operates under a shared responsibility model between MoneFin and the User:",
            "• MoneFin's Obligations: We hash user passwords one-way using Bcrypt, store session tokens as SHA-256 hashes, provide active device session visibility and remote revocation controls, and require password re-authentication for high-risk actions such as permanent account deletion.",
            "• User's Obligations: You must choose a strong password (minimum 8 characters), keep your One-Time Password (OTP) codes and BYOK API keys confidential, and promptly revoke unrecognized sessions in Security Settings or notify us at security@monefin.web.id if you suspect unauthorized access.",
            "MoneFin personnel will never ask for your account password, OTP code, banking PIN, or card CVV through any communication channel.",
          ],
        },
        {
          id: "prohibited-use",
          number: "06",
          title: "Prohibited Conduct & Security Researcher Safe Harbor",
          callout: {
            type: "shield",
            title: "Safe Harbor Exemption for Ethical Security Researchers",
            text: "Good-faith security testing conducted strictly within the scope and rules set forth in our Coordinated Vulnerability Disclosure Policy (/security#vulnerability-disclosure and /.well-known/security.txt) is authorized and does not constitute a breach of these Terms.",
          },
          paragraphs: [
            "While using the Services, you must not:",
            "1. Perform automated scraping/crawling or intentionally overload infrastructure (Denial of Service / automated spam) beyond normal application usage.",
            "2. Reverse-engineer, decompile, or attempt to access another user's records without authorization.",
            "3. Tamper with API payloads to artificially manipulate experience points (XP), gamification badges, or system quotas.",
            "4. Use the Services to record, conceal, or facilitate money laundering, fraud, or unlawful activities.",
            "Vulnerability Disclosure Exemption (Safe Harbor): Technical testing restrictions above do not apply to independent security researchers who conduct good-faith testing, do not access or modify other users' data, do not degrade service availability (DoS), and promptly report findings to security@monefin.web.id in accordance with our Security Standards page.",
          ],
        },
        {
          id: "special-features",
          number: "07",
          title: "Special Features: Split Bill, AI (BYOK), & Gamification",
          callout: {
            type: "warning",
            title: "Verify AI Outputs & Never Input Banking Credentials",
            text: "Receipt OCR and AI Assistant responses may contain inaccuracies. Always review extracted amounts before saving, and never input ATM PINs, banking passwords, full card numbers, or CVV codes into transaction notes or AI chats.",
          },
          paragraphs: [
            "• Split Bill (Administrative Bookkeeping): Split Bill computes group expense allocations including taxes and service charges. Statuses such as 'Paid' or 'Unpaid' are administrative records only. Actual monetary reimbursement occurs externally between participants.",
            "• AI Assistant & Receipt Scanning (BYOK): AI features are optional. AI outputs are generated probabilistically by third-party language models and do not constitute professional financial or tax advice. You must verify extracted merchant names, dates, and totals before confirming a receipt transaction.",
            "• Gamification (Non-Monetary Nature): Experience points (XP), levels, quests, and achievement badges are educational incentives designed to encourage consistent financial tracking. They carry no fiat currency value, cannot be redeemed for cash, and cannot be traded.",
          ],
        },
        {
          id: "user-content",
          number: "08",
          title: "User Content & Financial Data Ownership",
          paragraphs: [
            "You retain full ownership rights over all Personal Financial Data, transaction notes, and receipt images that you input or upload into your MoneFin account.",
            "By submitting data to the Services, you grant MoneFin a limited, non-exclusive, revocable, royalty-free license solely to store, back up, compute, and display that data back to you as required to operate the features you select. This license terminates automatically when you delete the data or close your account, subject to the technical backup rotation period (maximum 30 calendar days) detailed in our Privacy Policy.",
          ],
        },
        {
          id: "intellectual-property",
          number: "09",
          title: "Platform Intellectual Property Rights",
          paragraphs: [
            "All software code, user interface designs, visual assets, logos, the 'MoneFin' brand name, and documentation within the platform are protected by copyright and intellectual property laws of the Republic of Indonesia.",
            "MoneFin grants you a personal, non-exclusive, non-transferable license to access and use the Services in accordance with these Terms. Commercial use of MoneFin's brand assets requires our prior written permission.",
          ],
        },
        {
          id: "third-party-services",
          number: "10",
          title: "Third-Party Services & Sub-Processors",
          paragraphs: [
            "Our Services integrate optional third-party components at your direction, such as Google OAuth 2.0 authentication and third-party AI model APIs via Bring Your Own Key (Google Gemini, Groq, OpenAI, Anthropic, or OpenRouter).",
            "When you enable these integrations, upstream API availability and processing are governed by the respective third party's terms. A complete list of our sub-processors and their safeguards is available in our Privacy Policy (/privacy#subprocessors).",
          ],
        },
        {
          id: "fees-pricing",
          number: "11",
          title: "Service Fees & Pricing Changes",
          paragraphs: [
            "Currently, MoneFin's core features are provided free of charge (IDR 0 / USD 0) to individual users without third-party advertisements.",
            "BYOK AI Usage Note: When you enable AI features using your own API key (BYOK), any API token usage charges (if you use a paid tier with your chosen AI provider) are billed directly to you by that AI provider under your agreement with them, not by MoneFin.",
            "Should MoneFin introduce optional paid tiers or add-ons in the future, we will provide at least 30 (thirty) calendar days' advance notice and will never charge you without your explicit opt-in subscription consent.",
          ],
        },
        {
          id: "availability-maintenance",
          number: "12",
          title: "Service Availability, Maintenance, & Self-Service Export",
          paragraphs: [
            "We strive to maintain reliable access to the Services. However, availability may occasionally be interrupted for scheduled maintenance, urgent security patching, or upstream cloud network incidents.",
            "For planned maintenance requiring downtime, we aim to provide advance notice via an in-app banner. We also provide a CSV Data Export feature on the Transactions and Reports pages so you can maintain independent local backups at any time.",
          ],
        },
        {
          id: "liability",
          number: "13",
          title: "Disclaimers & Proportionate Limitation of Liability",
          paragraphs: [
            "MoneFin implements technical security controls and ACID-compliant database transactions as documented in our Security Standards (/security). Nevertheless, software cannot be guaranteed to be completely free from network interruptions, synchronization delays, or OCR/AI inaccuracies.",
            "To the extent permitted by applicable law, MoneFin shall not be liable for indirect damages, investment losses, or losses resulting from: (a) financial decisions made by the User based on analytical or AI summaries, (b) User negligence in safeguarding login credentials or BYOK API keys, or (c) third-party ISP or upstream API outages beyond our reasonable control.",
            "Preservation of Mandatory Consumer Rights (Article 18 of Law No. 8/1999): Nothing in these Terms is intended to exclude, limit, or waive MoneFin's legal liability for damages proven to result from MoneFin's willful misconduct, gross negligence, or statutory data protection obligations under Indonesia's PDP Law No. 27/2022.",
          ],
        },
        {
          id: "termination",
          number: "14",
          title: "Suspension, Termination, Appeals, & Data Export Access",
          paragraphs: [
            "• Account Closure by User: You may permanently close and delete your account at any time through Profile Settings with password confirmation.",
            "• Suspension or Termination by MoneFin: We may suspend or terminate account access if there is verified evidence that the account: (a) is used for unlawful/fraudulent activity, (b) conducts exploitation attacks outside the scope of our Vulnerability Disclosure Safe Harbor, or (c) violates minimum age requirements without guardian consent.",
            "• Notice, Data Export Window, & Right to Appeal: Unless prohibited by law enforcement order or during an active security attack threatening platform integrity, we will send written notice of the reason for suspension to your registered email, provide a 14 (fourteen) calendar day window to export your transaction records (CSV), and allow you to submit an appeal to legal@monefin.web.id.",
          ],
        },
        {
          id: "amendments",
          number: "15",
          title: "Changes to These Terms",
          paragraphs: [
            "We review these Terms at least every 6 (six) months or when introducing new features, sub-processors, or regulatory updates.",
            "For material changes affecting your rights or obligations, we will notify you at least 14 to 30 calendar days before the effective date via your registered email and an in-app banner. If you do not agree to the updated Terms, you have the right to export your data and close your account before the effective date without penalty.",
          ],
        },
        {
          id: "governing-law",
          number: "16",
          title: "Governing Law & Dispute Resolution",
          paragraphs: [
            "These Terms are governed by and construed in accordance with the laws of the Republic of Indonesia, including Law No. 27/2022 on Personal Data Protection, Law No. 8/1999 on Consumer Protection, and the Electronic Information and Transactions Law (UU ITE).",
            "Any dispute arising out of these Terms shall first be resolved amicably through good-faith deliberation within 30 (thirty) calendar days of written notice.",
            "If deliberation does not reach a settlement, disputes may be submitted to mediation or to the Bandung District Court (Pengadilan Negeri Bandung), without prejudice to mandatory consumer rights to bring claims before consumer dispute bodies or the district court of the consumer's domicile pursuant to Articles 23 and 45 of Law No. 8/1999.",
          ],
        },
        {
          id: "general-provisions",
          number: "17",
          title: "General Provisions: Severability, Force Majeure, & Language",
          paragraphs: [
            "• Severability: If any provision of these Terms is held invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect.",
            "• Entire Agreement & Assignment: These Terms, together with our Privacy Policy and Security Standards, constitute the entire agreement between you and MoneFin. You may not assign your account rights without our consent; MoneFin may assign these Terms in connection with a corporate reorganization upon prior notice to Users and provided data protection standards are maintained.",
            "• Force Majeure: Neither party shall be liable for delays caused directly by natural disasters, national internet backbone outages, war, or government regulatory actions beyond reasonable control.",
            "• Governing Language: Pursuant to Law No. 24 of 2009 of the Republic of Indonesia, these Terms are published in Indonesian and English. In the event of any divergence in interpretation, the Indonesian text shall prevail and be legally binding.",
          ],
        },
        {
          id: "contact-changelog",
          number: "18",
          title: "Official Contacts & Document Revision History",
          paragraphs: [
            "For legal inquiries, contract clarifications, or account appeals, please contact our dedicated channels:",
            `• Legal & Terms of Service: ${COMPLIANCE_FACTS.contacts.legal.email} (${COMPLIANCE_FACTS.contacts.legal.sla.en})`,
            `• Privacy & Data Subject Rights (DPO): ${COMPLIANCE_FACTS.contacts.privacy.email} (${COMPLIANCE_FACTS.contacts.privacy.sla.en})`,
            `• Security Vulnerability Reports: ${COMPLIANCE_FACTS.contacts.security.email} (${COMPLIANCE_FACTS.contacts.security.sla.en})`,
            `• General User Support: ${COMPLIANCE_FACTS.contacts.support.email} (${COMPLIANCE_FACTS.contacts.support.sla.en})`,
          ],
        },
      ],
    },

    // =========================================================================
    // D. PRIVACY POLICY (15 Mandatory Sections)
    // =========================================================================
    privacy: {
      title: "Privacy Policy & Personal Data Protection",
      subtitle:
        "Transparent disclosure of how MoneFin collects, processes, retains, and safeguards your personal data under Indonesia's Personal Data Protection Law (UU PDP No. 27/2022).",
      badge: "UU PDP No. 27/2022 Aligned",
      version: COMPLIANCE_FACTS.versionLabel.en,
      effectiveDate: COMPLIANCE_FACTS.effectiveDate.en,
      updatedDate: COMPLIANCE_FACTS.updatedDate.en,
      owner: COMPLIANCE_FACTS.documentOwner.en,
      contactRole: COMPLIANCE_FACTS.contacts.privacy,
      summaryPoints: [
        "We do not sell, rent, or trade your personal data or financial records to advertisers or commercial data brokers.",
        "Personal financial data is treated as Specific Personal Data under Article 4(2) of Indonesia's UU PDP No. 27/2022 with strict data minimization.",
        "Full device IP addresses are recorded on active sessions specifically to power your multi-device Session Management dashboard and anti-abuse rate limiting, and are purged upon session revocation or within 30 days in logs.",
        "AI Assistant chat history is not stored in MoneFin's database (0-day server retention); upstream AI processing follows the terms of your own BYOK API key.",
        "When you delete your account, records are purged immediately from active production databases and automatically overwritten in encrypted backups within a maximum of 30 calendar days.",
      ],
      sections: [
        {
          id: "controller-identity",
          number: "01",
          title: "Data Controller Identity & Scope",
          callout: {
            type: "important",
            title: "Handling of Specific Personal Data (UU PDP Article 4(2))",
            text: "Under Law of the Republic of Indonesia No. 27 of 2022 on Personal Data Protection (UU PDP), personal financial records are classified as Specific Personal Data. Accordingly, MoneFin enforces strict access isolation, encryption, and data minimization.",
          },
          paragraphs: [
            "This Privacy Policy explains the personal data protection practices of MoneFin ('We' or 'Us') acting as the Personal Data Controller for the MoneFin personal finance platform operating under the jurisdiction of the Republic of Indonesia.",
            "This policy is drafted in accordance with Law No. 27 of 2022 on Personal Data Protection ('UU PDP'), using the EU General Data Protection Regulation (GDPR) and ISO/IEC 27701 / ISO/IEC 29100 as internal privacy management guidance frameworks (not a claim of third-party certification).",
            `Controller Identity & Contact: MoneFin Platform Management (Operational Domicile: Bandung, West Java, Republic of Indonesia). Data Protection Officer (DPO) / Privacy Team Email: ${COMPLIANCE_FACTS.contacts.privacy.email}.`,
          ],
        },
        {
          id: "data-collected",
          number: "02",
          title: "Data Collected, Purposes, Lawful Bases, & Retention Periods",
          paragraphs: [
            "We practice strict data minimization: we collect only personal data that serves a specific, verifiable purpose required to deliver the features you use. We never ask for complete bank account numbers, ATM PINs, online banking passwords, or card CVV numbers.",
            "The structured table below details each category of personal data we collect, its processing purpose, lawful basis under Article 20 of the UU PDP, and retention period:",
          ],
        },
        {
          id: "data-sources",
          number: "03",
          title: "Sources of Personal Data",
          paragraphs: [
            "The personal data we process originates from three sources:",
            "1. Provided Directly by the User: Display name, email address, password, transaction logs, wallet/account balances, budget rules, savings goals, split bill participants, BYOK API keys, and receipt images voluntarily uploaded by you.",
            "2. Collected Automatically for Session Security: When you access the Services, our system records your full device IP address (unmasked), browser and OS User-Agent string, and last active timestamp. Rather than claiming full IP anonymization, we transparently inform you that the full IP address is recorded and displayed to you in Security Settings so you can identify connected devices and revoke unauthorized sessions.",
            "3. Third-Party Identity Providers at User Direction: If you sign in via 'Continue with Google' (Google OAuth 2.0), we receive your basic profile name, verified email address, and avatar URL from Google LLC pursuant to your authorization.",
          ],
        },
        {
          id: "lawful-basis",
          number: "04",
          title: "Lawful Basis for Processing & How to Withdraw Consent",
          paragraphs: [
            "Pursuant to Article 20 of the UU PDP (and GDPR Article 6 as a global benchmark), we process your personal data on the following lawful bases:",
            "• Explicit Consent (Article 20(2)(a)): Applied to personal financial records you input, optional profile attributes, and optional features requiring separate opt-in consent (such as BYOK AI Assistant and Receipt Scanning). Consent checkboxes are never pre-ticked.",
            "• Contractual Necessity (Article 20(2)(b)): Applied to account creation, login authentication, security OTP delivery, and currency/language preference synchronization.",
            "• Legitimate Interest (Article 20(2)(f)): Applied narrowly to network security, anti-brute-force rate limiting, and active session tracking to protect your account against takeover.",
            "How to Withdraw Consent: You may withdraw consent for optional features at any time (for example, by disabling the AI Assistant toggle or removing your BYOK API key in Settings). To withdraw consent for core service processing, you may export your data and permanently delete your account in Profile Settings or contact privacy@monefin.web.id.",
          ],
        },
        {
          id: "subprocessors",
          number: "05",
          title: "Data Sharing & Sub-Processor Registry",
          callout: {
            type: "shield",
            title: "Commitment Not to Sell Personal Data",
            text: "We do not sell, rent, or trade your personal data or financial transaction records to commercial data brokers or advertising networks.",
          },
          paragraphs: [
            "To operate our application infrastructure, we engage third-party infrastructure providers (Data Processors / Sub-Processors) that process data strictly under our technical instructions or your direct opt-in configuration. Our sub-processors, their locations, and safeguards are listed below:",
          ],
        },
        {
          id: "cross-border-transfer",
          number: "06",
          title: "Cross-Border Data Transfers & Safeguards",
          paragraphs: [
            "Certain infrastructure sub-processors (such as Vercel's edge network, transactional OTP email delivery servers, Google OAuth, or the AI model provider you select via BYOK) operate servers outside the territory of the Republic of Indonesia (including Singapore, the United States, or the European Union).",
            "In accordance with Article 56 of UU PDP No. 27/2022, such cross-border transfers are carried out for contractual service execution and/or based on your explicit consent when activating the relevant integration, protected by technical safeguards including TLS 1.2+/1.3 transport encryption, payload minimization, and cryptographic key protection.",
          ],
        },
        {
          id: "ai-privacy",
          number: "07",
          title: "Artificial Intelligence Processing (AI Assistant & BYOK Receipt Scan)",
          callout: {
            type: "important",
            title: "Clear Separation: MoneFin vs. Upstream AI Providers (BYOK)",
            text: "MoneFin does not store your AI chat history in MoneFin's database. When you submit a prompt or receipt photo, the payload is transmitted to the AI provider corresponding to your configured BYOK API key.",
          },
          paragraphs: [
            "To avoid any ambiguity, here is the exact separation between what MoneFin stores and what upstream AI providers process:",
            "1. What MoneFin Stores and Processes: (a) Your BYOK API key is encrypted using AES-256-CBC before being stored in your user profile; (b) AI Assistant chat conversation history is NOT stored in MoneFin's database (0-day server retention)—up to 20 recent messages are held only in your browser tab's memory during an active session; (c) For Receipt Scanning, uploaded receipt photos are processed in memory for OCR extraction and are not saved to our storage unless you explicitly toggle on 'Save Receipt Image' when confirming the transaction.",
            "2. What Is Sent to Your Selected AI Provider: When you send a message to the AI Assistant, our backend transmits your prompt along with an aggregated financial context summary (account totals, budget summaries, and relevant transaction lines without your password) to the API endpoint of the provider you configured (Google Gemini, Groq, OpenAI, Anthropic, or OpenRouter).",
            "3. Is Data Used for Model Training by Upstream AI Providers? Because MoneFin uses a Bring Your Own Key (BYOK) architecture, data retention and model training policies at the AI provider depend on the API tier of your own API key. Paid/Enterprise API tiers at Google Gemini, OpenAI, Anthropic, and Groq generally enforce zero model training on API payloads, whereas free-tier API keys (such as Google AI Studio Free Tier) may be subject to provider review under their respective terms. We recommend using a Paid API Tier key if you require strict zero-training guarantees from your AI provider.",
          ],
        },
        {
          id: "storage-retention",
          number: "08",
          title: "Data Retention & Deletion Procedures",
          paragraphs: [
            "We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected:",
            "• Active Production Systems: Profile data and financial records are kept while your account remains active. When you delete individual transactions or accounts, they move to the in-app Trashbin so you can restore accidental deletions, or permanently purge (Force Delete) them at any time.",
            "• Permanent Account Deletion: When you delete your account via Profile Settings (verified by password re-authentication), all profile records, wallets, transactions, budgets, savings goals, split bills, and active session tokens are deleted immediately from our active production database.",
            `• Encrypted Backups & Server Logs: Residual copies residing in encrypted daily database backups and server security logs are automatically overwritten and purged within a maximum rotation cycle of ${COMPLIANCE_FACTS.backupRetentionDays} (thirty) calendar days.`,
          ],
        },
        {
          id: "security-reference",
          number: "09",
          title: "Personal Data Security",
          paragraphs: [
            "We protect your personal data using layered technical controls including TLS 1.2+/1.3 transport encryption (HTTPS), Bcrypt password hashing, SHA-256 session token hashing, AES-256-CBC encryption for BYOK API keys, and row-level ownership validation on every API request.",
            "To maintain a single source of truth and avoid technical duplication, full details on our security architecture, control status matrix, HTTP security headers, and vulnerability disclosure program are available on our Security Standards page (/security).",
          ],
        },
        {
          id: "data-subject-rights",
          number: "10",
          title: "Data Subject Rights & Fulfillment Timelines (UU PDP Chapter IV)",
          paragraphs: [
            "As a Data Subject under Articles 5 through 13 of Indonesia's UU PDP No. 27/2022, you have the following rights and self-service mechanisms:",
            "1. Right to Information & Access: View your stored personal and financial data at any time via the Dashboard and Profile Settings.",
            "2. Right to Rectification (Correction): Edit and update your profile, account balances, and transactions directly in the app (or via written request, fulfilled within 3×24 hours of identity verification pursuant to UU PDP).",
            "3. Right to Data Portability: Download a copy of your transaction history and financial summaries in structured CSV format via the Transactions and Reports pages.",
            "4. Right to Erasure ('Right to be Forgotten'): Permanently delete your account and active records directly via Profile Settings.",
            "5. Right to Withdraw Consent, Restrict Processing, & Object to Automated Decision-Making: Disable optional features at any time, request processing restrictions, or object to automated decisions (note: MoneFin does not perform automated credit scoring or profiling that produces legal effects).",
            `Fulfillment Timeline: Self-service tools execute immediately inside the application. For requests submitted via email to ${COMPLIANCE_FACTS.contacts.privacy.email}, we acknowledge receipt within 3 business days and complete fulfillment within 72 hours (for rectification under UU PDP) up to a maximum of 30 calendar days for complex requests.`,
          ],
        },
        {
          id: "children-privacy",
          number: "11",
          title: "Children's Privacy",
          paragraphs: [
            `MoneFin Services are intended for users who are at least ${COMPLIANCE_FACTS.minAgeYears} (eighteen) years of age or legally emancipated/married under Indonesian law.`,
            "Pursuant to Article 25 of UU PDP No. 27/2022, processing personal data of a child (under 18 years old) requires verifiable consent from the child's parent or legal guardian. We do not knowingly collect personal data from individuals under 18 without parental/guardian consent. If a parent or guardian becomes aware that a minor has created an account without their consent, please contact privacy@monefin.web.id so we can verify and promptly purge the account.",
          ],
        },
        {
          id: "cookies-tokens",
          number: "12",
          title: "Cookies, Authentication Tokens, & Browser Local Storage",
          paragraphs: [
            "MoneFin does not use third-party cross-site advertising cookies or tracking pixels. We use only essential session cookies and browser storage (localStorage / sessionStorage) required to maintain authentication state, remember UI preferences, and cache responses locally.",
            "A complete inventory of cookies and local storage keys used by MoneFin is provided in the table below:",
          ],
        },
        {
          id: "incident-notification",
          number: "13",
          title: "Personal Data Breach Notification",
          paragraphs: [
            `In the event of a personal data breach (failure of personal data protection resulting in unauthorized disclosure of personal data on our systems), MoneFin commits to providing written notification no later than 3×24 hours (${COMPLIANCE_FACTS.incidentNotificationHours} hours) after verified discovery to affected Data Subjects and the relevant data protection authority pursuant to Article 46 of UU PDP No. 27/2022.`,
            "Such written notification will specify at a minimum: (a) the categories of personal data affected, (b) when and how the breach occurred, (c) containment and remediation measures taken by MoneFin, and (d) recommended protective steps for Users along with our incident response contact point.",
          ],
        },
        {
          id: "policy-changes",
          number: "14",
          title: "Changes to This Privacy Policy & Version History",
          paragraphs: [
            "This Privacy Policy is reviewed periodically at least every 6 (six) months or whenever new features, sub-processors, or regulatory requirements are introduced.",
            `Material changes will be announced at least ${COMPLIANCE_FACTS.noticeAdvanceDays} calendar days prior to taking effect via registered email and an in-app banner. Previous revisions are logged in the Public Changelog section at the bottom of this page.`,
          ],
        },
        {
          id: "dpo-contact",
          number: "15",
          title: "DPO Contact & Right to Lodge a Complaint with Authorities",
          paragraphs: [
            "If you have questions regarding this Privacy Policy, wish to exercise your Data Subject Rights, or wish to raise a privacy concern, please contact our Data Protection Officer (DPO) / Privacy Team:",
            `• Privacy & DPO Email: ${COMPLIANCE_FACTS.contacts.privacy.email} (${COMPLIANCE_FACTS.contacts.privacy.sla.en})`,
            "• Right to Lodge a Complaint with the Supervisory Authority: If you believe your personal data protection rights under Law No. 27 of 2022 (UU PDP) have not been adequately addressed by us, you have the right to lodge an official complaint with the Indonesian Personal Data Protection Authority (Lembaga Pelindungan Data Pribadi / Ministry of Communication and Digital Affairs — Komdigi RI).",
          ],
        },
      ],
    },

    // =========================================================================
    // C. SECURITY STANDARDS (12 Mandatory Sections)
    // =========================================================================
    security: {
      title: "Security Standards & Protection Architecture",
      subtitle:
        "Verifiable, transparent documentation of MoneFin's application security controls, cryptography, ledger integrity, and coordinated vulnerability disclosure program.",
      badge: "Guided by OWASP ASVS · NIST SP 800-63B · ISO/IEC 27002",
      version: COMPLIANCE_FACTS.versionLabel.en,
      effectiveDate: COMPLIANCE_FACTS.effectiveDate.en,
      updatedDate: COMPLIANCE_FACTS.updatedDate.en,
      owner: COMPLIANCE_FACTS.documentOwner.en,
      contactRole: COMPLIANCE_FACTS.contacts.security,
      summaryPoints: [
        "This document describes the security controls verifiably active in MoneFin today; we reference OWASP ASVS, NIST SP 800-63B, and ISO/IEC 27002 as engineering guidance frameworks (not claims of third-party certification).",
        "Every API request reading or mutating financial records is validated for user ownership at the data layer and backed by automated authorization tests.",
        "Passwords are hashed with Bcrypt, 'mnf_' session tokens are hashed with SHA-256, BYOK API keys are encrypted with AES-256-CBC, and transport is protected via TLS 1.2+/1.3 and HSTS.",
        "Account balance mutations execute inside ACID database transactions with pessimistic row-level locking (SELECT ... FOR UPDATE) to prevent race conditions.",
        "We maintain a Coordinated Vulnerability Disclosure policy aligned with ISO/IEC 29147 and RFC 9116 (/.well-known/security.txt) offering Safe Harbor and a 3-business-day acknowledgment SLA.",
      ],
      sections: [
        {
          id: "scope-principles",
          number: "01",
          title: "Scope, Security Principles, & Reference Frameworks",
          callout: {
            type: "important",
            title: "Verifiable Claims & Guidance Framework Clarification",
            text: "MoneFin uses OWASP Application Security Verification Standard (ASVS), NIST SP 800-63B, ISO/IEC 27002, and ISO/IEC 29147 as internal engineering guidelines. Referencing these standards indicates the technical practices we follow, not a claim that MoneFin holds third-party audit certifications.",
          },
          paragraphs: [
            "This Security Standards document covers the MoneFin web frontend, backend REST/streaming APIs, relational database, and third-party integration workflows. Our security architecture is built on three core principles:",
            "1. Least Privilege: Every user session, API token, and service component operates with the minimum privileges required to perform its authorized task.",
            "2. Defense in Depth: Security relies on overlapping controls across transport encryption (TLS/HSTS), rate limiting, cryptographic token validation, schema validation, ownership authorization, and database transaction locks.",
            "3. Secure by Default: Optional third-party integrations (such as BYOK AI Assistant and receipt photo storage) are disabled by default until explicitly enabled by the user.",
            "The table below summarizes the current implementation status of MoneFin's security controls (Active / Partial / Roadmap):",
          ],
        },
        {
          id: "security-governance",
          number: "02",
          title: "Information Security Governance",
          paragraphs: [
            `Information security governance at MoneFin is overseen by the ${COMPLIANCE_FACTS.documentOwner.en}, which is responsible for access control policies, architectural security reviews, maintaining our internal compliance facts registry, and managing incident and vulnerability response.`,
            "All production code changes undergo dependency checks, static build verification, and automated test execution prior to deployment. Security documentation is reviewed at least every 6 (six) months or upon introducing new features or vendors.",
          ],
        },
        {
          id: "authorization-isolation",
          number: "03",
          title: "Authorization & Cross-User Data Isolation",
          paragraphs: [
            "In multi-tenant financial applications, Broken Object Level Authorization (BOLA / IDOR) is a primary risk requiring systematic mitigation. MoneFin designs every read, create, update, and delete operation to be strictly scoped to the authenticated user's identity.",
            "Every request referencing a resource identifier (such as an account/wallet, category, transaction, budget, savings goal, or split bill) is verified for ownership at the database query and validation rule layers before execution. We maintain automated authorization tests in our internal test suite to verify that cross-user access attempts are rejected.",
          ],
        },
        {
          id: "authentication-sessions",
          number: "04",
          title: "Authentication, Password Policy, & Session Management",
          paragraphs: [
            "Guided by NIST SP 800-63B digital identity recommendations, MoneFin implements the following authentication and session controls:",
            "• Password Policy: Requires a minimum length of 8 characters without forcing arbitrary character composition rules that reduce entropy, and without mandatory periodic password rotation unless compromise is suspected.",
            "• CSPRNG OTP Generation: 6-digit One-Time Passwords for email verification, 2FA, and password recovery are generated using a Cryptographically Secure Pseudo-Random Number Generator (CSPRNG random_int()) with a 5-minute expiration and repeated-attempt cooldown penalties.",
            "• Anti-Email Enumeration: Password recovery and OTP resend endpoints return uniform responses so external actors cannot probe which email addresses are registered.",
            "• Two-Factor Authentication (2FA): MoneFin currently provides Email OTP 2FA that users can enable in Security Settings. Authenticator app TOTP (RFC 6238) and WebAuthn/Passkeys support are on our development Roadmap.",
            "• Device Session Management & Re-Authentication: Users can inspect active login sessions (browser/OS User-Agent, last active timestamp, and device IP address) and remotely revoke other device sessions. High-risk operations such as permanent account deletion require password re-authentication.",
          ],
        },
        {
          id: "cryptography",
          number: "05",
          title: "Cryptography: In-Transit, At-Rest, & Key Management",
          paragraphs: [
            "We apply verifiable, industry-standard cryptographic algorithms across our production stack:",
            "1. Protection In-Transit: All client-to-server communications are encrypted over HTTPS (TLS 1.2 minimum, with TLS 1.3 prioritized) enforced via Strict-Transport-Security (HSTS). Outbound backend calls to AI provider APIs enforce strict SSL/TLS certificate validation.",
            "2. Password & Session Token Hashing: User passwords are hashed one-way using Bcrypt with a unique per-user salt. Session access tokens prefixed with 'mnf_' are stored in the database as one-way SHA-256 hashes; the raw token is transmitted only once upon authentication.",
            "3. BYOK API Key Encryption (At-Rest): User-supplied AI API keys are encrypted at the application layer using AES-256-CBC (OpenSSL with Message Authentication Code / MAC verification) prior to database storage. Application encryption keys are isolated in restricted server environment variables.",
            "4. Infrastructure Storage Encryption: Physical media/disk and backup storage encryption is managed by our underlying cloud data center providers.",
          ],
        },
        {
          id: "api-security-headers",
          number: "06",
          title: "Application, API Security, & HTTP Security Headers",
          paragraphs: [
            "To mitigate risks outlined in the OWASP Top 10 and OWASP API Security Top 10, MoneFin enforces the following controls:",
            "• Strict Schema Validation & Parameterized Queries: All user inputs are validated for data type, length, and format server-side. Database interactions use parameterized queries (prepared statements) to mitigate SQL injection.",
            "• Tiered Rate Limiting: Sensitive routes enforce per-IP and per-user request throttling (covering login attempts, OTP dispatch, receipt OCR scans, and AI chat streams).",
            "• SSRF Protection on Custom AI Endpoints: When users configure a custom BYOK AI endpoint URL, our validator enforces HTTPS and blocks private/loopback/link-local IP ranges to prevent Server-Side Request Forgery (SSRF).",
            "• HTTP Security Headers (Aligned with OWASP Secure Headers Project): We have removed the deprecated X-XSS-Protection header and rely on Content-Security-Policy alongside modern browser defense headers whose values are identical between this documentation and our live server configuration, as shown below:",
          ],
        },
        {
          id: "financial-integrity",
          number: "07",
          title: "Financial Data Integrity: ACID Transactions & Row Locking",
          paragraphs: [
            "Balance calculation accuracy is critical in personal finance software. Unsynchronized concurrent requests can cause balance race conditions.",
            "In MoneFin, every operation that modifies an account balance—whether creating, updating, or deleting a transaction, confirming a scanned receipt, or depositing/withdrawing from a savings goal—executes inside an ACID-compliant database transaction (Atomicity, Consistency, Isolation, Durability).",
            "Prior to computing balance credits or debits, the system acquires a pessimistic row-level lock (SELECT ... FOR UPDATE) on the target account row until the transaction commits. If any step fails, the entire transaction rolls back automatically to preserve balance consistency.",
          ],
        },
        {
          id: "infrastructure-backup",
          number: "08",
          title: "Infrastructure, Security Logging, & Backups",
          paragraphs: [
            "• Hosting Infrastructure & Certification Clarification: The web frontend is hosted on Vercel Inc.'s edge network, while the backend API and relational database run on isolated cloud server infrastructure. Data center certifications such as ISO/IEC 27001 and SOC 2 belong to those third-party cloud infrastructure providers, not to the MoneFin entity itself.",
            `• Security Logging: Our system logs key security events (such as repeated authentication failures, session creation/revocation, and system exceptions) without logging plaintext passwords or raw API keys. Security logs are retained for a maximum of ${COMPLIANCE_FACTS.backupRetentionDays} calendar days.`,
            `• Backup & Recovery Policy: Production databases are backed up daily to isolated encrypted storage with a maximum retention period of ${COMPLIANCE_FACTS.backupRetentionDays} calendar days, accompanied by periodic restoration testing to support service continuity.`,
          ],
        },
        {
          id: "vendor-security",
          number: "09",
          title: "Vendor & Sub-Processor Security",
          paragraphs: [
            "We restrict third-party vendors strictly to essential infrastructure and user-enabled integrations. Prior to onboarding a vendor, we evaluate their security posture, transport encryption (HTTPS/TLS), and data minimization boundaries.",
            "The complete list of third-party processors and sub-processors used by MoneFin (identical to Privacy Policy Section 05) is presented below:",
          ],
        },
        {
          id: "incident-response",
          number: "10",
          title: "Incident Response & Notification Commitment (72 Hours)",
          paragraphs: [
            "MoneFin maintains a structured security incident response procedure covering four phases: (1) Detection & Triage, (2) Containment, (3) Eradication & Recovery, and (4) Post-Incident Review.",
            `Notification Commitment Under Article 46 of UU PDP No. 27/2022: In the event of a verified personal data breach affecting user data, we commit to sending written notification no later than 3×24 hours (${COMPLIANCE_FACTS.incidentNotificationHours} hours) after verification to affected Users and the competent data protection authority. The notice will include at a minimum: the affected data categories, timing and chronology of the incident, remediation measures taken, and our incident response contact (${COMPLIANCE_FACTS.contacts.security.email}).`,
          ],
        },
        {
          id: "vulnerability-disclosure",
          number: "11",
          title: "Coordinated Vulnerability Disclosure (ISO/IEC 29147 & RFC 9116)",
          callout: {
            type: "shield",
            title: "Safe Harbor & Active /.well-known/security.txt",
            text: "We invite security researchers to report vulnerabilities responsibly to security@monefin.web.id. Our machine-readable RFC 9116 policy is published at https://www.monefin.web.id/.well-known/security.txt.",
          },
          paragraphs: [
            "Aligned with ISO/IEC 29147 (Vulnerability Disclosure) and RFC 9116, MoneFin operates a coordinated vulnerability disclosure program under the following terms:",
            `• Reporting Channel & Response SLA: Submit detailed reports (reproduction steps, affected endpoints, and potential impact) to ${COMPLIANCE_FACTS.contacts.security.email}. We commit to sending an initial acknowledgment within 3 (three) business days and a technical triage assessment within 7 (seven) business days.`,
            "• Scope (In-Scope): The primary web application (https://www.monefin.web.id), the official MoneFin Android application, and MoneFin production API endpoints. (Out-of-Scope: social engineering/phishing against staff or users, volumetric Denial of Service / DDoS / automated spam, and vulnerabilities on third-party services outside our control).",
            "• Rules of Engagement: Researchers must use their own test accounts, must never access, view, modify, or delete data belonging to other users, must not degrade service availability, and must keep findings confidential until remediation is deployed.",
            "• Legal Safe Harbor: Consistent with Terms of Service Section 06, MoneFin will not pursue civil or criminal legal action, nor permanently ban test accounts of researchers who act in good faith and abide by the rules in this section.",
          ],
        },
        {
          id: "shared-responsibility",
          number: "12",
          title: "System Boundaries, Shared Responsibility, & Revision History",
          paragraphs: [
            "No software system can claim absolute immunity from all cyber risks. Protecting your financial records in MoneFin is a shared responsibility between our server-side controls and your device-level security practices:",
            "• Keep your smartphone, computer operating system, and web browser updated and protected by screen locks.",
            "• Use a strong, unique password for your MoneFin account (do not reuse passwords from other services).",
            "• Enable Two-Factor Authentication (2FA) in Security Settings and periodically review your active device sessions.",
            "• Safeguard your BYOK API keys and configure spending/quota limits within your AI provider dashboard.",
          ],
        },
      ],
    },
  },
};
