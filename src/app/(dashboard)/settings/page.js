"use client";

import { useState, useEffect, Suspense } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import SettingsTabs from "../../../components/settings/SettingsTabs";
import ProfileSection from "../../../components/settings/ProfileSection";
import SecuritySection from "../../../components/settings/SecuritySection";
import PreferencesSection from "../../../components/settings/PreferencesSection";
import DangerZoneSection from "../../../components/settings/DangerZoneSection";
import AiSettingsSection from "../../../components/settings/AiSettingsSection";
import { CheckCircle2, AlertCircle, X, Settings } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useLanguage } from "../../../context/LanguageContext";
import { useSearchParams } from "next/navigation";

function SettingsContent() {
  const { user, updatePassword, updateProfile, deleteAccount } = useAuth();
  const { changeLanguage, language: currentGlobalLang, t } = useLanguage();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["profile", "security", "preferences", "ai", "danger"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Form State - Profile
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  // Form State - Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Form State - Preferences
  const [currency, setCurrency] = useState("IDR");
  const [language, setLanguage] = useState("en");
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

  const populateUserData = () => {
    if (user) {
      setFullName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setOccupation(user.occupation || "");
      setBio(user.bio || "");
      setAvatarUrl(user.photo ? `http://localhost:8000/storage/${user.photo}` : "");
      
      if (user.preferences) {
        setCurrency(user.preferences.currency || "IDR");
        setLanguage(user.preferences.language || "en");
        setEmailNotif(user.preferences.emailNotif ?? true);
        setTxAlert(user.preferences.txAlert ?? true);
        setBudgetAlert(user.preferences.budgetAlert ?? true);
        setTheme(user.preferences.theme || "light");
      }
    }
  };

  useEffect(() => {
    populateUserData();
  }, [user]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleAvatarChange = (file) => {
    setAvatarFile(file);
    setAvatarUrl(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("phone", phone);
    formData.append("occupation", occupation);
    formData.append("bio", bio);
    if (avatarFile) {
      formData.append("photo", avatarFile);
    }
    // Also include preferences so they are not lost
    const prefs = { currency, language, emailNotif, txAlert, budgetAlert, theme };
    formData.append("preferences", JSON.stringify(prefs));

    const result = await updateProfile(formData);
    if (result.success) {
      showToast("Profil berhasil diperbarui.");
    } else {
      showToast(result.error || "Gagal memperbarui profil.");
    }
  };

  const handleCancelProfile = () => {
    populateUserData();
    setAvatarFile(null);
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

  const handleSavePreferences = async () => {
    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("phone", phone);
    formData.append("occupation", occupation);
    formData.append("bio", bio);
    // Send updated preferences
    const prefs = { currency, language, txAlert, budgetAlert };
    formData.append("preferences", JSON.stringify(prefs));

    const result = await updateProfile(formData);
    if (result.success) {
      // Apply the language globally only after saving
      changeLanguage(language);
      showToast(language === 'en' ? "Application preferences successfully saved." : "Preferensi aplikasi berhasil disimpan.");
    } else {
      showToast(result.error || (language === 'en' ? "Failed to save preferences." : "Gagal menyimpan preferensi."));
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteModalOpen(false);
    
    // Show a loading toast
    showToast(language === 'en' ? "Deleting account..." : "Menghapus akun...");

    const result = await deleteAccount();
    if (result.success) {
      // The auth context will automatically clear session and redirect to /
      // No need to show toast because the page will redirect
    } else {
      showToast(result.error || (language === 'en' ? "Failed to delete account." : "Gagal menghapus akun."));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 min-w-0 pb-10">
        
        {/* Header Section */}
        <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3`}>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t("settings.title")}</h1>
              <Settings className="w-5 h-5 text-[#00685F] hidden sm:block" />
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">{t("settings.subtitle")}</p>
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
              txAlert={txAlert}
              setTxAlert={setTxAlert}
              budgetAlert={budgetAlert}
              setBudgetAlert={setBudgetAlert}
              onSave={handleSavePreferences}
            />
          </div>
        )}

        {/* Tab 4: AI Chatbot Settings */}
        {activeTab === "ai" && (
          <div className={`transition-all duration-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <AiSettingsSection onShowToast={showToast} />
          </div>
        )}

        {/* Tab 5: Danger Zone - Hapus Akun */}
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

export default function SettingsPage() {
  return (
    <Suspense fallback={<DashboardLayout><div className="flex items-center justify-center h-64 text-slate-400">Loading settings...</div></DashboardLayout>}>
      <SettingsContent />
    </Suspense>
  );
}
