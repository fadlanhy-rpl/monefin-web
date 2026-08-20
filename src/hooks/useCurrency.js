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

  return { formatCurrency: formatMoney, currencyCode: currencyPref, exchangeRate };
}
