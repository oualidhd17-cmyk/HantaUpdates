import type { Metadata } from 'next';

import { NewsPageClient } from '@/components/news/NewsPageClient';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Global Health News & Trends',
  description:
    'Latest global health trends, medical news, outbreak alerts, mental health updates, wellness topics, and public-health explainers.',
};

export default async function NewsPage() {
  const posts = await getAllPosts();
  const categories = Array.from(new Set(posts.map((post) => post.category))).sort();

  return (
    <>
      <SiteHeader />
      <NewsPageClient posts={posts} categories={categories} />
      <SiteFooter />
    </>
  );
}