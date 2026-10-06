import { fetchAPI, primeApiCache } from "../lib/api";

let latestBootstrapBundle = {
  user: null,
  accounts: [],
  categories: [],
};

/**
 * Ambil snapshot sinkron terakhir dari /api/bootstrap (0ms, tanpa async)
 * agar modal transaksi saat cold-start langsung memiliki daftar akun & kategori.
 */
export function getBootstrapSnapshot() {
  return latestBootstrapBundle;
}

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

  if (bundle.user) {
    latestBootstrapBundle.user = bundle.user;
    if (!res?.fromCache) {
      primeApiCache("/auth/me", { user: bundle.user }, 300000);
    }
  }
  if (Array.isArray(bundle.accounts) && bundle.accounts.length > 0) {
    latestBootstrapBundle.accounts = bundle.accounts;
    primeApiCache("/accounts", bundle.accounts, 30000);
  }
  if (Array.isArray(bundle.categories) && bundle.categories.length > 0) {
    latestBootstrapBundle.categories = bundle.categories;
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

  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(
        new CustomEvent("monefin:bootstrap-ready", { detail: bundle })
      );
    } catch {
      // ignore event dispatch error
    }
  }

  return bundle; // { user, accounts, categories }
}
