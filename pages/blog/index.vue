<template>
  <div>
    <SiteHeader />
    <main class="container">
      <h1>Blog</h1>
      <div v-for="post in posts" :key="post._path">
        <PostCard :title="post.title" :date="post.date" :summary="post.summary" :tags="post.tags" :slug="post.slug" />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import SiteHeader from '~/components/SiteHeader.vue'
import Footer from '~/components/Footer.vue'
import PostCard from '~/components/PostCard.vue'
const { data: posts } = await useAsyncData('blog-list', () =>
  queryContent('blog')
    .where({ draft: { $ne: true } })
    .sort({ date: -1 })
    .find()
)

posts.value = (posts.value || []).map((p) => ({
  ...p,
  slug: (p._path || '').replace(/^\/?blog\//, ''),
  summary: p.summary || p.description || p.excerpt || ''
}))
</script>
