"use client";

import { createContext, useContext, useState, useEffect } from "react";
import id from "../locales/id.json";
import en from "../locales/en.json";
import { useAuth } from "../hooks/useAuth";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const { user } = useAuth();
  
  // Default language is 'id'. We check user.preferences first, then localStorage.
  const [language, setLanguage] = useState("id");

  useEffect(() => {
    // If logged in, prefer the database setting
    if (user?.preferences?.language) {
      setLanguage(user.preferences.language);
      localStorage.setItem("language", user.preferences.language);
    } else {
      // Otherwise fallback to localStorage
      const saved = localStorage.getItem("language");
      if (saved) setLanguage(saved);
    }
  }, [user]);

  // For unauthenticated users (e.g. on landing page) to change language
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key) => {
    const keys = key.split(".");
    let value = language === "en" ? en : id;
    for (const k of keys) {
      if (value[k] === undefined) {
        return key; // return key if not found
      }
      value = value[k];
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
