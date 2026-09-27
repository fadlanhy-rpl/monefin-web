"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency as utilFormatCurrency } from "@/lib/utils";
import { getLiveRates, SUPPORTED_CURRENCIES } from "@/lib/currency";

const CURRENCY_STORAGE_KEY = "monefin_currency";
const CURRENCY_COOKIE_NAME = "MONEFIN_CURRENCY";
const CURRENCY_EVENT_NAME = "monefin:currency-change";
const DEFAULT_CURRENCY = "IDR";

// Module-level sync trackers to prevent duplicate background profile updates across hook instances
let lastObservedUserPref = null;
let lastSyncedUserCurr = null;
let sharedRatesCache = { IDR: 15500, USD: 1, EUR: 0.92, SGD: 1.35 };

function getCookieCurrency() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;)\\s*${CURRENCY_COOKIE_NAME}=([^;]+)`));
  const val = match ? decodeURIComponent(match[1]) : null;
  return val && SUPPORTED_CURRENCIES[val] ? val : null;
}

function setCookieCurrency(curr) {
  if (typeof document === "undefined" || !SUPPORTED_CURRENCIES[curr]) return;
  const maxAge = 60 * 60 * 24 * 30; // 30 days
  document.cookie = `${CURRENCY_COOKIE_NAME}=${curr};path=/;max-age=${maxAge};SameSite=Lax`;
}

function applyLocalCurrency(curr) {
  if (typeof window === "undefined" || !curr || !SUPPORTED_CURRENCIES[curr]) return;
  setCookieCurrency(curr);
  localStorage.setItem(CURRENCY_STORAGE_KEY, curr);
  window.dispatchEvent(new CustomEvent(CURRENCY_EVENT_NAME, { detail: curr }));
}

function subscribeCurrencyStore(callback) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(CURRENCY_EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CURRENCY_EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}

function getCurrencySnapshot() {
  if (typeof window === "undefined") return null;
  const cookieVal = getCookieCurrency();
  if (cookieVal) return cookieVal;
  const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
  return saved && SUPPORTED_CURRENCIES[saved] ? saved : null;
}

function getServerCurrencySnapshot() {
  return null;
}

export function useCurrency() {
  const { user, updateProfile } = useAuth();
  const userCurrencyPref = user?.preferences?.currency;
  const localCurrency = useSyncExternalStore(
    subscribeCurrencyStore,
    getCurrencySnapshot,
    getServerCurrencySnapshot
  );

  // Bidirectional sync between local device choice (Landing/Navbar) and DB user.preferences.currency (Settings)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!user) {
      lastObservedUserPref = null;
      lastSyncedUserCurr = null;
      return;
    }

    const validUserPref =
      userCurrencyPref && SUPPORTED_CURRENCIES[userCurrencyPref] ? userCurrencyPref : null;
    const cookieCurr = getCookieCurrency();

    // Case 1: user.preferences.currency changed during an active session (e.g. saved in Settings)
    if (
      lastObservedUserPref !== null &&
      validUserPref &&
      validUserPref !== lastObservedUserPref
    ) {
      lastObservedUserPref = validUserPref;
      lastSyncedUserCurr = validUserPref;
      if (localCurrency !== validUserPref) {
        applyLocalCurrency(validUserPref);
      }
      return;
    }

    lastObservedUserPref = validUserPref;

    // Case 2: User has an explicit cookie choice on this device (e.g. switched on Landing Page)
    if (cookieCurr && SUPPORTED_CURRENCIES[cookieCurr]) {
      if (localStorage.getItem(CURRENCY_STORAGE_KEY) !== cookieCurr) {
        applyLocalCurrency(cookieCurr);
      }
      // Sync explicit device choice to backend if DB preference is different
      if (
        typeof updateProfile === "function" &&
        validUserPref !== cookieCurr &&
        lastSyncedUserCurr !== cookieCurr
      ) {
        lastSyncedUserCurr = cookieCurr;
        const newPrefs = { ...(user.preferences || {}), currency: cookieCurr };
        const fd = new FormData();
        fd.append("name", user.name || "");
        fd.append("preferences", JSON.stringify(newPrefs));
        updateProfile(fd).catch(() => {});
      }
    } else if (validUserPref) {
      // Case 3: No explicit cookie yet — adopt user's saved DB preference (e.g. from Settings or fresh login)
      lastSyncedUserCurr = validUserPref;
      if (localCurrency !== validUserPref || !cookieCurr) {
        applyLocalCurrency(validUserPref);
      }
    }
  }, [user, userCurrencyPref, localCurrency, updateProfile]);

  const currencyPref =
    (localCurrency && SUPPORTED_CURRENCIES[localCurrency] ? localCurrency : null) ||
    (userCurrencyPref && SUPPORTED_CURRENCIES[userCurrencyPref] ? userCurrencyPref : null) ||
    DEFAULT_CURRENCY;

  // rates menyimpan { IDR, USD, EUR, SGD } dalam unit per 1 USD
  const [rates, setRates] = useState(sharedRatesCache);

  useEffect(() => {
    getLiveRates().then((liveRates) => {
      if (liveRates) {
        sharedRatesCache = liveRates;
        setRates(liveRates);
      }
    });
  }, [currencyPref]);

  const changeCurrency = useCallback(
    (nextCurr, options = { syncBackend: true }) => {
      if (!nextCurr || !SUPPORTED_CURRENCIES[nextCurr]) return;
      lastObservedUserPref = nextCurr;
      lastSyncedUserCurr = nextCurr;
      applyLocalCurrency(nextCurr);

      if (
        options?.syncBackend !== false &&
        user &&
        typeof updateProfile === "function" &&
        user.preferences?.currency !== nextCurr
      ) {
        const newPrefs = { ...(user.preferences || {}), currency: nextCurr };
        const fd = new FormData();
        fd.append("name", user.name || "");
        fd.append("preferences", JSON.stringify(newPrefs));
        updateProfile(fd).catch(() => {});
      }
    },
    [user, updateProfile]
  );

  /**
   * Menghitung exchange rate yang dipakai untuk konversi dari IDR ke currency target.
   * Untuk USD: exchangeRate = rates.IDR (1 USD = rates.IDR IDR)
   * Untuk EUR: exchangeRate = rates.IDR / rates.EUR (1 EUR = N IDR)
   * Untuk SGD: exchangeRate = rates.IDR / rates.SGD (1 SGD = N IDR)
   */
  const getExchangeRate = () => {
    if (currencyPref === "IDR") return 1;
    if (currencyPref === "USD") return rates.IDR;
    if (currencyPref === "EUR") return rates.IDR / rates.EUR;
    if (currencyPref === "SGD") return rates.IDR / rates.SGD;
    return rates.IDR;
  };

  const exchangeRate = getExchangeRate();
  const currencyConfig = SUPPORTED_CURRENCIES[currencyPref] || SUPPORTED_CURRENCIES.IDR;
  const currencySymbol = currencyConfig.symbol;

  const formatMoney = useCallback(
    (value) => {
      return utilFormatCurrency(value, currencyPref, exchangeRate);
    },
    [currencyPref, exchangeRate]
  );

  const formatCompact = useCallback(
    (value, withPrefix = false) => {
      let num = typeof value === "string" ? parseFloat(value) : value;
      if (isNaN(num)) num = 0;

      if (currencyPref !== "IDR") {
        const converted = num / exchangeRate;
        const abs = Math.abs(converted);
        const sign = converted < 0 ? "-" : "";
        const sym = currencySymbol;
        if (abs >= 1_000_000_000) return sign + sym + (abs / 1_000_000_000).toFixed(1) + "B";
        if (abs >= 1_000_000)     return sign + sym + (abs / 1_000_000).toFixed(1) + "M";
        if (abs >= 1_000)         return sign + sym + (abs / 1_000).toFixed(1) + "K";
        return sign + sym + abs.toFixed(0);
      }

      // IDR compact format
      const abs = Math.abs(num);
      const sign = num < 0 ? "-" : "";
      const prefix = withPrefix ? "Rp " : "";
      if (abs >= 1_000_000_000) return sign + prefix + (abs / 1_000_000_000).toFixed(1) + "M";
      if (abs >= 1_000_000)     return sign + prefix + (abs / 1_000_000).toFixed(1).replace(/\.0$/, "") + "Jt";
      if (abs >= 1_000)         return sign + prefix + (abs / 1_000).toFixed(0) + "Rb";
      return sign + prefix + String(num);
    },
    [currencyPref, exchangeRate, currencySymbol]
  );

  /**
   * Converts inline "Rp 80.000.000" substrings inside backend-generated AI/Engine text
   * into the user's active currency when currencyPref !== "IDR".
   */
  const replaceInlineCurrency = useCallback(
    (text) => {
      if (!text || typeof text !== "string" || currencyPref === "IDR") return text;
      return text.replace(
        /Rp\.?\s*(\d{1,3}(?:\.\d{3})+|\d+)(?:,\d{1,2})?/g,
        (match, digits) => {
          const rawNum = parseFloat(String(digits).replace(/\./g, ""));
          if (isNaN(rawNum)) return match;
          return utilFormatCurrency(rawNum, currencyPref, exchangeRate);
        }
      );
    },
    [currencyPref, exchangeRate]
  );

  return {
    formatCurrency: formatMoney,
    formatCompact,
    replaceInlineCurrency,
    changeCurrency,
    currencyCode: currencyPref,
    currencySymbol,
    exchangeRate,
    rates,
    supportedCurrencies: SUPPORTED_CURRENCIES,
  };
}


