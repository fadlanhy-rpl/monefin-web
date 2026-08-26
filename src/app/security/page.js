import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export const metadata = {
  title: "Keamanan | MoneFin",
  description: "Keamanan Akun dan Data di MoneFin",
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#f4f7f6] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/login" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#00685F] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Link>
        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-12">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#00685F] shrink-0 border border-emerald-100">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Keamanan</h1>
              <p className="text-slate-500 mt-1 font-medium">Prioritas Utama Kami</p>
            </div>
          </div>
          
          <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
            <p>
              Di MoneFin, keamanan data keuangan Anda adalah prioritas mutlak. Kami merancang sistem kami dengan standar keamanan tinggi agar Anda dapat mencatat dan memantau keuangan Anda dengan tenang.
            </p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Mekanisme Keamanan Kami</h2>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Otentikasi Dua Faktor (2FA):</strong> Kami menyediakan fitur otentikasi dua langkah menggunakan OTP (One-Time Password) yang dikirimkan via email untuk mencegah login tidak sah bahkan jika kata sandi Anda bocor.
              </li>
              <li>
                <strong>Enkripsi Data:</strong> Data sensitif seperti kata sandi dienkripsi dengan standar industri (seperti bcrypt) di basis data kami. Data yang dikirimkan antara browser Anda dan server kami dilindungi dengan enkripsi TLS/SSL (HTTPS).
              </li>
              <li>
                <strong>Manajemen Sesi Aktif:</strong> Anda dapat memonitor perangkat dan lokasi mana saja yang sedang terhubung ke akun Anda. Anda juga dapat dengan mudah memutuskan (logout) sesi pada perangkat lain dari jarak jauh.
              </li>
              <li>
                <strong>Verifikasi Email:</strong> Semua akun baru diwajibkan melakukan verifikasi email untuk menghindari pendaftaran spam dan memastikan bahwa notifikasi penting selalu sampai ke Anda.
              </li>
              <li>
                <strong>Manajemen Sesi Otomatis:</strong> Sesi login Anda akan kedaluwarsa secara otomatis (token berbasis JWT) jika tidak ada aktivitas dalam waktu tertentu, untuk mencegah akses jika perangkat tertinggal tanpa pengawasan.
              </li>
            </ul>

            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Praktik Terbaik Pengguna</h2>
            <p>
              Meskipun kami berupaya keras melindungi Anda, keamanan juga bergantung pada Anda. Pastikan Anda menggunakan kombinasi huruf besar, huruf kecil, angka, dan simbol untuk password Anda. Jangan pernah membagikan password atau kode OTP kepada siapa pun, dan usahakan untuk tidak login di perangkat publik yang tidak tepercaya.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-8 text-sm text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} MoneFin Financial Services.
        </div>
      </div>
    </div>
  );
}
