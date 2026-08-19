"use client";

import { useAuth } from "@/hooks/useAuth";
import { formatCurrency as utilFormatCurrency } from "@/lib/utils";

export function useCurrency() {
  const { user } = useAuth();
  const currencyPref = user?.preferences?.currency || "IDR";

  const formatMoney = (value) => {
    return utilFormatCurrency(value, currencyPref);
  };

  return { formatCurrency: formatMoney, currencyCode: currencyPref };
}
