import type { Metadata } from 'next';

import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';

export const metadata: Metadata = {
  title: 'Medical Disclaimer',
  description:
    'HantaUpdates is informational only and does not provide medical advice, diagnosis, or treatment.',
};

export default function MedicalDisclaimerPage() {
  return (
    <>
      <SiteHeader />

      <main className="min-h-dvh bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl border border-amber-200 bg-amber-50 p-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">
            Information only
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.055em] sm:text-5xl">
            Medical disclaimer
          </h1>

          <p className="mt-6 text-base leading-8 text-amber-900/80">
            HantaUpdates is for informational purposes only. It does not provide
            medical advice, diagnosis, or treatment. Always follow guidance from
            your local health authority or a qualified medical professional.
          </p>

          <p className="mt-4 text-base leading-8 text-amber-900/80">
            Health news can change quickly. Always verify important information
            through official sources or professional medical guidance.
          </p>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}