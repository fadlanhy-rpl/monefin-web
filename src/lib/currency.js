// Primary: ExchangeRate-API v6 (paid, with API key)
const EXCHANGE_RATE_API_V6 = "https://v6.exchangerate-api.com/v6/afce414b970a7edd65b756e9/latest/USD";
// Fallback: ExchangeRate-API v4 (free, no key needed)
const EXCHANGE_RATE_API_FREE = "https://api.exchangerate-api.com/v4/latest/USD";

const CACHE_KEY = "monefin_exchange_rates";
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Config mata uang yang didukung.
 * fallback_from_usd: Fallback kurs jika SEMUA API gagal (1 USD = N unit)
 */
export const SUPPORTED_CURRENCIES = {
  IDR: { symbol: "Rp",  locale: "id-ID", decimals: 0, fallback_from_usd: 15500 },
  USD: { symbol: "$",   locale: "en-US", decimals: 2, fallback_from_usd: 1     },
  EUR: { symbol: "€",   locale: "de-DE", decimals: 2, fallback_from_usd: 0.92  },
  SGD: { symbol: "S$",  locale: "en-SG", decimals: 2, fallback_from_usd: 1.35  },
};

const FALLBACK_RATES = { IDR: 15500, USD: 1, EUR: 0.92, SGD: 1.35 };

/**
 * Coba fetch dari satu endpoint, kembalikan rates object atau null jika gagal.
 * Support format v6 (data.conversion_rates) dan v4 (data.rates).
 */
async function fetchRatesFrom(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();

  // v6 format: { result: "success", conversion_rates: { IDR: ..., EUR: ... } }
  // v4 format: { rates: { IDR: ..., EUR: ... } }
  const raw = data.conversion_rates ?? data.rates;
  if (!raw || !raw.IDR) throw new Error("Invalid rate data");

  return {
    IDR: raw.IDR ?? FALLBACK_RATES.IDR,
    USD: 1,
    EUR: raw.EUR ?? FALLBACK_RATES.EUR,
    SGD: raw.SGD ?? FALLBACK_RATES.SGD,
  };
}

/**
 * Mengambil semua nilai tukar live (vs USD) dengan fallback bertingkat:
 *   1. Cache harian di localStorage
 *   2. API v6 (paid, dengan API key)
 *   3. API v4 (free, tanpa key)
 *   4. Hardcoded fallback
 *
 * Mengembalikan object { IDR, USD, EUR, SGD } dalam nilai per 1 USD.
 */
export async function getLiveRates() {
  if (typeof window === "undefined") {
    return FALLBACK_RATES; // SSR fallback
  }

  // 1. Coba cache dulu
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { rates, timestamp } = JSON.parse(cachedData);
      const now = new Date().getTime();
      if (now - timestamp < CACHE_DURATION_MS) {
        return rates;
      }
    }
  } catch (_) { /* ignore cache parse errors */ }

  // 2. Coba API v6 (paid)
  try {
    const rates = await fetchRatesFrom(EXCHANGE_RATE_API_V6);
    localStorage.setItem(CACHE_KEY, JSON.stringify({ rates, timestamp: Date.now() }));
    return rates;
  } catch (err) {
    console.warn("ExchangeRate-API v6 failed, trying free API:", err.message);
  }

  // 3. Fallback ke API v4 (free)
  try {
    const rates = await fetchRatesFrom(EXCHANGE_RATE_API_FREE);
    localStorage.setItem(CACHE_KEY, JSON.stringify({ rates, timestamp: Date.now() }));
    return rates;
  } catch (err) {
    console.error("All exchange rate APIs failed:", err.message);
  }

  // 4. Hardcoded fallback
  return FALLBACK_RATES;
}

/**
 * Backward-compat: mengembalikan kurs IDR saja (untuk komponen lama)
 * @deprecated Gunakan getLiveRates()
 */
export async function getLiveExchangeRate() {
  const rates = await getLiveRates();
  return rates.IDR;
}
