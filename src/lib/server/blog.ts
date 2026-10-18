import { exec, query, type RowDataPacket } from '@/lib/server/db';

export type BlogPost = {
  id: number; slug: string; title: string; excerpt: string; body: string; category: string;
  tags: string[]; authorName: string; seoTitle: string; seoDescription: string; ogImage: string;
  published: boolean; publishedAt: Date | null; createdAt: Date; updatedAt: Date;
};
type BlogRow = RowDataPacket & {
  id: number; slug: string; title: string; excerpt: string; body: string; category: string; tags_json: string;
  author_name: string; seo_title: string; seo_description: string; og_image: string; published: number;
  published_at: Date | null; created_at: Date; updated_at: Date;
};
function mapPost(r: BlogRow): BlogPost {
  let tags: string[] = [];
  try { const parsed = JSON.parse(r.tags_json || '[]'); if (Array.isArray(parsed)) tags = parsed.filter((x): x is string => typeof x === 'string'); } catch { /* malformed legacy tags are ignored */ }
  return { id: Number(r.id), slug: r.slug, title: r.title, excerpt: r.excerpt, body: r.body, category: r.category,
    tags, authorName: r.author_name, seoTitle: r.seo_title, seoDescription: r.seo_description, ogImage: r.og_image,
    published: Boolean(r.published), publishedAt: r.published_at, createdAt: r.created_at, updatedAt: r.updated_at };
}
const fields = 'id, slug, title, excerpt, body, category, tags_json, author_name, seo_title, seo_description, og_image, published, published_at, created_at, updated_at';
export async function listBlogPosts(includeDrafts = false): Promise<BlogPost[]> {
  try {
    const rows = await query<BlogRow>(`SELECT ${fields} FROM blog_posts ${includeDrafts ? '' : 'WHERE published = 1'} ORDER BY COALESCE(published_at, created_at) DESC, id DESC`);
    return rows.map(mapPost);
  } catch { return []; }
}
export async function getBlogPost(slug: string, includeDrafts = false): Promise<BlogPost | null> {
  const rows = await query<BlogRow>(`SELECT ${fields} FROM blog_posts WHERE slug = ? ${includeDrafts ? '' : 'AND published = 1'} LIMIT 1`, [slug]);
  return rows[0] ? mapPost(rows[0]) : null;
}
export async function saveBlogPost(input: {
  id?: number; slug: string; title: string; excerpt: string; body: string; category: string; tags: string[];
  authorName: string; seoTitle: string; seoDescription: string; ogImage: string; published: boolean;
}): Promise<number> {
  const tags = JSON.stringify(input.tags);
  if (input.id) {
    await exec(`UPDATE blog_posts SET slug=?, title=?, excerpt=?, body=?, category=?, tags_json=?, author_name=?, seo_title=?, seo_description=?, og_image=?, published=?, published_at=IF(?=1, COALESCE(published_at, NOW()), NULL) WHERE id=?`,
      [input.slug,input.title,input.excerpt,input.body,input.category,tags,input.authorName,input.seoTitle,input.seoDescription,input.ogImage,input.published?1:0,input.published?1:0,input.id]);
    return input.id;
  }
  const result = await exec(`INSERT INTO blog_posts (slug,title,excerpt,body,category,tags_json,author_name,seo_title,seo_description,og_image,published,published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,IF(?=1,NOW(),NULL))`,
    [input.slug,input.title,input.excerpt,input.body,input.category,tags,input.authorName,input.seoTitle,input.seoDescription,input.ogImage,input.published?1:0,input.published?1:0]);
  return Number(result.insertId);
}
export async function deleteBlogPost(id: number): Promise<void> { await exec('DELETE FROM blog_posts WHERE id = ?', [id]); }
