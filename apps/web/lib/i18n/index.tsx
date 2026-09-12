"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { en, fr, type Dict, type LangId } from "./dictionary";

interface I18nValue {
  lang: LangId;
  setLang: (lang: LangId) => void;
  t: (key: keyof Dict | string) => string;
}

const I18nContext = createContext<I18nValue>({
  lang: "fr",
  setLang: () => {},
  t: (k) => k,
});

const STORAGE_KEY = "flowmind_lang";

function readInitialLang(): LangId {
  if (typeof window === "undefined") return "fr";
  return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "fr";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangId>(readInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang: setLangState,
      t: (key: string) => {
        const dict: Dict = lang === "en" ? en : fr;
        return dict[key as keyof Dict] ?? (lang === "en" ? fr[key as keyof Dict] ?? key : key);
      },
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}