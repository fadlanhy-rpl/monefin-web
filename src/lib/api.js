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

/**
 * Invalidate in-memory cached API responses.
 * @param {string|RegExp|null} pattern - Substring or RegExp to match against cache keys. If null, clears all.
 */
export function invalidateApiCache(pattern = null) {
  if (!pattern) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (typeof pattern === "string" && key.includes(pattern)) {
      memoryCache.delete(key);
    } else if (pattern instanceof RegExp && pattern.test(key)) {
      memoryCache.delete(key);
    }
  }
}

export function clearApiCache() {
  memoryCache.clear();
  inFlightRequests.clear();
}

/**
 * Otomatis bersihkan cache yang terkait saat terjadi mutasi data
 */
function autoInvalidateOnMutation(endpoint) {
  const ep = endpoint.toLowerCase();
  if (ep.includes("/transactions")) {
    invalidateApiCache("transactions");
    invalidateApiCache("dashboard");
    invalidateApiCache("reports");
    invalidateApiCache("accounts");
    invalidateApiCache("budgets");
    invalidateApiCache("gamification");
  } else if (ep.includes("/accounts")) {
    invalidateApiCache("accounts");
    invalidateApiCache("dashboard");
    invalidateApiCache("reports");
  } else if (ep.includes("/categories")) {
    invalidateApiCache("categories");
    invalidateApiCache("dashboard");
    invalidateApiCache("reports");
    invalidateApiCache("budgets");
  } else if (ep.includes("/budgets")) {
    invalidateApiCache("budgets");
    invalidateApiCache("dashboard");
  } else if (ep.includes("/goals")) {
    invalidateApiCache("goals");
    invalidateApiCache("dashboard");
  } else if (ep.includes("/recurring")) {
    invalidateApiCache("recurring");
    invalidateApiCache("dashboard");
  } else if (ep.includes("/gamification")) {
    invalidateApiCache("gamification");
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
