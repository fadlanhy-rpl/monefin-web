"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency as utilFormatCurrency } from "@/lib/utils";
import { getLiveRates, SUPPORTED_CURRENCIES } from "@/lib/currency";

const CURRENCY_STORAGE_KEY = "monefin_currency";
const CURRENCY_EVENT_NAME = "monefin:currency-change";

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

  // Sync user preference from profile into localStorage if none is set yet
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      userCurrencyPref &&
      SUPPORTED_CURRENCIES[userCurrencyPref]
    ) {
      const currentSaved = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (!currentSaved) {
        localStorage.setItem(CURRENCY_STORAGE_KEY, userCurrencyPref);
        window.dispatchEvent(new CustomEvent(CURRENCY_EVENT_NAME, { detail: userCurrencyPref }));
      }
    }
  }, [userCurrencyPref]);

  const currencyPref =
    (localCurrency && SUPPORTED_CURRENCIES[localCurrency] ? localCurrency : null) ||
    (userCurrencyPref && SUPPORTED_CURRENCIES[userCurrencyPref] ? userCurrencyPref : null) ||
    "IDR";

  // rates menyimpan { IDR, USD, EUR, SGD } dalam unit per 1 USD
  const [rates, setRates] = useState({ IDR: 15500, USD: 1, EUR: 0.92, SGD: 1.35 });

  useEffect(() => {
    getLiveRates().then(setRates);
  }, [currencyPref]);

  const changeCurrency = useCallback(
    (nextCurr) => {
      if (!nextCurr || !SUPPORTED_CURRENCIES[nextCurr]) return;
      if (typeof window !== "undefined") {
        localStorage.setItem(CURRENCY_STORAGE_KEY, nextCurr);
        window.dispatchEvent(new CustomEvent(CURRENCY_EVENT_NAME, { detail: nextCurr }));
      }
      if (user && typeof updateProfile === "function" && user.preferences?.currency !== nextCurr) {
        lastUserPrefRef.current = nextCurr;
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

  return {
    formatCurrency: formatMoney,
    formatCompact,
    changeCurrency,
    currencyCode: currencyPref,
    currencySymbol,
    exchangeRate,
    rates,
    supportedCurrencies: SUPPORTED_CURRENCIES,
  };
}

