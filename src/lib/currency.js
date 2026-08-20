export const EXCHANGE_RATE_API = "https://api.exchangerate-api.com/v4/latest/USD";
const CACHE_KEY = "monefin_exchange_rate";
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Mengambil nilai tukar live USD ke IDR dan melakukan caching harian.
 */
export async function getLiveExchangeRate() {
  if (typeof window === "undefined") return 15500; // fallback for SSR

  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { rate, timestamp } = JSON.parse(cachedData);
      const now = new Date().getTime();
      
      // Jika cache masih valid (kurang dari 24 jam), gunakan cache
      if (now - timestamp < CACHE_DURATION_MS) {
        return rate;
      }
    }

    // Fetch rate baru jika cache tidak ada atau kadaluarsa
    const response = await fetch(EXCHANGE_RATE_API);
    const data = await response.json();
    
    if (data && data.rates && data.rates.IDR) {
      const liveRate = data.rates.IDR;
      
      // Simpan ke cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        rate: liveRate,
        timestamp: new Date().getTime()
      }));
      
      return liveRate;
    }
  } catch (error) {
    console.error("Failed to fetch live exchange rate:", error);
  }

  // Fallback rate jika API gagal
  return 15500;
}
