'use client';

import Link from 'next/link';
import { ExternalLink, Newspaper, ShieldCheck, TrendingUp } from 'lucide-react';

import { useSiteLanguage } from '@/components/site/LanguageSwitcher';
import { MAP_URL } from '@/lib/site';
import type { BlogPost } from '@/lib/posts';

type HomePageClientProps = {
  posts: BlogPost[];
  categories: string[];
};

export function HomePageClient({ posts, categories }: HomePageClientProps) {
  const { t, dir } = useSiteLanguage();
  const featured = posts[0];
  const latest = posts.slice(1, 10);

  return (
    <main dir={dir} className="min-h-dvh bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
              <TrendingUp className="h-4 w-4" />
              {t('home.badge')}
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-[-0.055em] text-slate-950 sm:text-6xl">
              {t('home.title')}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              {t('home.description')}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/news"
                className="inline-flex items-center justify-center bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                {t('home.newsCta')}
              </Link>

              <a
                href={MAP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
              >
                {t('home.mapCta')}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
              <ShieldCheck className="h-4 w-4" />
              Editorial note
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              HantaUpdates summarizes health trends and public-health signals.
              We link to original sources and avoid panic-driven claims.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-extrabold tracking-[-0.04em]">
                {t('home.latest')}
              </h2>

              <Link href="/news" className="text-sm font-bold text-blue-700 hover:text-blue-900">
                {t('nav.news')} →
              </Link>
            </div>

            {featured ? (
              <Link href={`/news/${featured.slug}`} className="card card-hover mb-5 block p-6">
                <div className="flex flex-wrap gap-2">
                  <span className="border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                    {featured.category}
                  </span>
                  <span className="border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    {featured.region}
                  </span>
                </div>

                <h3 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-0.045em]">
                  {featured.title}
                </h3>

                <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
                  {featured.description}
                </p>

                <div className="mt-5 text-sm font-bold text-blue-700">
                  {t('news.read')} →
                </div>
              </Link>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              {latest.map((post) => (
                <Link key={post.slug} href={`/news/${post.slug}`} className="card card-hover block p-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl font-extrabold leading-tight tracking-[-0.035em]">
                    {post.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="card p-5">
              <div className="flex items-center gap-2 text-sm font-extrabold">
                <Newspaper className="h-5 w-5 text-blue-700" />
                {t('home.categories')}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="text-lg font-extrabold">{t('map.title')}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {t('map.description')}
              </p>

              <a
                href={MAP_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                {t('map.open')}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}