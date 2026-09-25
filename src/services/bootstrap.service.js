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
  // Prime cache individual agar panggilan berikutnya tanpa jaringan
  if (bundle.user) primeApiCache("/auth/me", { user: bundle.user }, 300000);
  if (bundle.accounts) primeApiCache("/accounts", bundle.accounts, 120000);
  if (bundle.categories) primeApiCache("/categories", bundle.categories, 600000);

  return bundle; // { user, accounts, categories }
}
