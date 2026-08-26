import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Syarat & Ketentuan | MoneFin",
  description: "Syarat & Ketentuan Penggunaan MoneFin",
};

export default function TermsPage() {
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
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Syarat & Ketentuan</h1>
              <p className="text-slate-500 mt-1 font-medium">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
            </div>
          </div>
          
          <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
            <p>
              Selamat datang di MoneFin. Dengan mengakses atau menggunakan aplikasi kami, Anda setuju untuk terikat oleh Syarat dan Ketentuan berikut. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan kami.
            </p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">1. Penggunaan Layanan</h2>
            <p>
              MoneFin adalah platform pencatatan dan pengelolaan keuangan pribadi. Anda bertanggung jawab penuh atas keakuratan data yang Anda masukkan dan menjaga kerahasiaan kredensial login Anda.
            </p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">2. Hak Milik Intelektual</h2>
            <p>
              Semua konten, desain, grafis, dan kode yang ada di dalam aplikasi MoneFin merupakan hak milik MoneFin. Dilarang keras untuk menyalin, mereproduksi, atau menggunakan bagian mana pun tanpa izin tertulis dari kami.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">3. Batasan Tanggung Jawab</h2>
            <p>
              Meskipun kami berusaha keras untuk menjaga keamanan dan keakuratan aplikasi, MoneFin tidak bertanggung jawab atas kerugian langsung atau tidak langsung yang mungkin timbul dari kesalahan data, gangguan sistem, atau penggunaan aplikasi secara tidak semestinya oleh pengguna.
            </p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">4. Perubahan Syarat</h2>
            <p>
              Kami berhak mengubah atau memperbarui Syarat & Ketentuan ini kapan saja. Perubahan akan berlaku segera setelah dipublikasikan di halaman ini. Kami akan berusaha memberitahu pengguna tentang pembaruan yang signifikan.
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
