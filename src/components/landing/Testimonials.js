export const Testimonials = () => {
  const testimonials = [
    {
      name: "Rian Prasetya",
      role: "Software Engineer",
      avatar: "RP",
      quote: "MoneFin mengubah cara saya mengelola keuangan bulanan. Fitur alokasi otomatis membuat gaji saya langsung terbagi rapi tanpa harus bikin tabel Excel rumit.",
      metric: "Hemat Rp 3.2M / Bln",
    },
    {
      name: "Siti Rahmawati",
      role: "Freelance Designer",
      avatar: "SR",
      quote: "Sebagai freelancer dengan penghasilan fluktuatif, fitur Multi-Account MoneFin membantu saya memisahkan dana operasional dan tabungan darurat secara disiplin.",
      metric: "Dana Darurat Ternutrisi",
    },
    {
      name: "Budi Santoso",
      role: "Pemilik Coffee Shop",
      avatar: "BS",
      quote: "Analisis cashflow harian MoneFin sangat cepat dan akurat. Saya bisa melihat grafik keuangan kas usaha dan pribadi dalam satu dashboard serba praktis.",
      metric: "Efisiensi 85%",
    },
    {
      name: "Amanda Lestari",
      role: "Mahasiswa Akhir",
      avatar: "AL",
      quote: "Aplikasi 100% gratis tapi fiturnya terasa premium sekali! Tampilannya bersih, tanpa iklan mengganggu, dan sangat mudah dipakai walau baru belajar pencatatan.",
      metric: "100% Disiplin Budget",
    },
    {
      name: "Fajar Nugraha",
      role: "Product Manager",
      avatar: "FN",
      quote: "Simulasi Wealth jangka panjangnya terbukti membantu saya dan istri menentukan target DP rumah pertama. Sangat merekomendasikan MoneFin untuk pasangan muda!",
      metric: "Target Terpola",
    },
  ];

  return (
    <section id="testimonials" className="relative z-10 py-16 sm:py-24 bg-gradient-to-b from-white via-[#e8f4f2]/70 to-[#f4faf9] border-b border-slate-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-8 sm:mb-12 text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow-xs">
          <svg className="w-3.5 h-3.5 text-brand-600" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>Pengalaman Pengguna</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-snug">
          Dipercaya oleh Ribuan Individu untuk <em className="catalis-heading-italic text-brand-600">Hidup Lebih Tenang</em>
        </h2>
      </div>

      {/* Infinite Horizontal Marquee */}
      <div className="marquee-mask relative w-full overflow-hidden py-2">
        <div className="animate-marquee flex gap-4 sm:gap-6">
          {[...testimonials, ...testimonials].map((item, idx) => (
            <div
              key={idx}
              className="catalis-card w-[240px] sm:w-96 shrink-0 bg-white/90 border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                    {item.avatar}
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{item.name}</p>
                    <p className="text-[10px] text-slate-500">{item.role}</p>
                  </div>
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">
                "{item.quote}"
              </p>
              <div className="flex text-amber-400 gap-0.5 text-[10px] sm:text-xs">
                {"★".repeat(5)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
