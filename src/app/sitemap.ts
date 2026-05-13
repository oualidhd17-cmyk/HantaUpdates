import { getAllPosts } from '@/lib/posts';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export default async function sitemap() {
  const posts = await getAllPosts();
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/news`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/sources`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/medical-disclaimer`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/hantavirus-map-live`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/news/${post.slug}`,
      lastModified: new Date(post.generated_at || post.published_at || Date.now()),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    })),
  ];
}