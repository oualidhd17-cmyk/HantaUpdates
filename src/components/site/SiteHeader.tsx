'use client';

import Link from 'next/link';
import { Activity, ExternalLink } from 'lucide-react';

import { useSiteLanguage, LanguageSwitcher } from '@/components/site/LanguageSwitcher';
import { MAP_URL } from '@/lib/site';

export function SiteHeader() {
  const { t } = useSiteLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-blue-100 bg-blue-50 text-blue-700">
            <Activity className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="truncate text-base font-extrabold tracking-tight text-slate-950">
              HantaUpdates
            </div>
            <div className="truncate text-xs font-medium text-slate-500">
              Global Health Briefing
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/" className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
            {t('nav.home')}
          </Link>

          <Link href="/news" className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
            {t('nav.news')}
          </Link>

          <Link href="/sources" className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
            {t('nav.sources')}
          </Link>

          <Link href="/about" className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
            {t('nav.about')}
          </Link>

          <Link href="/faq" className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
            {t('nav.faq')}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <a
            href={MAP_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 bg-blue-700 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-blue-800 sm:inline-flex"
          >
            {t('nav.map')}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}