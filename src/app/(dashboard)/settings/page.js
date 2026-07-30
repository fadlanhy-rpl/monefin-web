"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import SettingsTabs from "../../../components/settings/SettingsTabs";
import ProfileSection from "../../../components/settings/ProfileSection";
import SecuritySection from "../../../components/settings/SecuritySection";
import PreferencesSection from "../../../components/settings/PreferencesSection";
import DangerZoneSection from "../../../components/settings/DangerZoneSection";
import { CheckCircle2, AlertCircle, X, Settings } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";

export default function SettingsPage() {
  const { user, updatePassword } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Form State - Profile
  const [fullName, setFullName] = useState("Ahmad Maariz");
  const [email, setEmail] = useState("ahmad@example.com");
  const [phone, setPhone] = useState("+62 812 3456 7890");
  const [occupation, setOccupation] = useState("Software Engineer");
  const [bio, setBio] = useState("Fokus membangun dana darurat dan investasi jangka panjang.");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Form State - Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Form State - Preferences
  const [currency, setCurrency] = useState("IDR");
  const [language, setLanguage] = useState("id");
  const [emailNotif, setEmailNotif] = useState(true);
  const [txAlert, setTxAlert] = useState(true);
  const [budgetAlert, setBudgetAlert] = useState(true);
  const [theme, setTheme] = useState("light");

  // Modal & Toast State
  const [toastMessage, setToastMessage] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleAvatarChange = () => {
    showToast("Membuka dialog pemilihan foto profil...");
  };

  const handleSaveProfile = () => {
    showToast("Profil berhasil diperbarui.");
  };

  const handleCancelProfile = () => {
    setFullName("Ahmad Maariz");
    setEmail("ahmad@example.com");
    setPhone("+62 812 3456 7890");
    setOccupation("Software Engineer");
    setBio("Fokus membangun dana darurat dan investasi jangka panjang.");
    showToast("Perubahan profil dibatalkan.");
  };

  const handleSavePassword = async () => {
    // Validasi input
    if (user?.has_password && !currentPassword) {
      showToast("Harap masukkan Password Saat Ini.");
      return;
    }
    if (newPassword.length < 8) {
      showToast("Password baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Konfirmasi password tidak cocok!");
      return;
    }

    const payload = {
      new_password: newPassword,
      new_password_confirmation: confirmPassword
    };

    if (user?.has_password) {
      payload.current_password = currentPassword;
    }

    const result = await updatePassword(payload);

    if (result.success) {
      showToast(user?.has_password ? "Password akun berhasil diperbarui." : "Password berhasil dibuat.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      showToast(result.error || "Gagal memperbarui password.");
    }
  };

  const handleForgotPassword = () => {
    showToast("Instruksi reset password telah dikirim ke email Anda.");
  };

  const handleSavePreferences = () => {
    showToast("Preferensi aplikasi berhasil disimpan.");
  };

  const handleConfirmDelete = () => {
    setDeleteModalOpen(false);
    showToast("Permintaan penghapusan akun telah diproses.");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 min-w-0 pb-10">
        
        {/* Header Section */}
        <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3`}>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Pengaturan Akun</h1>
              <Settings className="w-5 h-5 text-[#00685F] hidden sm:block" />
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">Kelola profil, keamanan, notifikasi, dan preferensi aplikasi MoneFin Anda</p>
          </div>
        </div>

        {/* Navigation Tabs (Profil Saya, Keamanan, Preferensi, Hapus Akun) */}
        <div className={`transition-all duration-700 delay-75 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <SettingsTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Tab 1: Profil Saya */}
        {activeTab === "profile" && (
          <div className={`transition-all duration-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <ProfileSection 
              fullName={fullName}
              setFullName={setFullName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              occupation={occupation}
              setOccupation={setOccupation}
              bio={bio}
              setBio={setBio}
              avatarUrl={avatarUrl}
              onAvatarChange={handleAvatarChange}
              onSave={handleSaveProfile}
              onCancel={handleCancelProfile}
            />
          </div>
        )}

        {/* Tab 2: Keamanan Akun */}
        {activeTab === "security" && (
          <div className={`transition-all duration-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <SecuritySection 
              user={user}
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              onSavePassword={handleSavePassword}
              onForgotPassword={handleForgotPassword}
            />
          </div>
        )}

        {/* Tab 3: Preferensi & Notifikasi */}
        {activeTab === "preferences" && (
          <div className={`transition-all duration-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <PreferencesSection 
              currency={currency}
              setCurrency={setCurrency}
              language={language}
              setLanguage={setLanguage}
              emailNotif={emailNotif}
              setEmailNotif={setEmailNotif}
              txAlert={txAlert}
              setTxAlert={setTxAlert}
              budgetAlert={budgetAlert}
              setBudgetAlert={setBudgetAlert}
              theme={theme}
              setTheme={setTheme}
              onSave={handleSavePreferences}
            />
          </div>
        )}

        {/* Tab 4: Danger Zone - Hapus Akun */}
        {activeTab === "danger" && (
          <div className={`transition-all duration-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <DangerZoneSection 
              onDeleteAccount={() => setDeleteModalOpen(true)}
            />
          </div>
        )}

      </div>

      {/* Delete Account Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setDeleteModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center text-red-600 shadow-inner">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Konfirmasi Hapus Akun</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Apakah Anda benar-benar yakin ingin menghapus akun MoneFin secara permanen? Seluruh riwayat transaksi, laporan, dan riwayat finansial Anda akan dihapus selamanya.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 bg-slate-100 text-slate-700 font-extrabold py-3 rounded-2xl text-xs hover:bg-slate-200 transition cursor-pointer select-none"
              >
                Batal
              </button>
              <button 
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 text-white font-extrabold py-3 rounded-2xl text-xs hover:bg-red-700 transition shadow-md shadow-red-500/20 cursor-pointer select-none"
              >
                Ya, Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Toast Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-5 duration-300 z-50 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </DashboardLayout>
  );
}
