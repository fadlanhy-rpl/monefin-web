"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import OnboardingTutorialModal from "../onboarding/OnboardingTutorialModal";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const hasTriggeredRef = useRef(false);

  const { isAuthenticated, loading, user, updateProfile } = useAuth();
  const router = useRouter();

  const tutorialShowOnLogin = user?.preferences?.showTutorialOnLogin !== false &&
    user?.preferences?.showTutorialOnLogin !== "false" &&
    user?.preferences?.showTutorialOnLogin !== 0;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/login")) {
        return;
      }
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Periksa apakah preferensi pengguna mengaktifkan tutorial setiap kali login
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const showPref = user?.preferences?.showTutorialOnLogin !== false &&
                       user?.preferences?.showTutorialOnLogin !== "false" &&
                       user?.preferences?.showTutorialOnLogin !== 0;

      // Cek apakah di sesi browser saat ini tutorial sudah pernah dimunculkan untuk akun ini
      if (typeof window !== "undefined") {
        const userKey = user.id ? `monefin_tutorial_shown_v2_${user.id}` : `monefin_tutorial_shown_v2_${user.email || "guest"}`;
        
        // Cek jika ini adalah event login baru
        const isLoginEvent = sessionStorage.getItem("monefin_login_event") === "true";
        if (isLoginEvent) {
          sessionStorage.removeItem("monefin_login_event");
          sessionStorage.removeItem(userKey);
        }

        const sessionShown = sessionStorage.getItem(userKey);

        // Hapus legacy global key jika ada agar tidak memblokir akun lain di tab yang sama
        sessionStorage.removeItem("monefin_tutorial_session_shown");

        if ((isLoginEvent || !sessionShown) && showPref && !hasTriggeredRef.current) {
          const t = setTimeout(() => {
            hasTriggeredRef.current = true;
            sessionStorage.setItem(userKey, "true");
            setIsTutorialOpen(true);
          }, 80);
          return () => clearTimeout(t);
        }
      }
    }
  }, [loading, isAuthenticated, user]);

  // Listener untuk event kustom saat tombol "Buka Panduan Tutorial Sekarang" ditekan di Pengaturan
  useEffect(() => {
    function handleOpenTutorialEvent() {
      setIsTutorialOpen(true);
    }
    window.addEventListener("open-onboarding-tutorial", handleOpenTutorialEvent);
    return () => window.removeEventListener("open-onboarding-tutorial", handleOpenTutorialEvent);
  }, []);

  // Handler toggle langsung dari modal, otomatis update preferensi akun
  const handleToggleTutorialFromModal = async (newVal) => {
    if (user && updateProfile) {
      try {
        const updatedPrefs = {
          ...(user.preferences || {}),
          showTutorialOnLogin: newVal,
        };
        const formData = new FormData();
        formData.append("name", user.name || "");
        if (user.phone) formData.append("phone", user.phone);
        if (user.occupation) formData.append("occupation", user.occupation);
        if (user.bio) formData.append("bio", user.bio);
        formData.append("preferences", JSON.stringify(updatedPrefs));
        await updateProfile(formData);
      } catch (err) {
        console.error("Gagal memperbarui preferensi tutorial dari modal:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-9 h-9 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#f4f7f6]">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header setMobileOpen={setMobileOpen} />
        <main className="px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-6">
          {children}
        </main>
      </div>

      {/* Interactive Onboarding Tutorial Modal */}
      <OnboardingTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        showTutorialOnLogin={tutorialShowOnLogin}
        onToggleShowTutorialOnLogin={handleToggleTutorialFromModal}
      />
    </div>
  );
}
