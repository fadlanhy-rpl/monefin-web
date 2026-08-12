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
// Core Fetch Wrapper
// =============================================

/**
 * fetchAPI — wrapper untuk semua HTTP request ke backend
 * Otomatis: attach Bearer token, handle error, parse JSON
 */
export async function fetchAPI(endpoint, options = {}) {
  const url = `${getBaseUrl()}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    Accept: "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Jika body adalah plain object (bukan FormData), stringify
  if (
    options.body &&
    typeof options.body === "object" &&
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }

  const config = { ...options, headers };

  try {
    const response = await fetch(url, config);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      // Trigger event global jika 401
      if (response.status === 401 && typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:unauthorized"));
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

      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = payload;
      if (response.status === 422 && payload?.errors) {
        error.errors = payload.errors;
      }

      throw error;
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

    return {
      success: true,
      data: returnData,
      message: payload?.message ?? "Success",
      meta,
      summary: payload?.summary ?? null,
    };
  } catch (error) {
    if (error.status) throw error;

    // Network error
    if (error.name === "TypeError" || error.name === "FetchError") {
      const networkError = new Error(
        "Koneksi ke server terputus. Periksa koneksi internet Anda."
      );
      networkError.status = 503;
      throw networkError;
    }

    throw error;
  }
}
