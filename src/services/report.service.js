import { fetchAPI } from "../lib/api";

/**
 * Ambil data perbandingan income vs expense per bulan.
 * @param {Object} params
 * @param {string} [params.start_month] - Format YYYY-MM
 * @param {string} [params.end_month]   - Format YYYY-MM
 * @param {number} [params.months]      - Jumlah bulan ke belakang (default 6)
 */
export const getReportCompare = async (params = {}) => {
  const qs = new URLSearchParams();
  if (params.start_month) qs.append("start_month", params.start_month);
  if (params.end_month)   qs.append("end_month",   params.end_month);
  if (params.months)      qs.append("months",      params.months);
  const url = "/reports/compare" + (qs.toString() ? "?" + qs.toString() : "");
  return fetchAPI(url);
};

/**
 * Ambil distribusi pengeluaran/pemasukan per kategori.
 * @param {Object} params
 * @param {string} [params.start_date] - Format YYYY-MM-DD
 * @param {string} [params.end_date]   - Format YYYY-MM-DD
 * @param {string} [params.type]       - "expense" | "income" (default: expense)
 */
export const getReportCategoryBreakdown = async (params = {}) => {
  const qs = new URLSearchParams();
  if (params.start_date) qs.append("start_date", params.start_date);
  if (params.end_date)   qs.append("end_date",   params.end_date);
  if (params.type)       qs.append("type",       params.type);
  const url = "/reports/category-breakdown" + (qs.toString() ? "?" + qs.toString() : "");
  return fetchAPI(url);
};

/**
 * Trigger export CSV laporan keuangan dari backend.
 * Membuka URL download langsung di tab baru.
 * @param {Object} params
 * @param {string} [params.start_date]
 * @param {string} [params.end_date]
 * @param {string} [params.type]
 * @param {string|number} [params.category_id]
 * @param {string|number} [params.account_id]
 */
export const exportReportCSV = (params = {}) => {
  const qs = new URLSearchParams();
  if (params.start_date)  qs.append("start_date",  params.start_date);
  if (params.end_date)    qs.append("end_date",    params.end_date);
  if (params.type)        qs.append("type",        params.type);
  if (params.category_id) qs.append("category_id", params.category_id);
  if (params.account_id)  qs.append("account_id",  params.account_id);

  // Build full API URL with auth token
  const token = typeof window !== "undefined"
    ? localStorage.getItem("token") || sessionStorage.getItem("token")
    : null;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const url = `${baseUrl}/reports/export?${qs.toString()}`;

  // Create link with Authorization header workaround via fetch + blob
  if (!token) {
    console.warn("No token found for CSV export");
    return;
  }

  fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Export gagal");
      return res.blob();
    })
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `MoneFin_LaporanKeuangan_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    })
    .catch((err) => {
      console.error("Export CSV error:", err);
    });
};
