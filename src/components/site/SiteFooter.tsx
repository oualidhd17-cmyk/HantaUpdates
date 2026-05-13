'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

import { useSiteLanguage } from '@/components/site/LanguageSwitcher';
import { MAP_URL } from '@/lib/site';

export function SiteFooter() {
  const { t } = useSiteLanguage();

  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1180px] gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div>
          <div className="text-base font-extrabold tracking-tight">
            HantaUpdates
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Global health news, medical trends, public-health explainers, and
            source-based updates. This website is informational only and does
            not provide medical advice.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-500">
          <Link href="/about" className="hover:text-slate-950">
            {t('nav.about')}
          </Link>
          <Link href="/sources" className="hover:text-slate-950">
            {t('nav.sources')}
          </Link>
          <Link href="/faq" className="hover:text-slate-950">
            {t('nav.faq')}
          </Link>
          <Link href="/medical-disclaimer" className="hover:text-slate-950">
            Disclaimer
          </Link>
          <a
            href={MAP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 hover:text-slate-950"
          >
            {t('nav.map')}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}