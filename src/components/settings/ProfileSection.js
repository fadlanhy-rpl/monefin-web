"use client";

import { useState } from "react";
import { Camera, Check, User, Mail, Briefcase, Phone, FileText, Sparkles, RotateCcw } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import ImageCropperModal from "./ImageCropperModal";

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
  onCancel,
  isSaving = false
}) {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const [cropperOpen, setCropperOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read file as data URL for cropper preview
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImageSrc(reader.result);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);

    // Reset input so user can re-select the same image if needed
    e.target.value = "";
  };

  const handleCropComplete = (croppedFile) => {
    if (onAvatarChange) {
      onAvatarChange(croppedFile);
    }
  };

  return (
    <div className="bg-white p-5 sm:p-7 md:p-9 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-6 sm:gap-8 lg:gap-12 transition-all duration-300">
      
      {/* Left Avatar Upload Box */}
      <div className="flex flex-col items-center md:items-start shrink-0">
        <div className="relative group select-none">
          <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-[1.8rem] sm:rounded-[2.2rem] overflow-hidden border-4 border-slate-100/90 shadow-md bg-slate-50 transition-transform duration-300 group-hover:scale-[1.01]">
            <img 
              src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=00685F&color=fff&size=256`} 
              alt={fullName ? `Avatar ${fullName}` : "Profile Avatar"} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=00685F&color=fff&size=256`;
              }}
            />
          </div>
          <input
            type="file"
            id="avatarUpload"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileInputChange}
          />
          <button 
            type="button"
            onClick={() => document.getElementById('avatarUpload').click()}
            title={isEn ? "Change profile photo" : "Ubah Foto Profil"}
            aria-label={isEn ? "Change profile photo" : "Ubah Foto Profil"}
            className="absolute -bottom-2 -right-2 w-10 h-10 sm:w-11 sm:h-11 bg-[#00685F] text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-lg hover:bg-[#004D46] hover:scale-110 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685F]"
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="mt-3.5 text-center md:text-left space-y-1">
          <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
            {t("settings.format_jpg_png") || "JPG, PNG ATAU WEBP"}
          </span>
          <p className="text-[11px] text-slate-400 font-medium">
            {t("settings.max_size") || "Ukuran maksimal 5MB"}
          </p>
          <div className="pt-1.5 flex justify-center md:justify-start">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-50/90 border border-teal-200/70 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-[#00685F]" />
              <span>{isEn ? "Crop tool enabled" : "Crop foto aktif"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right Form Inputs */}
      <div className="flex-1 space-y-6 min-w-0">
        
        {/* Header Title inside section */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {t("settings.personal_info")}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            {t("settings.personal_info_desc")}
          </p>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] sm:text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#00685F]" />
              <span>{t("settings.full_name")}</span>
            </label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isEn ? "Your full name" : "Nama lengkap Anda"}
              className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-4 py-3 sm:px-4.5 sm:py-3.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#00685F] focus:ring-4 focus:ring-[#00685F]/10 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Email Address with Verified Badge */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-[11px] sm:text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-[#00685F]" />
                <span>{t("settings.email_address")}</span>
              </label>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-lg border border-emerald-200/70 flex items-center gap-1 shrink-0 select-none shadow-2xs">
                <Check className="w-3 h-3 text-emerald-600" />
                {t("settings.verified")}
              </span>
            </div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alamat@email.com"
              className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-4 py-3 sm:px-4.5 sm:py-3.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#00685F] focus:ring-4 focus:ring-[#00685F]/10 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-[11px] sm:text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#00685F]" />
              <span>{t("settings.phone_number")}</span>
            </label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+62 812 3456 7890"
              className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-4 py-3 sm:px-4.5 sm:py-3.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#00685F] focus:ring-4 focus:ring-[#00685F]/10 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Occupation */}
          <div className="space-y-1.5">
            <label className="text-[11px] sm:text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#00685F]" />
              <span>{t("settings.occupation")}</span>
            </label>
            <input 
              type="text" 
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder={isEn ? "e.g. Software Engineer, Designer" : "Profesi atau Pekerjaan"}
              className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-4 py-3 sm:px-4.5 sm:py-3.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#00685F] focus:ring-4 focus:ring-[#00685F]/10 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

        </div>

        {/* Short Bio */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] sm:text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#00685F]" />
              <span>{t("settings.short_bio")}</span>
            </label>
            <span className="text-[10px] text-slate-400 font-medium">
              {bio?.length || 0}/160
            </span>
          </div>
          <textarea
            rows="3"
            maxLength={160}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={t("settings.bio_placeholder") || "Tuliskan deskripsi singkat mengenai profil Anda..."}
            className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-4 py-3 sm:px-4.5 sm:py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#00685F] focus:ring-4 focus:ring-[#00685F]/10 outline-none transition-all placeholder:text-slate-400 resize-none leading-relaxed"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-4 border-t border-slate-100">
          <button 
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="w-full sm:w-auto min-h-[44px] text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer px-5 py-2.5 rounded-xl hover:bg-slate-100 select-none text-center flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>{t("common.cancel")}</span>
          </button>
          <button 
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="w-full sm:w-auto min-h-[44px] bg-[#00685F] text-white px-7 sm:px-8 py-3 rounded-2xl text-xs sm:text-sm font-extrabold hover:bg-[#004D46] transition-all shadow-md shadow-[#00685F]/20 active:scale-[0.98] cursor-pointer text-center select-none flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Check className="w-4 h-4 text-emerald-200" />
            <span>{t("common.save")}</span>
          </button>
        </div>

      </div>

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={selectedImageSrc}
        onClose={() => setCropperOpen(false)}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}

