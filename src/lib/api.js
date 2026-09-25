import Cookies from "js-cookie";

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
};

// =============================================
// Token Management (Cookie)
// =============================================

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return Cookies.get("auth_token");
  }
  return null;
};

/**
 * @param {string|null} token    - token string atau null untuk hapus
 * @param {number|null} expires  - jumlah hari (null = session cookie)
 */
export const setAuthToken = (token, expires = null) => {
  if (typeof window === "undefined") return;

  if (token) {
    const options = {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };
    if (expires) options.expires = expires;
    Cookies.set("auth_token", token, options);
  } else {
    Cookies.remove("auth_token", { path: "/" });
  }
};

// =============================================
// Browser Detection (e.g. Brave anti-fingerprint bypass)
// =============================================
let isBraveCached = null;

async function checkIsBrave() {
  if (isBraveCached !== null) return isBraveCached;
  if (typeof navigator !== "undefined" && navigator.brave && typeof navigator.brave.isBrave === "function") {
    try {
      isBraveCached = Boolean(await navigator.brave.isBrave());
    } catch {
      isBraveCached = false;
    }
  } else {
    isBraveCached = false;
  }
  return isBraveCached;
}

// =============================================
// Core Fetch Wrapper
// =============================================

// =============================================
// Client-Side Load Shield & In-Memory Micro-Cache
// =============================================
const inFlightRequests = new Map();
const memoryCache = new Map();

// =============================================
// Persistent SWR Cache (localStorage)
// ---------------------------------------------
// In-memory cache menguap saat refresh — lapisan ini membuatnya selamat.
// Kebijakan: fresh (umur < TTL) → tanpa request sama sekali;
// stale → tampil instan + revalidasi diam-diam di background.
// Data finansial tetap aman: TTL pendek + invalidasi eksplisit saat mutasi.
// =============================================
const PERSIST_KEY = "monefin_api_pcache_v1";
const PERSIST_MAX_ENTRIES = 80;

function readPersistStore() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return {};
    const raw = window.localStorage.getItem(PERSIST_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writePersistStore(store) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    const keys = Object.keys(store);
    // Evict tertua jika melebihi batas
    if (keys.length > PERSIST_MAX_ENTRIES) {
      keys
        .sort((a, b) => (store[a]?.timestamp || 0) - (store[b]?.timestamp || 0))
        .slice(0, keys.length - PERSIST_MAX_ENTRIES)
        .forEach((k) => delete store[k]);
    }
    window.localStorage.setItem(PERSIST_KEY, JSON.stringify(store));
  } catch {
    // Kuota penuh / storage mati → abaikan, in-memory tetap jalan
  }
}

function getPersistEntry(key) {
  const store = readPersistStore();
  const entry = store[key];
  if (!entry || !entry.data) return null;
  return entry; // { data, timestamp, ttl }
}

function setPersistEntry(key, data, ttl) {
  try {
    // Jangan simpan payload raksasa (mis. base64) ke localStorage
    const approx = JSON.stringify(data)?.length || 0;
    if (approx > 500000) return;
  } catch {
    return;
  }
  const store = readPersistStore();
  store[key] = { data, timestamp: Date.now(), ttl };
  writePersistStore(store);
}

function deletePersistByPattern(pattern) {
  const store = readPersistStore();
  let changed = false;
  for (const key of Object.keys(store)) {
    const hit =
      typeof pattern === "string" ? key.includes(pattern) : pattern.test(key);
    if (hit) {
      delete store[key];
      changed = true;
    }
  }
  if (changed) writePersistStore(store);
}

/**
 * Prime cache (memory + persistent) untuk sebuah endpoint GET — dipakai
 * setelah /bootstrap agar panggilan individuell berikutnya tanpa jaringan.
 * @param {string} endpoint - mis. "/accounts"
 * @param {*} payloadData - isi `data` seperti hasil normalisasi fetchAPI
 * @param {number} ttl - TTL ms (default 60000)
 */
