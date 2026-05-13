import type { Metadata } from 'next';

import { HomePageClient } from '@/components/home/HomePageClient';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'HantaUpdates — Global Health News & Trends',
  description:
    'Latest global health trends, medical news, outbreak alerts, wellness updates, and official-source public health explainers.',
};

export default async function HomePage() {
  const posts = await getAllPosts();
  const categories = Array.from(new Set(posts.map((post) => post.category))).sort();

  return (
    <>
      <SiteHeader />
      <HomePageClient posts={posts} categories={categories} />
      <SiteFooter />
    </>
  );
}