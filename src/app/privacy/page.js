import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Kebijakan Privasi | MoneFin",
  description: "Kebijakan Privasi MoneFin",
};

export default function PrivacyPage() {
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
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Kebijakan Privasi</h1>
              <p className="text-slate-500 mt-1 font-medium">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
            </div>
          </div>
          
          <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
            <p>
              Di MoneFin, kami sangat menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan menjaga informasi Anda saat menggunakan platform kami.
            </p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">1. Informasi yang Kami Kumpulkan</h2>
            <p>
              Kami mengumpulkan informasi yang Anda berikan secara langsung saat membuat akun, seperti nama, alamat email, dan data keuangan yang Anda masukkan untuk keperluan pencatatan transaksi. Kami juga dapat mengumpulkan data perangkat dan log aktivitas untuk tujuan keamanan.
            </p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">2. Bagaimana Kami Menggunakan Informasi Anda</h2>
            <p>
              Data Anda digunakan semata-mata untuk menyediakan fitur aplikasi MoneFin (misalnya kalkulasi portofolio, analisis pengeluaran), meningkatkan layanan kami, serta menjaga keamanan akun dari akses yang tidak sah.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">3. Keamanan Data</h2>
            <p>
              Kami menggunakan berbagai langkah keamanan seperti enkripsi standar industri dan otentikasi dua faktor (2FA) untuk memastikan data Anda aman dari kebocoran atau akses ilegal. Kami tidak menjual data Anda kepada pihak ketiga.
            </p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">4. Hubungi Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan mengenai kebijakan privasi kami, silakan hubungi tim dukungan kami melalui <strong>support@monefin.com</strong>.
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
