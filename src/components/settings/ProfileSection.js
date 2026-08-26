"use client";

import { Camera, Check, User, Mail, Briefcase, Phone, FileText } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function ProfileSection({
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  occupation,
  setOccupation,
  bio,
  setBio,
  avatarUrl,
  onAvatarChange,
  onSave,
  onCancel
}) {
  const { t } = useLanguage();

  return (
    <div className="bg-white p-5 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 sm:gap-8 lg:gap-12 hover:shadow-md transition-all duration-300">
      
      {/* Left Avatar Upload Box */}
      <div className="flex flex-col items-center shrink-0">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 group select-none">
          <img 
            src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=00685F&color=fff&size=256`} 
            alt="Profile Avatar" 
            className="w-full h-full object-cover rounded-[1.8rem] sm:rounded-[2.2rem] border-4 border-slate-50 shadow-md group-hover:scale-[1.02] transition-transform duration-300"
          />
          <input
            type="file"
            id="avatarUpload"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onAvatarChange(e.target.files[0]);
              }
            }}
          />
          <button 
            type="button"
            onClick={() => document.getElementById('avatarUpload').click()}
            title="Ubah Foto Profil"
            className="absolute -bottom-2 -right-2 w-9 h-9 sm:w-11 sm:h-11 bg-[#00685F] text-white rounded-xl sm:rounded-2xl flex items-center justify-center border-4 border-white shadow-lg hover:bg-[#004D46] transition-all hover:scale-110 active:scale-95 cursor-pointer"
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="mt-3 text-center">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">{t("settings.format_jpg_png")}</span>
          <span className="text-[10px] text-slate-400 font-semibold">{t("settings.max_size")}</span>
        </div>
      </div>

      {/* Right Form Inputs */}
      <div className="flex-1 space-y-5 min-w-0">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{t("settings.personal_info")}</h2>
          <p className="text-xs text-slate-400">{t("settings.personal_info_desc")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#00685F]" />
              <span>{t("settings.full_name")}</span>
            </label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama lengkap Anda"
              className="w-full bg-slate-50 border border-slate-200/70 rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-semibold focus:border-[#00685F] focus:bg-white focus:ring-4 focus:ring-[#00685F]/10 outline-none text-slate-800 transition-all"
            />
          </div>

          {/* Email Address with Safe Verified Badge */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-[#00685F]" />
                <span>{t("settings.email_address")}</span>
              </label>
              <span className="bg-emerald-50 text-emerald-700 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md border border-emerald-200/60 flex items-center gap-1 shrink-0 select-none">
                <Check className="w-3 h-3 text-emerald-600" />
                {t("settings.verified")}
              </span>
            </div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alamat@email.com"
              className="w-full bg-slate-50 border border-slate-200/70 rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-semibold focus:border-[#00685F] focus:bg-white focus:ring-4 focus:ring-[#00685F]/10 outline-none text-slate-800 transition-all"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#00685F]" />
              <span>{t("settings.phone_number")}</span>
            </label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+62 812 3456 7890"
              className="w-full bg-slate-50 border border-slate-200/70 rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-semibold focus:border-[#00685F] focus:bg-white focus:ring-4 focus:ring-[#00685F]/10 outline-none text-slate-800 transition-all"
            />
          </div>

          {/* Occupation */}
          <div className="space-y-1.5">
            <label className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#00685F]" />
              <span>{t("settings.occupation")}</span>
            </label>
            <input 
              type="text" 
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="Profesi atau Pekerjaan"
              className="w-full bg-slate-50 border border-slate-200/70 rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-semibold focus:border-[#00685F] focus:bg-white focus:ring-4 focus:ring-[#00685F]/10 outline-none text-slate-800 transition-all"
            />
          </div>


        </div>

        {/* Short Bio */}
        <div className="space-y-1.5">
          <label className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#00685F]" />
            <span>{t("settings.short_bio")}</span>
          </label>
          <textarea
            rows="2"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={t("settings.bio_placeholder")}
            className="w-full bg-slate-50 border border-slate-200/70 rounded-2xl px-4 py-3 sm:px-5 sm:py-3 text-xs sm:text-sm font-semibold focus:border-[#00685F] focus:bg-white focus:ring-4 focus:ring-[#00685F]/10 outline-none text-slate-800 transition-all resize-none"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 sm:gap-4 pt-4 border-t border-slate-100">
          <button 
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer px-5 py-2.5 rounded-xl hover:bg-slate-100 select-none text-center"
          >
            {t("common.cancel")}
          </button>
          <button 
            type="button"
            onClick={onSave}
            className="w-full sm:w-auto bg-[#00685F] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold hover:bg-[#004D46] transition-all shadow-md shadow-[#00685F]/20 active:scale-95 cursor-pointer text-center select-none"
          >
            {t("common.save")}
          </button>
        </div>

      </div>
    </div>
  );
}
