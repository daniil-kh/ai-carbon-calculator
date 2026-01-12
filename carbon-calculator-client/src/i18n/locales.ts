export const locales = ["en", "pl", "sk", "de", "it", "hr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  pl: "Polski",
  sk: "Slovenčina",
  de: "Deutsch",
  it: "Italiano",
  hr: "Hrvatski",
};

