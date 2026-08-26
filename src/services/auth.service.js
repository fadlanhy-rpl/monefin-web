import { fetchAPI, setAuthToken } from "../lib/api";

const ENDPOINT = "/auth";

/**
 * Login dengan email dan password
 * @returns {{ user: Object, token: string }}
 */
export async function login(email, password) {
  const { data } = await fetchAPI(`${ENDPOINT}/login`, {
    method: "POST",
    body: { email, password },
  });
  return data; // { user, token }
}

/**
 * Register akun baru
 * @returns {{ user: Object, message: string }}
 */
export async function register(name, email, password) {
  const { data, message } = await fetchAPI(`${ENDPOINT}/register`, {
    method: "POST",
    body: { name, email, password },
  });
  return { user: data?.user, message };
}

/**
 * Logout — revoke token
 */
export async function logout() {
  try {
    await fetchAPI(`${ENDPOINT}/logout`, { method: "POST" });
  } catch (err) {
    console.error("Logout error", err);
  } finally {
    setAuthToken(null);
  }
}

/**
 * Ambil data user yang sedang login
 * @returns {Object} user
 */
export async function getCurrentUser() {
  const { data } = await fetchAPI(`${ENDPOINT}/me`);
  return data?.user || data;
}

/**
 * Update profil (nama, foto)
 * @param {FormData} formData
 * @returns {Object} updated user
 */
export async function updateProfile(formData) {
  const { data } = await fetchAPI(`${ENDPOINT}/profile`, {
    method: "POST",
    body: formData, // FormData dikirim as-is (tidak di-stringify)
  });
  return data?.user || data;
}

/**
 * Update password
 * @param {{ current_password?, new_password, new_password_confirmation }} passwordData
 */
export async function updatePassword(passwordData) {
  return await fetchAPI(`${ENDPOINT}/password`, {
    method: "POST",
    body: passwordData,
  });
}

/**
 * Verifikasi email dengan OTP
 * @returns {{ user: Object, token: string }}
 */
export async function verifyEmail(email, otp) {
  const { data } = await fetchAPI(`${ENDPOINT}/verify-email`, {
    method: "POST",
    body: { email, otp },
  });
  return data; // { user, token }
}

/**
 * Kirim ulang OTP
 * @param {'verification'|'reset'} type
 */
export async function resendOtp(email, type) {
  return await fetchAPI(`${ENDPOINT}/resend-otp`, {
    method: "POST",
    body: { email, type },
  });
}

/**
 * Request OTP untuk reset password
 */
export async function forgotPassword(email) {
  return await fetchAPI(`${ENDPOINT}/forgot-password`, {
    method: "POST",
    body: { email },
  });
}

/**
 * Reset password dengan OTP
 * @param {{ email, otp, password, password_confirmation }} data
 */
export async function resetPassword(data) {
  return await fetchAPI(`${ENDPOINT}/reset-password`, {
    method: "POST",
    body: data,
  });
}

/**
 * Hapus akun secara permanen
 */
export async function deleteAccount() {
  const result = await fetchAPI(`${ENDPOINT}/profile`, {
    method: "DELETE",
  });
  setAuthToken(null);
  return result;
}

/**
 * Verifikasi kode 2FA setelah login
 * @returns {{ user: Object, token: string }}
 */
export async function verify2fa(email, otp) {
  const { data } = await fetchAPI(`${ENDPOINT}/verify-2fa`, {
    method: "POST",
    body: { email, otp },
  });
  return data; // { user, token }
}

/**
 * Toggle Two-Factor Authentication
 * @param {boolean} enabled
 */
export async function toggle2fa(enabled) {
  const { data } = await fetchAPI(`${ENDPOINT}/2fa/toggle`, {
    method: "POST",
    body: { enabled },
  });
  return data?.user;
}

/**
 * Ambil daftar sesi aktif
 */
export async function getSessions() {
  const { data } = await fetchAPI(`${ENDPOINT}/sessions`);
  return data?.sessions ?? [];
}

/**
 * Hapus sesi spesifik berdasarkan token ID
 * @param {number} tokenId
 */
export async function revokeSession(tokenId) {
  return await fetchAPI(`${ENDPOINT}/sessions/${tokenId}`, {
    method: "DELETE",
  });
}

/**
 * Hapus semua sesi lain (bukan sesi saat ini)
 */
export async function revokeOtherSessions() {
  return await fetchAPI(`${ENDPOINT}/sessions`, {
    method: "DELETE",
  });
}

/**
 * Amankan akun dari login yang mencurigakan (putus sesi & kirim OTP ganti password)
 * @param {string} token
 */
export async function secureAccount(token) {
  return await fetchAPI(`${ENDPOINT}/secure-account`, {
    method: "POST",
    body: { token },
  });
}

