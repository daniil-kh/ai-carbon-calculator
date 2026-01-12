"use client";

import { localeLabels, locales, type Locale } from "../i18n/locales";
import { useI18n } from "../i18n/I18nProvider";

export function LanguageSelect(props: { className?: string }) {
  const { locale, setLocale } = useI18n();

  return (
    <select
      className={props.className}
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      aria-label="Language"
    >
      {locales.map((l) => (
        <option key={l} value={l}>
          {localeLabels[l]}
        </option>
      ))}
    </select>
  );
}

