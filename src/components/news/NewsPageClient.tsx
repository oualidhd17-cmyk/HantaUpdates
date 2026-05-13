'use client';

import Link from 'next/link';

import { useSiteLanguage } from '@/components/site/LanguageSwitcher';
import type { BlogPost } from '@/lib/posts';

type NewsPageClientProps = {
  posts: BlogPost[];
  categories: string[];
};

function PostImage({ post }: { post: BlogPost }) {
  if (!post.image_url) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center border-b border-slate-200 bg-slate-100">
        <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
          Health Update
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-[16/9] overflow-hidden border-b border-slate-200 bg-slate-100">
     <img
        src={post.image_url}
        alt={post.title}
        referrerPolicy="no-referrer"
        loading="lazy"
        className="h-auto w-full object-cover"
      />
    </div>
  );
}

export function NewsPageClient({ posts, categories }: NewsPageClientProps) {
  const { t, dir } = useSiteLanguage();

  return (
    <main dir={dir} className="min-h-dvh bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <section className="card p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
            {t('common.healthNews')}
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-extrabold tracking-[-0.055em] sm:text-6xl">
            {t('news.title')}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
            {t('news.description')}
          </p>
        </section>

        {posts.length === 0 ? (
          <section className="mt-6 border border-slate-200 bg-white p-8 text-center">
            <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-slate-950">
              No health articles yet
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
              لم يتم توليد المقالات بعد. شغّل سكربت الأخبار ثم أعد بناء المشروع.
            </p>

            <div className="mt-5 bg-slate-950 px-4 py-3 text-left font-mono text-xs leading-6 text-white">
              python scripts\generate_health_articles.py
              <br />
              npm run build
              <br />
              npm run dev
            </div>
          </section>
        ) : (
          <>
            <section className="mt-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                >
                  {category}
                </span>
              ))}
            </section>

            <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.slug} href={`/news/${post.slug}`} className="card card-hover block overflow-hidden">
                  <PostImage post={post} />

                  <div className="p-5">
                    <div className="flex flex-wrap gap-2">
                      <span className="border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                        {post.category}
                      </span>

                      <span className="border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                        {post.region}
                      </span>

                      {post.video_url ? (
                        <span className="border border-red-100 bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-red-700">
                          Video
                        </span>
                      ) : null}
                    </div>

                    <h2 className="mt-4 text-xl font-extrabold leading-tight tracking-[-0.035em] text-slate-950">
                      {post.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                      {post.description}
                    </p>

                    <div className="mt-5 text-sm font-bold text-blue-700">
                      {t('news.read')} →
                    </div>
                  </div>
                </Link>
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  );
}