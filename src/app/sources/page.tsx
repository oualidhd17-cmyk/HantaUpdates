'use client';

import { useEffect, useState } from 'react';

import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { loadSources } from '@/lib/data';
import { formatDateTime } from '@/lib/format';
import type { OutbreakSource } from '@/types/outbreak';

const fallbackSources: OutbreakSource[] = [
  {
    id: 'who',
    name: 'World Health Organization',
    url: 'https://www.who.int/',
    type: 'official',
    confidence: 'high',
    last_checked_at: '',
  },
  {
    id: 'cdc',
    name: 'Centers for Disease Control and Prevention',
    url: 'https://www.cdc.gov/',
    type: 'official',
    confidence: 'high',
    last_checked_at: '',
  },
  {
    id: 'ecdc',
    name: 'European Centre for Disease Prevention and Control',
    url: 'https://www.ecdc.europa.eu/',
    type: 'health-agency',
    confidence: 'high',
    last_checked_at: '',
  },
];

export default function SourcesPage() {
  const [sources, setSources] = useState<OutbreakSource[]>([]);

  useEffect(() => {
    void loadSources()
      .then(setSources)
      .catch(() => setSources([]));
  }, []);

  const visibleSources = sources.length > 0 ? sources : fallbackSources;

  return (
    <>
      <SiteHeader />

      <main className="min-h-dvh bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <section className="border border-slate-200 bg-white p-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
              Sources
            </p>

            <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.055em] sm:text-5xl">
              Sources and references.
            </h1>

            <p className="mt-5 text-base leading-8 text-slate-600">
              HantaUpdates prioritizes official health agencies, reputable
              medical sources, and high-confidence public-health feeds.
            </p>
          </section>

          <section className="mt-5 grid gap-3">
            {visibleSources.map((source) => (
              <a
                key={source.id}
                href={source.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="card card-hover block p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-950">
                      {source.name}
                    </h2>

                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                      {source.type.replace(/-/g, ' ')} · {source.confidence} confidence
                    </p>

                    {source.last_checked_at ? (
                      <p className="mt-2 text-xs text-slate-500">
                        Last checked: {formatDateTime(source.last_checked_at)}
                      </p>
                    ) : null}
                  </div>

                  <span className="w-fit border border-teal-100 bg-teal-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-teal-700">
                    {source.confidence}
                  </span>
                </div>
              </a>
            ))}
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}