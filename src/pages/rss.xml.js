import rss from '@astrojs/rss';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

async function getAllPosts() {
  const postsDirectory = path.join(process.cwd(), 'src/pages');
  const filenames = await fs.readdir(postsDirectory);

  const posts = filenames
    .filter((fn) => fn.endsWith('.md'))
    .map(async (filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = await fs.readFile(filePath, 'utf8');
      const { data } = matter(fileContents);

      // Ensure slug is always a string
      let slug = data.slug;
      if (slug === undefined || typeof slug !== 'string') {
        slug = filename.replace(/\.md$/, '');
      }

      return {
        ...data,
        slug,
      };
    });

  return Promise.all(posts);
}

export const get = async () => {
  const allPosts = await getAllPosts();

  const items = allPosts.map((post) => ({
    title: post.title,
    pubDate: post.date,
    link: `http://akindoflibrary.com/${post.slug}`,
  }));

  // Check each item for necessary properties
  items.forEach((item) => {
    if (!item.title || !item.pubDate || !item.link) {
      console.log({ item });
      throw new Error(
        'Invalid item in RSS feed: Missing title, pubDate, or link'
      );
    }
  });

  return rss({
    title: 'My Blog',
    description: 'RSS feed for my blog posts',
    site: 'https://akindoflibrary.com',
    items: allPosts
      .map((post) => ({
        link: `/${post.slug}`,
        title: post.title,
        pubDate: new Date(post.date).toUTCString(),
      }))
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate)), // Sort by date
  });
};
