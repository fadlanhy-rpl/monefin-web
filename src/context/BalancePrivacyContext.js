"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const BalancePrivacyContext = createContext({
  isBalanceHidden: false,
  toggleBalancePrivacy: () => {},
  setBalanceHidden: () => {},
  isAccountHidden: () => false,
  toggleAccountPrivacy: () => {},
  maskValue: (val) => val,
});

const STORAGE_KEY = "monefin_balance_hidden";
const ACCOUNTS_STORAGE_KEY = "monefin_hidden_accounts";

export function BalancePrivacyProvider({ children }) {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [accountOverrides, setAccountOverrides] = useState({});
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

  const maskValue = useCallback(
    (formattedValue, forceHidden = null) => {
      const hidden = forceHidden !== null ? forceHidden : isBalanceHidden;
      if (!hidden) return formattedValue;
      return "••••••••";
    },
    [isBalanceHidden]
  );

  return (
    <BalancePrivacyContext.Provider
      value={{
        isBalanceHidden,
        toggleBalancePrivacy,
        setBalanceHidden,
        isAccountHidden,
        toggleAccountPrivacy,
        maskValue,
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
