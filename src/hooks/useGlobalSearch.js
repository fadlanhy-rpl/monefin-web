import { useState, useEffect } from "react";
import { fetchAPI } from "../lib/api";

/**
 * useGlobalSearch - Custom hook untuk global search dengan debounce
 *
 * Mencari di entitas MoneFin:
 * - transactions (deskripsi & kategori)
 * - categories (nama kategori)
 * - accounts (nama akun)
 * - goals (judul goal)
 *
 * @param {string} query - Kata kunci dari user
 * @param {number} delay - Delay debounce dalam ms (default: 300)
 * @returns {{ results, isLoading, error }}
 */
export function useGlobalSearch(query, delay = 300) {
  const [results, setResults] = useState({
    transactions: [],
    categories: [],
    accounts: [],
    goals: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Guard: jangan fetch jika query kosong
    if (!query || query.trim() === "") {
      setResults({ transactions: [], categories: [], accounts: [], goals: [] });
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Debounce: hanya fetch setelah user berhenti mengetik selama `delay` ms
    const debounceTimer = setTimeout(async () => {
      try {
        const response = await fetchAPI(
          `/search?q=${encodeURIComponent(query.trim())}`
        );
        if (response.success) {
          setResults(response.data);
        } else {
          setError(new Error("Pencarian gagal"));
        }
      } catch (err) {
        console.error("Global search error:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }, delay);

    // Cleanup: batalkan timer jika query berubah sebelum delay habis
    return () => clearTimeout(debounceTimer);
  }, [query, delay]);

  return { results, isLoading, error };
}
