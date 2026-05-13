import type { Metadata } from 'next';
import { ExternalLink } from 'lucide-react';

import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { MAP_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Live Health Outbreak Map',
  description:
    'Open the dedicated HantaMap live tracker for outbreak maps, countries, cases, and public-health updates.',
  alternates: {
    canonical: '/hantavirus-map-live',
  },
};

export default function HantavirusMapLivePage() {
  return (
    <>
      <SiteHeader />

      <main className="min-h-dvh bg-slate-50 px-4 py-14 text-slate-950 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
            Live map
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.055em] sm:text-6xl">
            Open the live outbreak map.
          </h1>

          <p className="mt-5 text-base leading-8 text-slate-600">
            The interactive outbreak map is hosted on our dedicated tracker
            website. Click below to open HantaMap in a new tab.
          </p>

          <a
            href={MAP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 bg-blue-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
          >
            Open HantaMap
            <ExternalLink className="h-4 w-4" />
          </a>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}