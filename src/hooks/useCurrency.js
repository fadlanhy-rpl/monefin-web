"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency as utilFormatCurrency } from "@/lib/utils";
import { getLiveExchangeRate } from "@/lib/currency";

export function useCurrency() {
  const { user } = useAuth();
  const currencyPref = user?.preferences?.currency || "IDR";
  const [exchangeRate, setExchangeRate] = useState(15500); // default

  useEffect(() => {
    if (currencyPref === 'USD') {
      getLiveExchangeRate().then(rate => {
        setExchangeRate(rate);
      });
    }
  }, [currencyPref]);

  const formatMoney = (value) => {
    return utilFormatCurrency(value, currencyPref, exchangeRate);
  };

  const formatCompact = (value) => {
    let num = typeof value === 'string' ? parseFloat(value) : value;
    if (currencyPref === 'USD') {
      num = num / exchangeRate;
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(num);
    }
    const abs = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    if (abs >= 1_000_000_000) return sign + (abs / 1_000_000_000).toFixed(1) + "M";
    if (abs >= 1_000_000) return sign + (abs / 1_000_000).toFixed(1) + "Jt";
    if (abs >= 1_000) return sign + (abs / 1_000).toFixed(0) + "Rb";
    return String(num);
  };

  const currencySymbol = currencyPref === 'USD' ? '$' : 'Rp';

  return { formatCurrency: formatMoney, formatCompact, currencyCode: currencyPref, currencySymbol, exchangeRate };
}
