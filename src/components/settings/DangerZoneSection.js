import { AlertTriangle } from "lucide-react";

export default function DangerZoneSection({ onDeleteAccount }) {
  return (
    <div className="bg-red-50/50 p-6 lg:p-8 rounded-[2.5rem] border border-red-100 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-red-600 leading-none">Hapus Akun</h2>
          <p className="text-xs text-red-400 font-medium mt-1">Tindakan ini permanen. Semua data finansial Anda akan dihapus selamanya.</p>
        </div>
      </div>
      <button 
        onClick={onDeleteAccount}
        className="w-full md:w-auto bg-white text-red-600 border border-red-200 px-8 py-3 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition shadow-sm cursor-pointer text-xs active:scale-95 shrink-0"
      >
        Hapus Selamanya
      </button>
    </div>
  );
}
