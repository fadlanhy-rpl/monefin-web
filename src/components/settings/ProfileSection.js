import { Camera, ChevronDown } from "lucide-react";

export default function ProfileSection({
  fullName,
  setFullName,
  email,
  setEmail,
  occupation,
  setOccupation,
  currency,
  setCurrency,
  onSave,
  onCancel
}) {
  return (
    <div className="bg-white p-6 lg:p-10 rounded-[2.5rem] border border-gray-50 shadow-sm flex flex-col md:flex-row gap-8 lg:gap-16">
      {/* Avatar Upload */}
      <div className="relative w-32 h-32 lg:w-40 lg:h-40 shrink-0 mx-auto md:mx-0">
        <img 
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=00685F&color=fff&size=256`} 
          alt="Profile Avatar" 
          className="w-full h-full object-cover rounded-[2rem] border-4 border-white shadow-xl"
        />
        <button 
          title="Ubah Foto Profil"
          className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#00685F] text-white rounded-xl flex items-center justify-center border-4 border-white shadow-lg hover:bg-[#004D46] transition cursor-pointer"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      {/* Form Inputs */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
          <input 
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-[#00685F]/20 outline-none text-slate-800"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
          <div className="relative">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-[#00685F]/20 outline-none text-slate-800 pr-24"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider select-none">
              Verified
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Occupation</label>
          <input 
            type="text" 
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-[#00685F]/20 outline-none text-slate-800"
          />
        </div>

        <div className="space-y-2 relative">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preferred Currency</label>
          <select 
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-[#00685F]/20 outline-none appearance-none cursor-pointer text-slate-800"
          >
            <option value="IDR">IDR - Rupiah (Rp)</option>
            <option value="USD">USD - US Dollar ($)</option>
          </select>
          <div className="absolute right-4 bottom-4 pointer-events-none text-gray-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="md:col-span-2 flex justify-end items-center gap-4 sm:gap-6 pt-4">
          <button 
            type="button"
            onClick={onCancel}
            className="text-sm font-bold text-slate-400 hover:text-slate-600 transition cursor-pointer px-4 py-2"
          >
            Batal
          </button>
          <button 
            type="button"
            onClick={onSave}
            className="bg-[#00685F] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#004D46] transition shadow-lg shadow-[#00685F]/20 active:scale-95 cursor-pointer text-sm"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
