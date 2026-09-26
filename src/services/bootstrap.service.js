import { fetchAPI, primeApiCache } from "../lib/api";

/**
 * GET /api/bootstrap — me + accounts + categories dalam SATU boot Laravel.
 * Fallback ke endpoint individual bila server belum di-patch (kompatibel mundur).
 */
export async function getBootstrap(force = false) {
  const res = await fetchAPI("/bootstrap", {
    cacheTtl: 120000,
    forceRefresh: force,
  });

  const bundle = res?.data || {};

  // Hanya prime cache individual saat respons baru datang dari server (bukan dari cache)
  // dan HANYA jika array berisi data (> 0) agar tidak pernah meracuni cache dengan []
  if (!res?.fromCache) {
    if (bundle.user) {
      primeApiCache("/auth/me", { user: bundle.user }, 300000);
    }
    if (Array.isArray(bundle.accounts) && bundle.accounts.length > 0) {
      primeApiCache("/accounts", bundle.accounts, 120000);
    }
    if (Array.isArray(bundle.categories) && bundle.categories.length > 0) {
      primeApiCache("/categories", bundle.categories, 600000);
      primeApiCache(
        "/categories?type=expense",
        bundle.categories.filter((c) => c.type === "expense"),
        600000
      );
      primeApiCache(
        "/categories?type=income",
        bundle.categories.filter((c) => c.type === "income"),
        600000
      );
    }
  }

  return bundle; // { user, accounts, categories }
}
