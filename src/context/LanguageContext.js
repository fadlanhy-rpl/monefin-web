"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import id from "../locales/id.json";
import en from "../locales/en.json";
import { useAuth } from "../hooks/useAuth";

const MESSAGES = { id, en };
const SUPPORTED_LOCALES = ["en", "id"];
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
  const { user, updateProfile } = useAuth();
  const optimisticLangRef = useRef(null);

  // Always initialize with DEFAULT_LOCALE to guarantee 100% server/client HTML match during initial hydration
  const [language, setLanguage] = useState(DEFAULT_LOCALE);

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

  // Hydrate from localStorage/cookie after initial client mount (prevents SSR hydration mismatch)
  useEffect(() => {
    const persisted = getCookieLocale() || (typeof localStorage !== "undefined" && localStorage.getItem("language"));
    if (persisted && SUPPORTED_LOCALES.includes(persisted)) {
      setLanguage(persisted);
      updateHtmlLang(persisted);
    }
  }, []);

  // Keep HTML lang attribute in sync
  useEffect(() => {
    updateHtmlLang(language);
  }, [language]);

  // Single Source of Truth (SSOT):
  // When user is authenticated, user.preferences.language is the authoritative source of truth
  // and mirrors one-way to local cookie/localStorage without firing background updateProfile overwrites.
  useEffect(() => {
    if (!user) {
      optimisticLangRef.current = null;
      return;
    }

    const userLang = user.preferences?.language;
    if (userLang && SUPPORTED_LOCALES.includes(userLang)) {
      if (optimisticLangRef.current === userLang) {
        optimisticLangRef.current = null;
      }
      const targetLang = optimisticLangRef.current || userLang;
      if (language !== targetLang) {
        applyLanguage(targetLang);
      }
    }
  }, [user, language, applyLanguage]);

  /**
   * changeLanguage — instant switch (for Navbar, Landing, Sidebar, Header, Settings)
   */
  const changeLanguage = useCallback((lang, options = { syncBackend: true }) => {
    if (!SUPPORTED_LOCALES.includes(lang)) return;
    if (user) {
      optimisticLangRef.current = lang;
    }
    applyLanguage(lang);

    // If logged in and explicitly requested, persist to backend user preferences
    if (
      options?.syncBackend !== false &&
      user &&
      typeof updateProfile === "function" &&
      user.preferences?.language !== lang
    ) {
      const newPrefs = { ...(user.preferences || {}), language: lang };
      const fd = new FormData();
      fd.append("name", user.name || "");
      if (user.phone) fd.append("phone", user.phone);
      if (user.occupation) fd.append("occupation", user.occupation);
      if (user.bio) fd.append("bio", user.bio);
      fd.append("preferences", JSON.stringify(newPrefs));
      updateProfile(fd).catch(err => console.warn("Language preference update error:", err));
    }
  }, [applyLanguage, user, updateProfile]);

  /**
   * t(key, fallback) — translate a dot-notated key e.g. "dashboard.title"
   */
  const t = useCallback((key, fallback) => {
    const formatFallback = (rawKey, fb) => {
      if (fb !== undefined) return fb;
      if (typeof rawKey === "string" && rawKey.includes(".")) {
        const last = rawKey.split(".").pop();
        if (last.startsWith("no_") || last.startsWith("empty_") || last.includes("empty")) {
          return language === "id" ? "Tidak ada data yang cocok" : "No matching data found";
        }
        return last.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      }
      return rawKey;
    };

    const messages = MESSAGES[language] ?? MESSAGES[DEFAULT_LOCALE];
    const keys = key.split(".");
    let value = messages;
    for (const k of keys) {
      if (value === undefined || value === null || typeof value !== "object") {
        return formatFallback(key, fallback);
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
        return formatFallback(key, fallback);
      }
      value = value[k];
    }
    return typeof value === "string" ? value : formatFallback(key, fallback);
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
