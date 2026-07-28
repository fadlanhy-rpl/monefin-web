"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import SettingsTabs from "../../../components/settings/SettingsTabs";
import ProfileSection from "../../../components/settings/ProfileSection";
import SecuritySection from "../../../components/settings/SecuritySection";
import DangerZoneSection from "../../../components/settings/DangerZoneSection";
import { CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Form State - Profile
  const [fullName, setFullName] = useState("Ahmad Maariz");
  const [email, setEmail] = useState("ahmad@example.com");
  const [occupation, setOccupation] = useState("Software Engineer");
  const [currency, setCurrency] = useState("IDR");

  // Form State - Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toast State
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleSaveProfile = () => {
    showToast("Profil berhasil diperbarui.");
  };

  const handleCancelProfile = () => {
    setFullName("Ahmad Maariz");
    setEmail("ahmad@example.com");
    setOccupation("Software Engineer");
    setCurrency("IDR");
    showToast("Perubahan profil dibatalkan.");
  };

  const handleSavePassword = () => {
    if (!currentPassword) {
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
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Password akun berhasil diperbarui.");
  };

  const handleForgotPassword = () => {
    showToast("Instruksi reset password telah dikirim ke email Anda.");
  };

  const handleDeleteAccount = () => {
    if (confirm("Apakah Anda benar-benar yakin ingin menghapus akun Anda secara permanen? Semua data finansial akan hilang!")) {
      showToast("Permintaan penghapusan akun telah diproses.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 min-w-0 pb-10">
        
        {/* Navigation Tabs (Profil Saya, Keamanan, Preferences) */}
        <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <SettingsTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Tab 1: Profil Saya & Details */}
        {(activeTab === "profile" || activeTab === "preferences") && (
          <div className={`transition-all duration-700 delay-100 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <ProfileSection 
              fullName={fullName}
              setFullName={setFullName}
              email={email}
              setEmail={setEmail}
              occupation={occupation}
              setOccupation={setOccupation}
              currency={currency}
              setCurrency={setCurrency}
              onSave={handleSaveProfile}
              onCancel={handleCancelProfile}
            />
          </div>
        )}

        {/* Tab 2: Keamanan Akun */}
        {(activeTab === "security" || activeTab === "profile") && (
          <div className={`transition-all duration-700 delay-200 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <SecuritySection 
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

        {/* Danger Zone: Hapus Akun */}
        <div className={`transition-all duration-700 delay-300 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <DangerZoneSection 
            onDeleteAccount={handleDeleteAccount}
          />
        </div>

      </div>

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
