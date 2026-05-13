'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  DEFAULT_LOCALE,
  getLocaleDirection,
  isAppLocale,
  LOCALES,
  translate,
  type AppLocale,
  type TranslationKey,
} from '@/lib/i18n';

const STORAGE_KEY = 'hantaupdates_locale';

function getInitialLocale(): AppLocale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (isAppLocale(saved)) {
    return saved;
  }

  const browser = window.navigator.language.slice(0, 2);

  if (isAppLocale(browser)) {
    return browser;
  }

  return DEFAULT_LOCALE;
}

export function useSiteLanguage() {
  const [locale, setLocaleState] = useState<AppLocale>(DEFAULT_LOCALE);

  useEffect(() => {
    const nextLocale = getInitialLocale();
    setLocaleState(nextLocale);
    document.documentElement.lang = nextLocale;
    document.documentElement.dir = getLocaleDirection(nextLocale);
  }, []);

  const setLocale = (nextLocale: AppLocale) => {
    setLocaleState(nextLocale);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextLocale);
      document.documentElement.lang = nextLocale;
      document.documentElement.dir = getLocaleDirection(nextLocale);
      window.dispatchEvent(new Event('hantaupdates-language-change'));
    }
  };

  const t = useMemo(() => {
    return (key: TranslationKey) => translate(locale, key);
  }, [locale]);

  return {
    locale,
    dir: getLocaleDirection(locale),
    setLocale,
    t,
  };
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useSiteLanguage();

  return (
    <label className="inline-flex items-center gap-2 border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
      <span className="hidden sm:inline">Language</span>

      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as AppLocale)}
        className="bg-transparent text-xs font-semibold text-slate-900 outline-none"
        aria-label="Language"
      >
        {LOCALES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}