import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const baseUrl = 'https://tompelletreauduris.com'
  
  // Get all blog posts
  const posts = await serverQueryContent(event, 'blog')
    .where({ draft: { $ne: true } })
    .find()
  
  // Get all publications
  const publications = await serverQueryContent(event, 'publications')
    .where({ draft: { $ne: true } })
    .find()
  
  // Build sitemap URLs
  const urls = [
    { loc: baseUrl, changefreq: 'weekly', priority: 1.0 },
    { loc: `${baseUrl}/blog`, changefreq: 'weekly', priority: 0.8 },
    { loc: `${baseUrl}/publications`, changefreq: 'monthly', priority: 0.8 },
    { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: 0.6 },
    ...posts.map((post: any) => ({
      loc: `${baseUrl}${post._path}`,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: post.date || new Date().toISOString()
    })),
    ...publications.map((pub: any) => ({
      loc: `${baseUrl}${pub._path}`,
      changefreq: 'yearly',
      priority: 0.7,
      lastmod: pub.publishedDate || new Date().toISOString()
    }))
  ]
  
  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`
  
  event.node.res.setHeader('Content-Type', 'application/xml')
  return sitemap
})
