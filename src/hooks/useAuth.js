"use client";

import { useAuthContext } from "../context/AuthContext";

/**
 * Custom hook untuk mengakses AuthContext.
 * Gunakan ini di semua komponen sebagai pengganti useAuthContext().
 */
export function useAuth() {
  return useAuthContext();
}

export default useAuth;
