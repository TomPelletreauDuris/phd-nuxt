<template>
  <div>
    <SiteHeader />
    <main class="container">
      <h1>Blog</h1>
      <div v-for="(posts, sectionName) in sections" :key="sectionName" class="blog-section">
        <h2 class="section-heading">{{ sectionName }}</h2>
        <div v-for="post in posts" :key="post._path">
          <PostCard :title="post.title" :date="post.date" :summary="post.summary" :tags="post.tags" :slug="post.slug" />
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import SiteHeader from '~/components/SiteHeader.vue'
import Footer from '~/components/Footer.vue'
import PostCard from '~/components/PostCard.vue'

const { data: rawPosts } = await useAsyncData('blog-list', () =>
  queryContent('blog')
    .where({ draft: { $ne: true } })
    .sort({ date: -1 })
    .find()
)

const allPosts = (rawPosts.value || []).map((p) => ({
  ...p,
  slug: (p._path || '').replace(/^\/?blog\//, ''),
  summary: p.summary || p.description || p.excerpt || '',
  section: p.section || 'Uncategorized'
}))

// Define section display order (listed sections appear first, in this order)
const sectionOrder = ['AI and philosophy', 'Spirituality and other fun stuff']

const sections = computed(() => {
  const grouped = {}
  for (const post of allPosts) {
    if (!grouped[post.section]) grouped[post.section] = []
    grouped[post.section].push(post)
  }
  // Return ordered: known sections first, then any others
  const ordered = {}
  for (const s of sectionOrder) {
    if (grouped[s]) ordered[s] = grouped[s]
  }
  for (const s of Object.keys(grouped)) {
    if (!ordered[s]) ordered[s] = grouped[s]
  }
  return ordered
})
</script>
