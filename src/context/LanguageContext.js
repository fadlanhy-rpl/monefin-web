"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import id from "../locales/id.json";
import en from "../locales/en.json";
import { useAuth } from "../hooks/useAuth";
import { updateProfile } from "../services/auth.service";

const MESSAGES = { id, en };
const SUPPORTED_LOCALES = ["en", "id"];
const DEFAULT_LOCALE = "en";
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
  const lastSyncedUserLang = useRef(null);

  // Initialize with persisted locale or default
  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      const persisted = getCookieLocale() || localStorage.getItem("language");
      if (persisted && SUPPORTED_LOCALES.includes(persisted)) {
        return persisted;
      }
    }
    return DEFAULT_LOCALE;
  });

  // Apply language locally (state, cookie, localStorage, html lang)
  const applyLanguage = useCallback((lang) => {
    if (!SUPPORTED_LOCALES.includes(lang)) return;
    setLanguage(lang);
    setCookieLocale(lang);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("language", lang);
    }
    updateHtmlLang(lang);
  }, []);

  // Hydrate on mount
  useEffect(() => {
    const persisted = getCookieLocale() || (typeof localStorage !== "undefined" && localStorage.getItem("language"));
    if (persisted && SUPPORTED_LOCALES.includes(persisted)) {
      setLanguage(persisted);
      updateHtmlLang(persisted);
    }
  }, []);

  // Keep HTML lang in sync
  useEffect(() => {
    updateHtmlLang(language);
  }, [language]);

  // Synchronize DB user preferences without overriding active session choice
  useEffect(() => {
    if (!user) {
      lastSyncedUserLang.current = null;
      return;
    }

    const currentLocal = getCookieLocale() || (typeof localStorage !== "undefined" && localStorage.getItem("language"));

    if (currentLocal && SUPPORTED_LOCALES.includes(currentLocal)) {
      // User has an explicit active choice on this device
      if (language !== currentLocal) {
        applyLanguage(currentLocal);
      }

      // If DB preference is outdated compared to active device choice, update DB in background
      if (user.preferences?.language !== currentLocal && lastSyncedUserLang.current !== currentLocal) {
        lastSyncedUserLang.current = currentLocal;
        const newPrefs = { ...(user.preferences || {}), language: currentLocal };
        const fd = new FormData();
        fd.append("name", user.name || "");
        fd.append("preferences", JSON.stringify(newPrefs));
        updateProfile(fd).catch(err => console.warn("Background language preference sync error:", err));
      }
    } else if (user.preferences?.language && SUPPORTED_LOCALES.includes(user.preferences.language)) {
      // First-time visit / fresh device: adopt DB preference
      applyLanguage(user.preferences.language);
    }
  }, [user, language, applyLanguage]);

  /**
   * changeLanguage — instant switch (for Navbar, Landing, Sidebar, Header, Settings)
   */
  const changeLanguage = useCallback((lang) => {
    if (!SUPPORTED_LOCALES.includes(lang)) return;
    applyLanguage(lang);

    // If logged in, persist to backend user preferences
    if (user) {
      lastSyncedUserLang.current = lang;
      const newPrefs = { ...(user.preferences || {}), language: lang };
      const fd = new FormData();
      fd.append("name", user.name || "");
      fd.append("preferences", JSON.stringify(newPrefs));
      updateProfile(fd).catch(err => console.warn("Language preference update error:", err));
    }
  }, [applyLanguage, user]);

  /**
   * t(key, fallback) — translate a dot-notated key e.g. "dashboard.title"
   */
  const t = useCallback((key, fallback) => {
    const messages = MESSAGES[language] ?? MESSAGES[DEFAULT_LOCALE];
    const keys = key.split(".");
    let value = messages;
    for (const k of keys) {
      if (value === undefined || value === null || typeof value !== "object") {
        return fallback !== undefined ? fallback : key;
      }
      if (!(k in value)) {
        // Fallback to DEFAULT_LOCALE
        const defaultMessages = MESSAGES[DEFAULT_LOCALE];
        let defVal = defaultMessages;
        for (const dk of keys) {
          if (defVal === undefined || defVal === null || typeof defVal !== "object") break;
          defVal = defVal[dk];
        }
        if (typeof defVal === "string") return defVal;
        return fallback !== undefined ? fallback : key;
      }
      value = value[k];
    }
    return typeof value === "string" ? value : (fallback !== undefined ? fallback : key);
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
