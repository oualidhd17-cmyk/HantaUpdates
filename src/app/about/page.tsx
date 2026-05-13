import type { Metadata } from 'next';

import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';

export const metadata: Metadata = {
  title: 'About HantaUpdates',
  description:
    'Learn about HantaUpdates, a global health news and medical trends website.',
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main className="min-h-dvh bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl border border-slate-200 bg-white p-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
            About
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.055em] sm:text-5xl">
            Global health updates without panic.
          </h1>

          <p className="mt-6 text-base leading-8 text-slate-600">
            HantaUpdates is a global health news and trend-monitoring website.
            It follows medical stories, public-health alerts, outbreaks,
            wellness topics, and healthcare technology trends from different
            regions around the world.
          </p>

          <p className="mt-4 text-base leading-8 text-slate-600">
            The goal is to present health information in a calm, useful, and
            source-aware style. We avoid panic-driven headlines and always link
            readers back to original sources when available.
          </p>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}