import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, PlayCircle } from 'lucide-react';

import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { getAllPostSlugs, getPostBySlug } from '@/lib/posts';
import { SITE_URL } from '@/lib/site';

type NewsPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();

  return slugs.map((item) => ({
    slug: item.slug,
  }));
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}

function renderMarkdown(content: string) {
  const lines = content.split('\n');

  return lines.map((line, index) => {
    if (line.startsWith('# ')) {
      return <h1 key={index}>{line.replace('# ', '')}</h1>;
    }

    if (line.startsWith('## ')) {
      return <h2 key={index}>{line.replace('## ', '')}</h2>;
    }

    if (line.startsWith('- ')) {
      return <li key={index}>{renderInlineMarkdown(line.replace('- ', ''))}</li>;
    }

    if (!line.trim()) {
      return <div key={index} className="h-3" />;
    }

    return <p key={index}>{renderInlineMarkdown(line)}</p>;
  });
}

export async function generateMetadata({
  params,
}: NewsPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Health update not found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `/news/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/news/${post.slug}`,
      type: 'article',
      images: post.image_url ? [{ url: post.image_url }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.image_url ? [post.image_url] : undefined,
    },
  };
}

export default async function NewsPostPage({ params }: NewsPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.image_url || undefined,
    datePublished: post.published_at,
    dateModified: post.generated_at,
    mainEntityOfPage: `${SITE_URL}/news/${post.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'HantaUpdates',
      url: SITE_URL,
    },
    about: post.category,
    keywords: post.keywords,
  };

  return (
    <>
      <SiteHeader />

      <main className="min-h-dvh bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        <article className="mx-auto max-w-3xl">
          <Link href="/news" className="text-sm font-bold text-slate-500 hover:text-slate-950">
            ← Back to health news
          </Link>

          <header className="mt-8 border-b border-slate-200 pb-8">
            <div className="flex flex-wrap gap-2">
              <span className="border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                {post.category}
              </span>

              <span className="border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                {post.region}
              </span>

              <span className="border border-teal-100 bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-teal-700">
                {post.source_confidence} confidence
              </span>

              {post.video_url ? (
                <a
                  href={post.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 border border-red-100 bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-red-700"
                >
                  <PlayCircle className="h-3.5 w-3.5" />
                  Video
                </a>
              ) : null}
            </div>

            <h1 className="mt-5 text-4xl font-extrabold leading-none tracking-[-0.055em] sm:text-6xl">
              {post.title}
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              {post.description}
            </p>

            {post.image_url ? (
              <figure className="mt-7 overflow-hidden border border-slate-200 bg-white">
                <img
                  src={post.image_url}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="h-auto w-full object-cover"
                />

                <figcaption className="border-t border-slate-200 px-4 py-3 text-xs leading-6 text-slate-500">
                  Image from original source feed. See source link for context.
                </figcaption>
              </figure>
            ) : null}

            <div className="mt-6 border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-600">
              Original source:{' '}
              <a
                href={post.source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900"
              >
                {post.source}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </header>

          <section className="article-content mt-8">
            {renderMarkdown(post.content)}
          </section>

          <section className="mt-10 border-t border-slate-200 pt-6">
            <p className="text-sm leading-7 text-slate-500">
              Medical disclaimer: This article is informational only and does
              not provide medical advice, diagnosis, or treatment. Always
              follow guidance from qualified health professionals or official
              health authorities.
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}