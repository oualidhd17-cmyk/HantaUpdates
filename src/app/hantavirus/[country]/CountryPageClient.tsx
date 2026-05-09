'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { useI18n } from '@/i18n/useI18n';
import { loadCountries, loadPoints } from '@/lib/data';
import { formatDateTime, formatNumber } from '@/lib/format';
import type { OutbreakCountry, OutbreakPoint } from '@/types/outbreak';

type CountryPageClientProps = {
  countrySlug: string;
};

function slugifyCountry(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeSlug(value: string): string {
  return decodeURIComponent(value).toLowerCase().trim();
}

export function CountryPageClient({ countrySlug }: CountryPageClientProps) {
  const { locale } = useI18n();
  const isArabic = locale === 'ar';

  const normalizedCountrySlug = useMemo(() => {
    return normalizeSlug(countrySlug);
  }, [countrySlug]);

  const [countries, setCountries] = useState<OutbreakCountry[]>([]);
  const [points, setPoints] = useState<OutbreakPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setIsLoading(true);

        const [countriesData, pointsData] = await Promise.all([
          loadCountries(),
          loadPoints(),
        ]);

        if (!mounted) {
          return;
        }

        setCountries(countriesData);
        setPoints(pointsData);
      } catch {
        if (!mounted) {
          return;
        }

        setCountries([]);
        setPoints([]);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const country = useMemo(() => {
    if (!normalizedCountrySlug) {
      return null;
    }

    return (
      countries.find(
        (item) => slugifyCountry(item.country) === normalizedCountrySlug,
      ) ?? null
    );
  }, [countries, normalizedCountrySlug]);

  const relatedPoints = useMemo(() => {
    if (!country) {
      return [];
    }

    return points.filter(
      (point) =>
        point.country.toLowerCase().trim() ===
        country.country.toLowerCase().trim(),
    );
  }, [country, points]);

  if (isLoading) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-black px-6 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-red-500" />
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-white/45">
            Loading country data
          </p>
        </div>
      </main>
    );
  }

  if (!country) {
    return (
      <main
        dir={isArabic ? 'rtl' : 'ltr'}
        className="min-h-dvh bg-black px-4 py-8 text-white sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="inline-flex border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/45 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            {isArabic ? 'العودة إلى اللوحة' : 'Back to dashboard'}
          </Link>

          <section className="mt-8 border border-red-500/20 bg-red-500/10 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-300/80">
              HantaUpdates
            </p>

            <h1 className="mt-3 text-2xl font-bold text-red-100">
              {isArabic ? 'لم يتم العثور على الدولة' : 'Country not found'}
            </h1>

            <p className="mt-3 text-sm leading-7 text-white/60">
              {isArabic
                ? 'لا توجد بيانات متاحة لهذه الدولة حاليًا، أو أن الرابط غير صحيح.'
                : 'No outbreak data is currently available for this country, or the URL is invalid.'}
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-dvh bg-black px-4 py-8 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Link
          href="/"
          className="inline-flex border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/45 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
        >
          {isArabic ? 'العودة إلى اللوحة' : 'Back to dashboard'}
        </Link>

        <section className="mt-6 overflow-hidden border border-white/10 bg-[#050505] shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
          <div className="relative p-5 sm:p-7">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_36%)]" />

            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-300/75">
                HantaUpdates / Country report
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-white sm:text-6xl">
                {country.country}
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/55 sm:text-base">
                {isArabic
                  ? 'ملخص بيانات الدولة أو المنطقة من ملف البيانات العام للموقع.'
                  : 'Country or region summary from the public dashboard dataset.'}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-4">
          <div className="border border-white/10 bg-[#050505] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
              Confirmed
            </p>
            <div className="mt-3 font-mono text-4xl font-bold text-red-500">
              {formatNumber(country.confirmed)}
            </div>
          </div>

          <div className="border border-white/10 bg-[#050505] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
              Deaths
            </p>
            <div className="mt-3 font-mono text-4xl font-bold text-white">
              {formatNumber(country.deaths)}
            </div>
          </div>

          <div className="border border-white/10 bg-[#050505] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
              Risk level
            </p>
            <div className="mt-3 text-2xl font-bold uppercase text-amber-200">
              {country.risk_level}
            </div>
          </div>

          <div className="border border-white/10 bg-[#050505] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
              Last update
            </p>
            <div className="mt-3 text-sm font-bold text-white/75" dir="ltr">
              {formatDateTime(country.last_updated)}
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="border border-white/10 bg-[#050505] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
              Suspected
            </p>
            <div className="mt-3 font-mono text-3xl font-bold text-orange-300">
              {formatNumber(country.suspected)}
            </div>
          </div>

          <div className="border border-white/10 bg-[#050505] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
              Total identified
            </p>
            <div className="mt-3 font-mono text-3xl font-bold text-emerald-300">
              {formatNumber(country.total_identified)}
            </div>
          </div>

          <div className="border border-white/10 bg-[#050505] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
              Hospitalized
            </p>
            <div className="mt-3 font-mono text-3xl font-bold text-sky-300">
              {formatNumber(country.hospitalized)}
            </div>
          </div>
        </section>

        <section className="mt-4 border border-white/10 bg-[#050505]">
          <div className="border-b border-white/10 p-5">
            <h2 className="text-lg font-bold text-white">
              {isArabic ? 'النقاط المرتبطة' : 'Related locations'}
            </h2>

            <p className="mt-1 text-sm text-white/45">
              {isArabic
                ? 'المواقع المرتبطة بهذه الدولة على الخريطة.'
                : 'Map locations linked to this country.'}
            </p>
          </div>

          <div className="divide-y divide-white/10">
            {relatedPoints.length > 0 ? (
              relatedPoints.map((point) => {
                const content = (
                  <div className="grid gap-3 p-5 transition hover:bg-white/[0.035] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <div>
                      <h3 className="font-bold text-white">{point.name}</h3>
                      <p className="mt-1 text-xs text-white/45">
                        Source: {point.source}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm font-bold">
                      <span className="text-red-400">
                        {formatNumber(point.confirmed)} confirmed
                      </span>
                      <span className="text-white/65">
                        {formatNumber(point.deaths)} deaths
                      </span>
                    </div>
                  </div>
                );

                if (point.source_url) {
                  return (
                    <a
                      key={point.id}
                      href={point.source_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {content}
                    </a>
                  );
                }

                return <div key={point.id}>{content}</div>;
              })
            ) : (
              <div className="p-5 text-sm text-white/45">
                {isArabic
                  ? 'لا توجد نقاط خريطة مرتبطة بهذه الدولة حاليًا.'
                  : 'No map points are currently linked to this country.'}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}