"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import id from "../locales/id.json";
import en from "../locales/en.json";
import { useAuth } from "../hooks/useAuth";

const MESSAGES = { id, en };
const SUPPORTED_LOCALES = ["id", "en"];
const DEFAULT_LOCALE = "id";
const COOKIE_NAME = "NEXT_LOCALE"; // same convention as next-intl for future compatibility

const LanguageContext = createContext();

/** Read locale from cookie */
function getCookieLocale() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;)\\s*${COOKIE_NAME}=([^;]+)`));
  const val = match ? decodeURIComponent(match[1]) : null;
  return SUPPORTED_LOCALES.includes(val) ? val : null;
}

/** Persist locale to cookie (30 days) — same convention as next-intl */
function setCookieLocale(lang) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 30;
  document.cookie = `${COOKIE_NAME}=${lang};path=/;max-age=${maxAge};SameSite=Lax`;
}

/** Update <html lang="..."> for accessibility & SEO */
function updateHtmlLang(lang) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang;
  }
}

export function LanguageProvider({ children }) {
  const { user } = useAuth();

  // Priority order: cookie → localStorage → default
  const getInitialLanguage = () => {
    const cookie = getCookieLocale();
    if (cookie) return cookie;
    if (typeof localStorage !== "undefined") {
      const ls = localStorage.getItem("language");
      if (SUPPORTED_LOCALES.includes(ls)) return ls;
    }
    return DEFAULT_LOCALE;
  };

  const [language, setLanguage] = useState(getInitialLanguage);

  // Internal apply — updates state, cookie, localStorage, and html lang attribute
  const applyLanguage = useCallback((lang) => {
    if (!SUPPORTED_LOCALES.includes(lang)) return;
    setLanguage(lang);
    setCookieLocale(lang);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("language", lang);
    }
    updateHtmlLang(lang);
  }, []);

  // Sync with DB user preferences (highest priority, runs after login)
  useEffect(() => {
    if (user?.preferences?.language && SUPPORTED_LOCALES.includes(user.preferences.language)) {
      applyLanguage(user.preferences.language);
    }
  }, [user, applyLanguage]);

  // Ensure html lang is correct on mount
  useEffect(() => {
    updateHtmlLang(language);
  }, [language]);

  /**
   * changeLanguage — instant switch (for Navbar, Landing, Sidebar).
   * In Settings, language is changed globally only after "Save Preferences".
   */
  const changeLanguage = useCallback((lang) => {
    applyLanguage(lang);
  }, [applyLanguage]);

  /**
   * t(key) — translate a dot-notated key e.g. "dashboard.title"
   * Returns the key itself as fallback if not found.
   */
  const t = useCallback((key) => {
    const messages = MESSAGES[language] ?? MESSAGES[DEFAULT_LOCALE];
    const keys = key.split(".");
    let value = messages;
    for (const k of keys) {
      if (value === undefined || value === null || typeof value !== "object") return key;
      if (!(k in value)) return key;
      value = value[k];
    }
    return typeof value === "string" ? value : key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, supportedLocales: SUPPORTED_LOCALES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}

