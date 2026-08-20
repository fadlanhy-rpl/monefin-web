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
