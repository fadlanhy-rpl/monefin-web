"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser,
  register as apiRegister,
  updateProfile as apiUpdateProfile,
  updatePassword as apiUpdatePassword,
  verifyEmail as apiVerifyEmail,
  resendOtp as apiResendOtp,
  forgotPassword as apiForgotPassword,
  resetPassword as apiResetPassword,
  deleteAccount as apiDeleteAccount,
} from "../services/auth.service";
import { getAuthToken, setAuthToken } from "../lib/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  updateProfile: async () => {},
  updatePassword: async () => {},
  verifyEmail: async () => {},
  resendOtp: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
  deleteAccount: async () => {},
  setUser: () => {},
  checkAuth: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // -------------------------------------------------------
  // checkAuth — Verifikasi token ke backend
  // -------------------------------------------------------
  const checkAuth = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("user_data", JSON.stringify(userData));
      }
    } catch (error) {
      if (error.status === 401) {
        setUser(null);
        setIsAuthenticated(false);
        setAuthToken(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("user_data");
        }
      } else {
        // Network error atau 503 — pertahankan session yang ada
        console.warn("Auth check failed (non-401). Keeping session.", error.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // -------------------------------------------------------
  // Initial Load & Event Listeners
  // -------------------------------------------------------
  useEffect(() => {
    // Hydrate dari cache agar tidak ada flicker saat refresh
    if (typeof window !== "undefined") {
      const savedToken = Cookies.get("auth_token");
      const savedUser = localStorage.getItem("user_data");

      if (savedToken && savedUser) {
        try {
          setIsAuthenticated(true);
          setUser(JSON.parse(savedUser));
          setLoading(false);
        } catch (_) {
          localStorage.removeItem("user_data");
        }
      } else if (!savedToken && savedUser) {
        localStorage.removeItem("user_data");
      }
    }

    // Verifikasi ke backend di background
    checkAuth();

    // Handle 401 global (token expired/invalid)
    const handleUnauthorized = () => {
      if (typeof window === "undefined") return;
      const currentPath = window.location.pathname;

      setUser(null);
      setIsAuthenticated(false);
      setAuthToken(null);
      Cookies.remove("auth_token", { path: "/" });
      if (typeof window !== "undefined") {
        localStorage.removeItem("user_data");
      }

      const publicPaths = ["/login", "/register", "/verify-email", "/forgot-password", "/reset-password"];
      const isPublic = publicPaths.some(p => currentPath.startsWith(p));

      if (!isPublic) {
        router.replace("/login?message=session_expired");
      }
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [checkAuth, router]);

  // -------------------------------------------------------
  // Login
  // -------------------------------------------------------
  const login = async (email, password, remember = false) => {
    setLoading(true);
    try {
      const data = await apiLogin(email, password);

      // Simpan token: 30 hari jika remember, session cookie jika tidak
      setAuthToken(data.token, remember ? 30 : null);
      setUser(data.user);
      setIsAuthenticated(true);

      if (typeof window !== "undefined") {
        localStorage.setItem("user_data", JSON.stringify(data.user));
      }

      return { success: true, user: data.user };
    } catch (error) {
      // Kembalikan flag jika email belum diverifikasi
      if (error.status === 403 && error.data?.require_verification) {
        return {
          success: false,
          error: error.data.message,
          requireVerification: true,
          email: error.data.email,
        };
      }

      const msg = error.data?.message || error.message || "Gagal masuk. Silakan coba lagi.";
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------
  // Logout
  // -------------------------------------------------------
  const logout = async () => {
    setLoading(true);
    try {
      await apiLogout();
    } catch (err) {
      console.error("Logout API failed, proceeding to clear local session:", err);
    } finally {
      setAuthToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem("user_data");
      }
      router.push("/");
    }
  };

  // -------------------------------------------------------
  // Register
  // -------------------------------------------------------
  const register = async (name, email, password) => {
    try {
      const result = await apiRegister(name, email, password);
      return { success: true, ...result };
    } catch (error) {
      const msg = error.data?.message || error.message || "Registrasi gagal.";
      return { success: false, error: msg };
    }
  };

  // -------------------------------------------------------
  // Update Profile
  // -------------------------------------------------------
  const updateProfile = async (formData) => {
    try {
      const updatedUser = await apiUpdateProfile(formData);
      setUser(updatedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("user_data", JSON.stringify(updatedUser));
      }
      return { success: true, user: updatedUser };
    } catch (error) {
      const msg = error.data?.message || error.message || "Gagal memperbarui profil.";
      return { success: false, error: msg };
    }
  };

  // -------------------------------------------------------
  // Update Password
  // -------------------------------------------------------
  const updatePassword = async (passwordData) => {
    try {
      const result = await apiUpdatePassword(passwordData);
      
      // Update local user state agar UI (has_password) berubah instan
      if (user && !user.has_password) {
        const updatedUser = { ...user, has_password: true };
        setUser(updatedUser);
        if (typeof window !== "undefined") {
          localStorage.setItem("user_data", JSON.stringify(updatedUser));
        }
      }
      
      return { success: true, message: result.message };
    } catch (error) {
      const msg = error.data?.message || error.message || "Gagal mengubah password.";
      return { success: false, error: msg };
    }
  };

  // -------------------------------------------------------
  // Verify Email
  // -------------------------------------------------------
  const verifyEmail = async (email, otp) => {
    try {
      const data = await apiVerifyEmail(email, otp);
      // Auto-login setelah verifikasi
      if (data?.token) {
        setAuthToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        if (typeof window !== "undefined") {
          localStorage.setItem("user_data", JSON.stringify(data.user));
        }
      }
      return { success: true, user: data?.user };
    } catch (error) {
      const msg = error.data?.message || error.message || "Verifikasi gagal.";
      return { success: false, error: msg };
    }
  };

  // -------------------------------------------------------
  // Resend OTP
  // -------------------------------------------------------
  const resendOtp = async (email, type) => {
    try {
      const result = await apiResendOtp(email, type);
      return { success: true, message: result.message };
    } catch (error) {
      const msg = error.data?.message || error.message || "Gagal mengirim ulang OTP.";
      return { success: false, error: msg };
    }
  };

  // -------------------------------------------------------
  // Forgot Password
  // -------------------------------------------------------
  const forgotPassword = async (email) => {
    try {
      const result = await apiForgotPassword(email);
      return { success: true, message: result.message };
    } catch (error) {
      const msg = error.data?.message || error.message || "Gagal mengirim OTP.";
      return { success: false, error: msg };
    }
  };

  // -------------------------------------------------------
  // Reset Password
  // -------------------------------------------------------
  const resetPassword = async (data) => {
    try {
      const result = await apiResetPassword(data);
      return { success: true, message: result.message };
    } catch (error) {
      const msg = error.data?.message || error.message || "Gagal reset password.";
      return { success: false, error: msg };
    }
  };

  // -------------------------------------------------------
  // Delete Account
  // -------------------------------------------------------
  const deleteAccount = async () => {
    setLoading(true);
    try {
      await apiDeleteAccount();
    } catch (err) {
      console.error("Delete Account API failed:", err);
      const msg = err.data?.message || err.message || "Gagal menghapus akun.";
      setLoading(false);
      return { success: false, error: msg };
    } 
    
    // Success, clear local session and redirect
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user_data");
    }
    router.push("/");
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        register,
        updateProfile,
        updatePassword,
        verifyEmail,
        resendOtp,
        forgotPassword,
        resetPassword,
        deleteAccount,
        setUser,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}

export default AuthContext;
