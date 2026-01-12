/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultLocale, locales, type Locale } from "./locales";
import { translations, type TranslationKey } from "./translations";

type I18nContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const v = vars[name];
    return v === undefined || v === null ? "" : String(v);
  });
}

function detectLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  const stored = window.localStorage.getItem("cc.locale");
  if (stored && (locales as readonly string[]).includes(stored)) return stored as Locale;

  const nav = (navigator.languages?.[0] ?? navigator.language ?? "").toLowerCase();
  if (nav.startsWith("pl")) return "pl";
  if (nav.startsWith("sk")) return "sk";
  if (nav.startsWith("de")) return "de";
  if (nav.startsWith("it")) return "it";
  if (nav.startsWith("hr")) return "hr";
  return "en";
}

export function I18nProvider(props: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectLocale());

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem("cc.locale", next);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // keep <html lang="..."> in sync
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => {
    const dict = translations[locale] ?? translations[defaultLocale];
    return {
      locale,
      setLocale,
      t: (key, vars) => {
        const template = dict[key] ?? translations[defaultLocale][key] ?? key;
        return interpolate(template, vars);
      },
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{props.children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

