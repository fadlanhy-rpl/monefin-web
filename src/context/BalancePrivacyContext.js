"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const BalancePrivacyContext = createContext({
  isBalanceHidden: false,
  toggleBalancePrivacy: () => {},
  setBalanceHidden: () => {},
  isAccountHidden: () => false,
  toggleAccountPrivacy: () => {},
  isAccountNumberHidden: () => false,
  toggleAccountNumberPrivacy: () => {},
  isAllAccountNumbersHidden: false,
  toggleAllAccountNumbersPrivacy: () => {},
  maskValue: (val) => val,
  maskAccountNumber: (num) => num,
});

const STORAGE_KEY = "monefin_balance_hidden";
const ACCOUNTS_STORAGE_KEY = "monefin_hidden_accounts";
const ACC_NUM_ALL_KEY = "monefin_hide_account_numbers";
const ACC_NUM_OVERRIDES_KEY = "monefin_hidden_acc_nums";

export function BalancePrivacyProvider({ children }) {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [accountOverrides, setAccountOverrides] = useState({});
  const [isAllAccountNumbersHidden, setIsAllAccountNumbersHidden] = useState(false);
  const [accountNumberOverrides, setAccountNumberOverrides] = useState({});
  const [isMounted, setIsMounted] = useState(false);

  // Initialize from localStorage after client mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedGlobal = localStorage.getItem(STORAGE_KEY);
      if (savedGlobal !== null) {
        setIsBalanceHidden(savedGlobal === "true");
      }
      const savedAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (savedAccounts) {
        setAccountOverrides(JSON.parse(savedAccounts));
      }
      const savedAccNumAll = localStorage.getItem(ACC_NUM_ALL_KEY);
      if (savedAccNumAll !== null) {
        setIsAllAccountNumbersHidden(savedAccNumAll === "true");
      }
      const savedAccNums = localStorage.getItem(ACC_NUM_OVERRIDES_KEY);
      if (savedAccNums) {
        setAccountNumberOverrides(JSON.parse(savedAccNums));
      }
    } catch (e) {
      console.error("Failed to load balance privacy state from localStorage", e);
    }
  }, []);

  const toggleBalancePrivacy = useCallback(() => {
    setIsBalanceHidden((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
        // Reset individual overrides when global toggle is clicked so all sync seamlessly
        setAccountOverrides({});
        localStorage.removeItem(ACCOUNTS_STORAGE_KEY);
      } catch (e) {
        console.error("Failed to persist balance privacy state", e);
      }
      return next;
    });
  }, []);

  const setBalanceHidden = useCallback((val) => {
    setIsBalanceHidden(val);
    try {
      localStorage.setItem(STORAGE_KEY, String(val));
    } catch (e) {
      console.error("Failed to persist balance privacy state", e);
    }
  }, []);

  const isAccountHidden = useCallback(
    (accountId) => {
      if (!accountId) return isBalanceHidden;
      if (accountOverrides[accountId] !== undefined) {
        return accountOverrides[accountId];
      }
      return isBalanceHidden;
    },
    [isBalanceHidden, accountOverrides]
  );

  const toggleAccountPrivacy = useCallback(
    (accountId) => {
      if (!accountId) return;
      setAccountOverrides((prev) => {
        const currentlyHidden = prev[accountId] !== undefined ? prev[accountId] : isBalanceHidden;
        const nextOverrides = {
          ...prev,
          [accountId]: !currentlyHidden,
        };
        try {
          localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(nextOverrides));
        } catch (e) {
          console.error("Failed to persist account overrides", e);
        }
        return nextOverrides;
      });
    },
    [isBalanceHidden]
  );

  const toggleAllAccountNumbersPrivacy = useCallback(() => {
    setIsAllAccountNumbersHidden((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(ACC_NUM_ALL_KEY, String(next));
        setAccountNumberOverrides({});
        localStorage.removeItem(ACC_NUM_OVERRIDES_KEY);
      } catch (e) {
        console.error("Failed to persist account number privacy state", e);
      }
      return next;
    });
  }, []);

  const isAccountNumberHidden = useCallback(
    (accountId) => {
      if (!accountId) return isAllAccountNumbersHidden || isBalanceHidden;
      if (accountNumberOverrides[accountId] !== undefined) {
        return accountNumberOverrides[accountId];
      }
      return isAllAccountNumbersHidden || isBalanceHidden;
    },
    [isAllAccountNumbersHidden, isBalanceHidden, accountNumberOverrides]
  );

  const toggleAccountNumberPrivacy = useCallback(
    (accountId) => {
      if (!accountId) return;
      setAccountNumberOverrides((prev) => {
        const currentlyHidden =
          prev[accountId] !== undefined
            ? prev[accountId]
            : (isAllAccountNumbersHidden || isBalanceHidden);
        const nextOverrides = {
          ...prev,
          [accountId]: !currentlyHidden,
        };
        try {
          localStorage.setItem(ACC_NUM_OVERRIDES_KEY, JSON.stringify(nextOverrides));
        } catch (e) {
          console.error("Failed to persist account number overrides", e);
        }
        return nextOverrides;
      });
    },
    [isAllAccountNumbersHidden, isBalanceHidden]
  );

  const maskValue = useCallback(
    (formattedValue, forceHidden = null) => {
      const hidden = forceHidden !== null ? forceHidden : isBalanceHidden;
      if (!hidden) return formattedValue;
      return "••••••••";
    },
    [isBalanceHidden]
  );

  const maskAccountNumber = useCallback((accNum) => {
    if (!accNum) return "•••• •••• ••••";
    const str = String(accNum).trim();
    if (str.length <= 4) {
      return "••••••••";
    }
    // Standard fintech mask: keep last 4 digits visible for quick recognition, mask remainder
    const last4 = str.slice(-4);
    return `•••• •••• ${last4}`;
  }, []);

  return (
    <BalancePrivacyContext.Provider
      value={{
        isBalanceHidden,
        toggleBalancePrivacy,
        setBalanceHidden,
        isAccountHidden,
        toggleAccountPrivacy,
        isAccountNumberHidden,
        toggleAccountNumberPrivacy,
        isAllAccountNumbersHidden,
        toggleAllAccountNumbersPrivacy,
        maskValue,
        maskAccountNumber,
        isMounted,
      }}
    >
      {children}
    </BalancePrivacyContext.Provider>
  );
}

export function useBalancePrivacy() {
  const context = useContext(BalancePrivacyContext);
  if (!context) {
    throw new Error("useBalancePrivacy must be used within a BalancePrivacyProvider");
  }
  return context;
}
