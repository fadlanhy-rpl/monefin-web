"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";
import { DashboardBootSplash, isColdBootCompleted } from "../mobile/AppLaunchOverlay";
import { useAuth } from "../../hooks/useAuth";
import { getAuthToken } from "../../lib/api";

// Lazy-load heavy components — tidak perlu di-parse saat initial render
const OnboardingTutorialModal = dynamic(
  () => import("../onboarding/OnboardingTutorialModal"),
  { ssr: false }
);
const AiChatWidget = dynamic(
  () => import("../ai/AiChatWidget"),
  { ssr: false }
);

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [showBootSplash, setShowBootSplash] = useState(() => !isColdBootCompleted());
  const handleBootComplete = useCallback(() => setShowBootSplash(false), []);
  const hasTriggeredRef = useRef(false);
  const recheckTriggeredRef = useRef(false);

  const { isAuthenticated, loading, user, updateProfile, checkAuth } = useAuth();
  const router = useRouter();

  const tutorialShowOnLogin = user?.preferences?.showTutorialOnLogin !== false &&
    user?.preferences?.showTutorialOnLogin !== "false" &&
    user?.preferences?.showTutorialOnLogin !== 0;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Jika cookie auth_token sebenarnya ada (mis. baru selesai Google OAuth callback),
      // jangan lempar ke /login atau tampilkan layar putih — jalankan checkAuth!
      const token = getAuthToken();
      if (token && !recheckTriggeredRef.current) {
        recheckTriggeredRef.current = true;
        checkAuth(true);
        return;
      }
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/login")) {
        return;
      }
      router.replace("/login");
    } else if (isAuthenticated) {
      recheckTriggeredRef.current = false;
    }
  }, [loading, isAuthenticated, router, checkAuth]);

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

  const isAuthReady = !loading && isAuthenticated;

  return (
    <>
      {/* APK-Only Hero Launch Splash (hidden on website via .apk-only-splash CSS before first paint) */}
      {(showBootSplash || !isAuthReady) && (
        <DashboardBootSplash
          isReady={isAuthReady}
          onComplete={handleBootComplete}
        />
      )}

      {/* Website-Only Loader (hidden on APK via .web-only-loader CSS before first paint) */}
      {!isAuthReady && (
        <div className="web-only-loader min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="w-9 h-9 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-600">Memuat dashboard...</p>
          </div>
        </div>
      )}

      {isAuthenticated && (
        <div
          style={{
            transition: "opacity 450ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          className="flex min-h-screen bg-[#f4f7f6] opacity-100"
        >
          <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
          <div className="flex-1 min-w-0 flex flex-col">
            <Header setMobileOpen={setMobileOpen} />
            <main className="w-full max-w-[1600px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 xl:px-8 pt-5 sm:pt-6 pb-28 md:pb-10 space-y-6">
              {children}
            </main>
          </div>

          {/* Modern Mobile Bottom Navigation Bar (< md) */}
          <MobileBottomNav setMobileOpen={setMobileOpen} />

          {/* Interactive Onboarding Tutorial Modal */}
          <OnboardingTutorialModal
            isOpen={isTutorialOpen}
            onClose={() => setIsTutorialOpen(false)}
            showTutorialOnLogin={tutorialShowOnLogin}
            onToggleShowTutorialOnLogin={handleToggleTutorialFromModal}
          />

          {/* Global AI Financial Advisor Widget */}
          <AiChatWidget />
        </div>
      )}
    </>
  );
}