export function primeApiCache(endpoint, payloadData, ttl = 60000) {
  try {
    const token = getAuthToken();
    const activeLang =
      typeof window !== "undefined"
        ? Cookies.get("NEXT_LOCALE") || localStorage.getItem("language") || "en"
        : "en";
    const cacheKey = `GET:${endpoint}:${token ? token.slice(-12) : "anon"}:${activeLang}`;
    const result = {
      success: true,
      data: payloadData,
      message: "Success",
      meta: null,
      summary: null,
    };
    memoryCache.set(cacheKey, { data: result, timestamp: Date.now(), ttl });
    setPersistEntry(cacheKey, result, ttl);
  } catch {
    // priming gagal → bukan fatal, fetch normal tetap jalan
  }
}

/**
 * Invalidate in-memory cached API responses.
 * @param {string|RegExp|null} pattern - Substring or RegExp to match against cache keys. If null, clears all.
 */
export function invalidateApiCache(pattern = null) {
  if (!pattern) {
    memoryCache.clear();
    deletePersistByPattern(/.*/);
    return;
  }
  for (const key of memoryCache.keys()) {
    if (typeof pattern === "string" && key.includes(pattern)) {
      memoryCache.delete(key);
    } else if (pattern instanceof RegExp && pattern.test(key)) {
      memoryCache.delete(key);
    }
  }
  deletePersistByPattern(pattern);
}

export function clearApiCache() {
  memoryCache.clear();
  inFlightRequests.clear();
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(PERSIST_KEY);
    }
  } catch {
    // ignore
  }
}

/**
 * Otomatis bersihkan cache yang terkait saat terjadi mutasi data.
 * Selalu sertakan "bootstrap" karena endpoint gabungan itu menyimpan
 * salinan me/accounts/categories.
 */
function autoInvalidateOnMutation(endpoint) {
  const ep = endpoint.toLowerCase();
  if (ep.includes("/transactions") || ep.includes("/receipts")) {
    invalidateApiCache("transactions");
    invalidateApiCache("dashboard");
    invalidateApiCache("reports");
    invalidateApiCache("accounts");
    invalidateApiCache("budgets");
    invalidateApiCache("gamification");
    invalidateApiCache("bootstrap");
  } else if (ep.includes("/accounts")) {
    invalidateApiCache("accounts");
    invalidateApiCache("dashboard");
    invalidateApiCache("reports");
    invalidateApiCache("bootstrap");
  } else if (ep.includes("/categories")) {
    invalidateApiCache("categories");
    invalidateApiCache("dashboard");
    invalidateApiCache("reports");
    invalidateApiCache("budgets");
    invalidateApiCache("bootstrap");
  } else if (ep.includes("/budgets")) {
    invalidateApiCache("budgets");
    invalidateApiCache("dashboard");
  } else if (ep.includes("/goals")) {
    invalidateApiCache("goals");
    invalidateApiCache("dashboard");
  } else if (ep.includes("/recurring") || ep.includes("/income-settings")) {
    invalidateApiCache("recurring");
    invalidateApiCache("dashboard");
  } else if (ep.includes("/gamification")) {
    invalidateApiCache("gamification");
  } else if (ep.includes("/auth/profile") || ep.includes("/auth/password")) {
    invalidateApiCache("auth/me");
    invalidateApiCache("bootstrap");
  } else if (ep.includes("/auth/logout")) {
    clearApiCache();
  }
}

