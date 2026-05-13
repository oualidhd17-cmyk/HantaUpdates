import type { Metadata } from 'next';

import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';

export const metadata: Metadata = {
  title: 'HantaUpdates FAQ',
  description:
    'Frequently asked questions about HantaUpdates, health news, sources, and medical disclaimer.',
};

const faqs = [
  {
    question: 'What is HantaUpdates?',
    answer:
      'HantaUpdates is a global health news and trend-monitoring website covering public-health alerts, medical research, wellness, outbreaks, and healthcare technology.',
  },
  {
    question: 'Is HantaUpdates only about Hantavirus?',
    answer:
      'No. The site covers global health topics. The live outbreak map is hosted separately on HantaMap.',
  },
  {
    question: 'Does HantaUpdates provide medical advice?',
    answer:
      'No. The website is informational only and does not provide medical advice, diagnosis, or treatment.',
  },
  {
    question: 'Where does the content come from?',
    answer:
      'Articles are generated from public health feeds, Google News RSS trends, official agencies, and reputable regional sources where available.',
  },
];

export default function FaqPage() {
  return (
    <>
      <SiteHeader />

      <main className="min-h-dvh bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <section className="border border-slate-200 bg-white p-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
              FAQ
            </p>

            <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.055em] sm:text-5xl">
              Frequently asked questions.
            </h1>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Simple answers about how HantaUpdates works and how to read
              health updates responsibly.
            </p>
          </section>

          <section className="mt-5 space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                open={index === 0}
                className="group border border-slate-200 bg-white p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-extrabold">
                  <span>{faq.question}</span>
                  <span className="text-xl text-slate-400 group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="mt-4 border-t border-slate-200 pt-4 text-sm leading-8 text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}