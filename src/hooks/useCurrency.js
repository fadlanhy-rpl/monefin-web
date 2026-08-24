"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency as utilFormatCurrency } from "@/lib/utils";
import { getLiveRates, SUPPORTED_CURRENCIES } from "@/lib/currency";

export function useCurrency() {
  const { user } = useAuth();
  const currencyPref = user?.preferences?.currency || "IDR";

  // rates menyimpan { IDR, USD, EUR, SGD } dalam unit per 1 USD
  const [rates, setRates] = useState({ IDR: 15500, USD: 1, EUR: 0.92, SGD: 1.35 });

  useEffect(() => {
    if (currencyPref !== "IDR") {
      getLiveRates().then(setRates);
    }
  }, [currencyPref]);

  /**
   * Menghitung exchange rate yang dipakai untuk konversi dari IDR ke currency target.
   * Logika: base adalah IDR, jadi kita butuh "berapa unit currency target per 1 IDR"
   * Tapi formatCurrency di utils.ts menerima "IDR to target" sebagai: num / exchangeRate
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

  const formatMoney = (value) => {
    return utilFormatCurrency(value, currencyPref, exchangeRate);
  };

  const formatCompact = (value) => {
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
      return sign + sym + abs.toFixed(2);
    }

    // IDR compact format
    const abs = Math.abs(num);
    const sign = num < 0 ? "-" : "";
    if (abs >= 1_000_000_000) return sign + (abs / 1_000_000_000).toFixed(1) + "M";
    if (abs >= 1_000_000)     return sign + (abs / 1_000_000).toFixed(1) + "Jt";
    if (abs >= 1_000)         return sign + (abs / 1_000).toFixed(0) + "Rb";
    return String(num);
  };

  return {
    formatCurrency: formatMoney,
    formatCompact,
    currencyCode: currencyPref,
    currencySymbol,
    exchangeRate,
  };
}
