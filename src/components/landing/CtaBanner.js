import { CatalisButton } from "../ui/CatalisButton";

export const CtaBanner = ({ isLoggedIn }) => {
  return (
    <section className="relative z-10 py-14 sm:py-20 px-3 sm:px-4 bg-gradient-to-b from-white via-[#f0faf8] to-[#eaf4f2]">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 rounded-2xl sm:rounded-[3rem] p-6 sm:p-16 lg:p-20 text-center text-white space-y-6 sm:space-y-8 shadow-xl relative overflow-hidden border border-brand-400/20">
          
          {/* Ambient Background Particles */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 border border-white/15 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider backdrop-blur-md">
              100% Gratis Selamanya • Akses Instan
            </span>

            <h2 className="text-xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Mulai Perjalanan Kebebasan Finansial Anda Bersama MoneFin Hari Ini
            </h2>

            <p className="text-brand-100 text-xs sm:text-lg max-w-xl mx-auto font-normal">
              Dapatkan kendali penuh atas uang Anda dalam waktu kurang dari 2 menit. Registrasi cepat tanpa syarat rumit.
            </p>

            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <CatalisButton href={isLoggedIn ? "/dashboard" : "/register"} variant="primary" className="w-full sm:w-auto px-6 py-3 text-xs sm:text-base">
                <span>{isLoggedIn ? "Masuk ke Dashboard" : "Daftar Akun Gratis"}</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </CatalisButton>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