export class ApiError extends Error {
  constructor(message, status, data = null, errors = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.errors = errors;
    this.isApiError = true;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * fetchAPI — wrapper untuk semua HTTP request ke backend
 * Otomatis: attach Bearer token, handle error, parse JSON,
 * in-flight request deduplication, dan in-memory micro-caching (Load Shield)
 */
export async function fetchAPI(endpoint, options = {}) {
  const {
    cacheTtl = 0,
    forceRefresh = false,
    noCache = false,
    noDeduplication = false,
    ...fetchOptions
  } = options;

  const method = (fetchOptions.method || "GET").toUpperCase();
  const isGet = method === "GET";
  const token = getAuthToken();

  const activeLang = typeof window !== "undefined"
    ? Cookies.get("NEXT_LOCALE") || localStorage.getItem("language") || "en"
    : "en";

  const cacheKey = `${method}:${endpoint}:${token ? token.slice(-12) : "anon"}:${activeLang}`;

  // 1. In-Memory Micro-Cache Check (Hit 0ms)
  if (isGet && cacheTtl > 0 && !forceRefresh && !noCache) {
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
  }

  // 1b. Persistent SWR Cache (selamat dari refresh/reopen)
  //  - fresh (umur < TTL): tanpa request sama sekali
  //  - stale: tampil instan + revalidasi diam-diam di background
  if (isGet && cacheTtl > 0 && !forceRefresh && !noCache && typeof window !== "undefined") {
    const pentry = getPersistEntry(cacheKey);
    if (pentry) {
      const age = Date.now() - (pentry.timestamp || 0);
      const pttl = pentry.ttl || cacheTtl;
      // Sinkronkan ke memory agar navigasi dalam sesi instan
      memoryCache.set(cacheKey, { data: pentry.data, timestamp: pentry.timestamp, ttl: pttl });
      if (age < pttl) {
        return pentry.data;
      }
      // Stale: kembalikan langsung, segarkan di background (dedup otomatis)
      if (!inFlightRequests.has(cacheKey)) {
        const bg = fetchAPI(endpoint, { ...options, cacheTtl, forceRefresh: true });
        if (bg && typeof bg.catch === "function") bg.catch(() => {});
      }
      return pentry.data;
    }
  }

  // 2. In-Flight Request Deduplication (Cegah duplicate concurrent round-trips)
  if (isGet && !noDeduplication && !forceRefresh) {
    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey);
    }
  }

  const url = `${getBaseUrl()}${endpoint}`;

  const headers = {
    Accept: "application/json",
    ...fetchOptions.headers,
  };

  headers["Accept-Language"] = activeLang;

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Deteksi Brave browser (karena Brave secara default menyamarkan User-Agent menjadi Chrome)
  if (typeof window !== "undefined") {
    const isBrave = await checkIsBrave();
    if (isBrave) {
      headers["X-Client-Browser"] = "Brave";
    }
  }

  // Jika body adalah plain object (bukan FormData), stringify
  if (
    fetchOptions.body &&
    typeof fetchOptions.body === "object" &&
    !(fetchOptions.body instanceof FormData)
  ) {
    headers["Content-Type"] = "application/json";
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }

  const config = { ...fetchOptions, headers };

  const executeRequest = async () => {
    try {
      const response = await fetch(url, config);
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        // Trigger event global jika 401
        if (response.status === 401 && typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("auth:unauthorized", {
              detail: { revoked_by: payload?.revoked_by }
            })
          );
        }

        // Pesan error dari Laravel Validation (422)
        let errorMsg =
          payload?.message ||
          `API Error: ${response.status} ${response.statusText}`;

        if (response.status === 422 && payload?.errors) {
          const errors = payload.errors;
          const firstKey = Object.keys(errors)[0];
          if (firstKey) {
            const firstError = errors[firstKey];
            errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
          }
        }

        throw new ApiError(
          errorMsg,
          response.status,
          payload,
          response.status === 422 ? payload?.errors : null
        );
      }

      // Normalize response
      let returnData = payload?.data ?? payload;
      let meta = payload?.meta ?? null;

      // Handle Laravel pagination
      if (payload?.current_page && Array.isArray(payload?.data)) {
        const { data, ...paginationMeta } = payload;
        returnData = data;
        meta = paginationMeta;
      }

      const result = {
        success: true,
        data: returnData,
        message: payload?.message ?? "Success",
        meta,
        summary: payload?.summary ?? null,
      };

      // Simpan ke memory cache jika cacheTtl aktif
      if (isGet && cacheTtl > 0 && !noCache) {
        memoryCache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
          ttl: cacheTtl,
        });
        // Mirror ke persistent agar selamat dari refresh/reopen
        setPersistEntry(cacheKey, result, cacheTtl);
      }

      // Jika operasi adalah mutasi (POST, PUT, PATCH, DELETE), auto-invalidate cache terkait
      if (!isGet) {
        autoInvalidateOnMutation(endpoint);
      }

      return result;
    } catch (error) {
      if (error.status) throw error;

      // Network error
      if (error.name === "TypeError" || error.name === "FetchError") {
        const networkError = new ApiError(
          "Koneksi ke server terputus. Periksa koneksi internet Anda.",
          503
        );
        throw networkError;
      }

      throw error;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  };

  const promise = executeRequest();

  if (isGet && !noDeduplication) {
    inFlightRequests.set(cacheKey, promise);
  }

  return promise;
}
