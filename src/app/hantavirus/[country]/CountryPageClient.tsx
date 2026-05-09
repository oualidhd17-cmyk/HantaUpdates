'use client';

import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Clock3,
  Globe2,
  MapPin,
  ShieldCheck,
  Skull,
} from 'lucide-react';

import { useI18n } from '@/i18n/useI18n';
import { formatDateTime, formatNumber } from '@/lib/format';
import type { OutbreakCountry } from '@/types/outbreak';

type CountryPageClientProps = {
  country: OutbreakCountry;
};

function getRiskLabel(value: string): string {
  if (!value) {
    return 'unknown';
  }

  return value.replace(/-/g, ' ');
}

function getRiskClass(value: string): string {
  if (value === 'critical') {
    return 'border-red-200 bg-red-50 text-red-700';
  }

  if (value === 'high') {
    return 'border-orange-200 bg-orange-50 text-orange-700';
  }

  if (value === 'moderate') {
    return 'border-amber-200 bg-amber-50 text-amber-700';
  }

  if (value === 'low') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }

  return 'border-slate-200 bg-slate-50 text-slate-600';
}

export function CountryPageClient({ country }: CountryPageClientProps) {
  const { locale } = useI18n();
  const isArabic = locale === 'ar';

  const statCards = [
    {
      label: isArabic ? 'الحالات المؤكدة' : 'Confirmed cases',
      value: country.confirmed,
      icon: Activity,
      tone: 'text-red-600',
    },
    {
      label: isArabic ? 'الوفيات' : 'Deaths',
      value: country.deaths,
      icon: Skull,
      tone: 'text-slate-900',
    },
    {
      label: isArabic ? 'غير مؤكدة' : 'Unconfirmed',
      value: country.unconfirmed ?? 0,
      icon: AlertTriangle,
      tone: 'text-amber-600',
    },
    {
      label: isArabic ? 'إجمالي مرصود' : 'Total identified',
      value: country.total_identified ?? country.confirmed,
      icon: Globe2,
      tone: 'text-blue-600',
    },
  ];

  return (
    <main
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-dvh bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {isArabic ? 'العودة إلى اللوحة' : 'Back to dashboard'}
        </Link>

        <section className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="relative overflow-hidden border-b border-slate-200 p-6 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.10),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.10),transparent_36%)]" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {isArabic ? 'بيانات من مصادر موثوقة' : 'Trusted public data'}
                </span>

                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] ${getRiskClass(
                    country.risk_level,
                  )}`}
                >
                  {getRiskLabel(country.risk_level)}
                </span>
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-6xl">
                {country.country}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                {isArabic
                  ? 'ملخص بيانات فيروس هانتا حسب الدولة/المنطقة بناءً على ملفات البيانات العامة في HantaUpdates.'
                  : 'Country-level hantavirus summary based on the public data files used by HantaUpdates.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-slate-500">
                {country.region ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                    <Globe2 className="h-4 w-4 text-slate-400" />
                    {country.region}
                  </span>
                ) : null}

                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2" dir="ltr">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {country.lat}, {country.lng}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2" dir="ltr">
                  <Clock3 className="h-4 w-4 text-slate-400" />
                  {formatDateTime(country.last_updated)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4 lg:p-8">
            {statCards.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.label}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      {item.label}
                    </p>

                    <Icon className={`h-5 w-5 ${item.tone}`} />
                  </div>

                  <div
                    dir="ltr"
                    className={`mt-5 font-mono text-4xl font-black tracking-[-0.06em] ${item.tone}`}
                  >
                    {formatNumber(item.value)}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-[-0.04em] text-slate-950">
              {isArabic ? 'تفاصيل الحالة' : 'Case details'}
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  {isArabic ? 'مشتبه بها' : 'Suspected'}
                </p>
                <p dir="ltr" className="mt-2 font-mono text-2xl font-black text-slate-950">
                  {formatNumber(country.suspected ?? 0)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  {isArabic ? 'محتملة' : 'Probable'}
                </p>
                <p dir="ltr" className="mt-2 font-mono text-2xl font-black text-slate-950">
                  {formatNumber(country.probable ?? 0)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  {isArabic ? 'قيد التحقيق' : 'Under investigation'}
                </p>
                <p dir="ltr" className="mt-2 font-mono text-2xl font-black text-slate-950">
                  {formatNumber(country.under_investigation ?? 0)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  {isArabic ? 'بانتظار النتائج' : 'Pending'}
                </p>
                <p dir="ltr" className="mt-2 font-mono text-2xl font-black text-slate-950">
                  {formatNumber(country.pending ?? 0)}
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-[-0.04em] text-slate-950">
              {isArabic ? 'تنبيه مهم' : 'Important note'}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              {isArabic
                ? 'هذه الصفحة تعرض معلومات عامة وليست نصيحة طبية. قد تتغير الأرقام عند تحديث المصادر الرسمية أو إعادة تصنيف الحالات.'
                : 'This page is for public information only and is not medical advice. Numbers may change when official sources update or reclassify cases.'}
            </p>

            <Link
              href="/sources"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-600"
            >
              {isArabic ? 'عرض مصادر البيانات' : 'View data sources'}
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
}