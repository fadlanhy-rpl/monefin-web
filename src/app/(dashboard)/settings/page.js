"use client";

import { useState, Suspense } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import SettingsTabs from "../../../components/settings/SettingsTabs";
import ProfileSection from "../../../components/settings/ProfileSection";
import SecuritySection from "../../../components/settings/SecuritySection";
import PreferencesSection from "../../../components/settings/PreferencesSection";
import DangerZoneSection from "../../../components/settings/DangerZoneSection";
import AiSettingsSection from "../../../components/settings/AiSettingsSection";
import { CheckCircle2, AlertCircle, X, Settings, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useLanguage } from "../../../context/LanguageContext";
import { useSearchParams } from "next/navigation";

function SettingsContent() {
  const { user, updatePassword, updateProfile, deleteAccount } = useAuth();
  const { changeLanguage, language: currentGlobalLang, t } = useLanguage();
  const searchParams = useSearchParams();
  const isVisible = true;
  const tabParam = searchParams.get("tab");
  const initialTab = (tabParam && ["profile", "security", "preferences", "ai", "danger"].includes(tabParam)) ? tabParam : "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [prevTabParam, setPrevTabParam] = useState(tabParam);
  if (tabParam !== prevTabParam) {
    setPrevTabParam(tabParam);
    if (tabParam && ["profile", "security", "preferences", "ai", "danger"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }

  // Form State - Profile
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [occupation, setOccupation] = useState(user?.occupation || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(
    user?.photo ? (user.photo.startsWith("http") ? user.photo : `/api/avatar/${user.photo}`) : ""
  );
  const [avatarFile, setAvatarFile] = useState(null);

  // Form State - Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Form State - Preferences
  const [currency, setCurrency] = useState(user?.preferences?.currency || "IDR");
  const [language, setLanguage] = useState(currentGlobalLang || user?.preferences?.language || "id");
  const [emailNotif, setEmailNotif] = useState(user?.preferences?.emailNotif ?? true);
  const [txAlert, setTxAlert] = useState(user?.preferences?.txAlert ?? true);
  const [budgetAlert, setBudgetAlert] = useState(user?.preferences?.budgetAlert ?? true);
  const [showTutorialOnLogin, setShowTutorialOnLogin] = useState(user?.preferences?.showTutorialOnLogin ?? true);
  const [theme, setTheme] = useState(user?.preferences?.theme || "light");

  // Sync state if user changes
  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser) {
    setPrevUser(user);
    if (user) {
      setFullName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setOccupation(user.occupation || "");
      setBio(user.bio || "");
      const resolvedPhotoUrl = user.photo
        ? (user.photo.startsWith("http") ? user.photo : `/api/avatar/${user.photo}`)
        : "";
      setAvatarUrl(resolvedPhotoUrl);
      
      if (user.preferences) {
        setCurrency(user.preferences.currency || "IDR");
        const activeLang = currentGlobalLang || user.preferences.language || "id";
        setLanguage(activeLang);
        setEmailNotif(user.preferences.emailNotif ?? true);
        setTxAlert(user.preferences.txAlert ?? true);
        setBudgetAlert(user.preferences.budgetAlert ?? true);
        setShowTutorialOnLogin(user.preferences.showTutorialOnLogin ?? true);
        setTheme(user.preferences.theme || "light");
      }
    }
  }

  // Sync state if global language changes
  const [prevGlobalLang, setPrevGlobalLang] = useState(currentGlobalLang);
  if (currentGlobalLang && currentGlobalLang !== prevGlobalLang) {
    setPrevGlobalLang(currentGlobalLang);
    setLanguage(currentGlobalLang);
  }

  // Modal & Toast State
  const [toastMessage, setToastMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletePasswordError, setDeletePasswordError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  const populateUserData = () => {
    if (user) {
      setFullName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setOccupation(user.occupation || "");
      setBio(user.bio || "");
      const resolvedPhotoUrl = user.photo
        ? (user.photo.startsWith("http") ? user.photo : `/api/avatar/${user.photo}`)
        : "";
      setAvatarUrl(resolvedPhotoUrl);
      
      if (user.preferences) {
        setCurrency(user.preferences.currency || "IDR");
        const activeLang = currentGlobalLang || user.preferences.language || "id";
        setLanguage(activeLang);
        setEmailNotif(user.preferences.emailNotif ?? true);
        setTxAlert(user.preferences.txAlert ?? true);
        setBudgetAlert(user.preferences.budgetAlert ?? true);
        setShowTutorialOnLogin(user.preferences.showTutorialOnLogin ?? true);
        setTheme(user.preferences.theme || "light");
      }
    }
  };


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
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", fullName);
      formData.append("phone", phone);
      formData.append("occupation", occupation);
      formData.append("bio", bio);
      if (avatarFile) {
        formData.append("photo", avatarFile);
      }
      // Also include preferences so they are not lost
      const prefs = { currency, language, emailNotif, txAlert, budgetAlert, showTutorialOnLogin, theme };
      formData.append("preferences", JSON.stringify(prefs));

      const result = await updateProfile(formData);
      if (result.success) {
        setAvatarFile(null);
        if (result.user?.photo) {
          const photoUrl = result.user.photo.startsWith("http") ? result.user.photo : `/api/avatar/${result.user.photo}`;
          setAvatarUrl(photoUrl);
        }
        showToast(currentGlobalLang === 'en' ? "Profile successfully updated." : "Profil berhasil diperbarui.");
      } else {
        showToast(result.error || (currentGlobalLang === 'en' ? "Failed to update profile." : "Gagal memperbarui profil."));
      }
    } catch {
      showToast(currentGlobalLang === 'en' ? "Failed to update profile." : "Gagal memperbarui profil.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelProfile = () => {
    populateUserData();
    setAvatarFile(null);
    showToast(currentGlobalLang === 'en' ? "Profile changes discarded." : "Perubahan profil dibatalkan.");
  };

  const handleSavePassword = async () => {
    // Validasi input
    if (user?.has_password && !currentPassword) {
      showToast(currentGlobalLang === 'en' ? "Please enter your current password." : "Harap masukkan Password Saat Ini.");
      return;
    }
    if (newPassword.length < 8) {
      showToast(currentGlobalLang === 'en' ? "New password must be at least 8 characters." : "Password baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast(currentGlobalLang === 'en' ? "Password confirmation does not match!" : "Konfirmasi password tidak cocok!");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      };

      if (user?.has_password) {
        payload.current_password = currentPassword;
      }

      const result = await updatePassword(payload);

      if (result.success) {
        showToast(user?.has_password ? (currentGlobalLang === 'en' ? "Password updated successfully." : "Password akun berhasil diperbarui.") : (currentGlobalLang === 'en' ? "Password created successfully." : "Password berhasil dibuat."));
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast(result.error || (currentGlobalLang === 'en' ? "Failed to update password." : "Gagal memperbarui password."));
      }
    } catch {
      showToast(currentGlobalLang === 'en' ? "Failed to update password." : "Gagal memperbarui password.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", fullName);
      formData.append("phone", phone);
      formData.append("occupation", occupation);
      formData.append("bio", bio);
      // Send updated preferences
      const prefs = { currency, language, txAlert, budgetAlert, showTutorialOnLogin, emailNotif, theme };
      formData.append("preferences", JSON.stringify(prefs));

      const result = await updateProfile(formData);
      if (result.success) {
        // Apply the language globally only after saving
        changeLanguage(language);
        showToast(language === 'en' ? "Application preferences successfully saved." : "Preferensi aplikasi berhasil disimpan.");
      } else {
        showToast(result.error || (language === 'en' ? "Failed to save preferences." : "Gagal menyimpan preferensi."));
      }
    } catch {
      showToast(language === 'en' ? "Failed to save preferences." : "Gagal menyimpan preferensi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenTutorialModal = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-onboarding-tutorial"));
    }
  };

  const handleOpenDeleteModal = () => {
    setDeletePassword("");
    setDeletePasswordError("");
    setIsDeleting(false);
    setShowDeletePassword(false);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setDeletePassword("");
    setDeletePasswordError("");
    setIsDeleting(false);
    setShowDeletePassword(false);
    setDeleteModalOpen(false);
  };

  const handleConfirmDelete = async (e) => {
    if (e) e.preventDefault();
    if (!deletePassword || !deletePassword.trim()) {
      setDeletePasswordError(
        currentGlobalLang === "en"
          ? "Password is required to confirm account deletion."
          : "Password wajib diisi untuk mengonfirmasi penghapusan akun."
      );
      return;
    }

    setIsDeleting(true);
    setDeletePasswordError("");

    const result = await deleteAccount(deletePassword);
    if (result.success) {
      setDeleteModalOpen(false);
      setDeletePassword("");
    } else {
      setIsDeleting(false);
      setDeletePasswordError(
        result.error ||
          (currentGlobalLang === "en"
            ? "Failed to delete account."
            : "Gagal menghapus akun.")
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 min-w-0 pb-12">
        
        {/* Header Section */}
        <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200/60 pb-5`}>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {t("settings.title")}
              </h1>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#00685F] hidden sm:flex items-center justify-center border border-teal-100 shadow-2xs">
                <Settings className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {t("settings.subtitle")}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Profil Saya, Keamanan, Preferensi, AI Chatbot, Hapus Akun) */}
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
              isSaving={isSaving}
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
              isSaving={isSaving}
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
              showTutorialOnLogin={showTutorialOnLogin}
              setShowTutorialOnLogin={setShowTutorialOnLogin}
              onOpenTutorialModal={handleOpenTutorialModal}
              onSave={handleSavePreferences}
              isSaving={isSaving}
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
              onDeleteAccount={handleOpenDeleteModal}
            />
          </div>
        )}

      </div>

      {/* Delete Account Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200 select-none">
          <div 
            className="fixed inset-0 -z-10" 
            onClick={!isDeleting ? handleCloseDeleteModal : undefined} 
            aria-hidden="true" 
          />

          <div className="bg-white rounded-[2.25rem] sm:rounded-[2.5rem] max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200 my-auto overflow-hidden text-center">
            
            {/* Top Danger Line Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-rose-600" />

            <button 
              type="button"
              disabled={isDeleting}
              onClick={handleCloseDeleteModal}
              aria-label={currentGlobalLang === "en" ? "Close" : "Tutup"}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-xl hover:bg-slate-100 cursor-pointer disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="w-16 h-16 bg-rose-50 rounded-3xl flex items-center justify-center text-red-600 border border-rose-100 shadow-xs">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {currentGlobalLang === "en" ? "Confirm Account Deletion" : "Konfirmasi Hapus Akun"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium px-1">
                {currentGlobalLang === "en"
                  ? "Are you sure you want to permanently delete your MoneFin account? All transaction records, budgets, accounts, and financial history will be deleted forever."
                  : "Apakah Anda benar-benar yakin ingin menghapus akun MoneFin secara permanen? Seluruh riwayat transaksi, anggaran, rekening, dan data finansial Anda akan dihapus selamanya."}
              </p>
            </div>

            <form onSubmit={handleConfirmDelete} className="space-y-4 pt-1">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#00685F]" />
                  <span>
                    {currentGlobalLang === "en"
                      ? "Enter your password to confirm"
                      : "Masukkan password untuk konfirmasi"}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showDeletePassword ? "text" : "password"}
                    value={deletePassword}
                    onChange={(e) => {
                      setDeletePassword(e.target.value);
                      if (deletePasswordError) setDeletePasswordError("");
                    }}
                    placeholder={
                      currentGlobalLang === "en"
                        ? "Enter your account password..."
                        : "Masukkan kata sandi akun..."
                    }
                    disabled={isDeleting}
                    autoFocus
                    className={`w-full min-h-[48px] px-4 py-3 bg-slate-50/80 border rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-4 transition pr-11 font-medium ${
                      deletePasswordError
                        ? "border-red-400 focus:ring-red-200 bg-red-50/30"
                        : "border-slate-200/80 focus:ring-[#00685F]/10 focus:border-[#00685F] focus:bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    aria-label={showDeletePassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                  >
                    {showDeletePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {deletePasswordError && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 font-bold mt-1.5 px-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{deletePasswordError}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="button"
                  disabled={isDeleting}
                  onClick={handleCloseDeleteModal}
                  className="flex-1 min-h-[44px] bg-slate-100 text-slate-700 font-extrabold py-3 rounded-2xl text-xs sm:text-sm hover:bg-slate-200 transition-all cursor-pointer select-none disabled:opacity-50 active:scale-[0.98]"
                >
                  {currentGlobalLang === "en" ? "Cancel" : "Batal"}
                </button>
                <button 
                  type="submit"
                  disabled={isDeleting}
                  className="flex-1 min-h-[44px] bg-red-600 text-white font-extrabold py-3 rounded-2xl text-xs sm:text-sm hover:bg-red-700 transition-all shadow-md shadow-red-500/25 cursor-pointer select-none disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{currentGlobalLang === "en" ? "Deleting..." : "Menghapus..."}</span>
                    </>
                  ) : (
                    <span>{currentGlobalLang === "en" ? "Yes, Delete Account" : "Ya, Hapus Akun"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic Toast Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-5 duration-300 z-50 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="leading-snug">{toastMessage}</span>
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
