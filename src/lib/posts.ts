import fs from 'node:fs/promises';
import path from 'node:path';

export type BlogPost = {
  title: string;
  description: string;
  slug: string;
  category: string;
  region: string;
  trend: string;
  source: string;
  source_url: string;
  source_confidence: string;
  published_at: string;
  generated_at: string;
  image_url: string;
  video_url: string;
  keywords: string[];
  content: string;
};

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

function cleanQuotedValue(value: string): string {
  return value.trim().replace(/^["']|["']$/g, '');
}

function parseFrontMatter(rawInput: string): BlogPost {
  const raw = rawInput.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    throw new Error('Invalid post front matter.');
  }

  const frontMatter = match[1];
  const content = match[2].trim();

  const data: Record<string, string | string[]> = {};
  const lines = frontMatter.split('\n');
  let currentArrayKey: string | null = null;

  for (const line of lines) {
    const trimmedLine = line.trimEnd();

    const arrayItem = trimmedLine.match(/^\s*-\s+["']?(.*?)["']?\s*$/);

    if (arrayItem && currentArrayKey) {
      const list = data[currentArrayKey];

      if (Array.isArray(list)) {
        list.push(cleanQuotedValue(arrayItem[1]));
      }

      continue;
    }

    const keyOnly = trimmedLine.match(/^([a-zA-Z0-9_]+):\s*$/);

    if (keyOnly) {
      data[keyOnly[1]] = [];
      currentArrayKey = keyOnly[1];
      continue;
    }

    const keyValue = trimmedLine.match(/^([a-zA-Z0-9_]+):\s*(.*?)\s*$/);

    if (!keyValue) {
      continue;
    }

    const key = keyValue[1];
    const value = cleanQuotedValue(keyValue[2]);

    data[key] = value;
    currentArrayKey = null;
  }

  return {
    title: String(data.title ?? 'Untitled health update'),
    description: String(data.description ?? 'Latest global health update.'),
    slug: String(data.slug ?? ''),
    category: String(data.category ?? 'Global Health'),
    region: String(data.region ?? 'Global'),
    trend: String(data.trend ?? ''),
    source: String(data.source ?? 'Source'),
    source_url: String(data.source_url ?? ''),
    source_confidence: String(data.source_confidence ?? 'medium'),
    published_at: String(data.published_at ?? ''),
    generated_at: String(data.generated_at ?? ''),
    image_url: String(data.image_url ?? ''),
    video_url: String(data.video_url ?? ''),
    keywords: Array.isArray(data.keywords) ? data.keywords : [],
    content,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    await fs.mkdir(POSTS_DIR, { recursive: true });

    const entries = await fs.readdir(POSTS_DIR, {
      withFileTypes: true,
    });

    const markdownFiles = entries.filter(
      (entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.md'),
    );

    const posts: BlogPost[] = [];

    for (const entry of markdownFiles) {
      try {
        const filePath = path.join(POSTS_DIR, entry.name);
        const raw = await fs.readFile(filePath, 'utf8');
        const post = parseFrontMatter(raw);

        if (post.slug) {
          posts.push(post);
        }
      } catch (error) {
        console.warn(`Skipping invalid post: ${entry.name}`, error);
      }
    }

    return posts.sort((a, b) => {
      const aDate = new Date(a.generated_at || a.published_at).getTime();
      const bDate = new Date(b.generated_at || b.published_at).getTime();

      return bDate - aDate;
    });
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();

  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getAllPostSlugs() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}