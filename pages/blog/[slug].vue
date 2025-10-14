<template>
  <div>
    <SiteHeader />
    <main class="container">
  <article v-if="article" class="post-content">
        <h1>{{ article.title }}</h1>
        <p v-if="article.subtitle" class="post-subtitle">{{ article.subtitle }}</p>
        <div class="muted">
          <span v-if="formattedAuthors">{{ formattedAuthors }}</span>
          <span v-if="formattedAuthors && displayDate"> · </span>
          <span v-if="!formattedAuthors && displayDate">Published </span>
          <span v-if="displayDate">{{ displayDate }}</span>
        </div>
        <ContentRenderer :value="article" />
        <CitationButtons v-if="citationMeta" :meta="citationMeta" />
        <p v-if="article.original_url" class="muted">
          Originally published: <a :href="article.original_url" target="_blank" rel="noopener">original</a>
          <span v-if="article.original_archive">
            (<a :href="article.original_archive" target="_blank" rel="noopener">archived</a>)
          </span>
        </p>
      </article>
      <div v-else>
        <p>Post not found.</p>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SiteHeader from '~/components/SiteHeader.vue'
import Footer from '~/components/Footer.vue'
import CitationButtons from '~/components/CitationButtons.vue'
import { useAsyncData, queryContent } from '#imports'

const route = useRoute()
const rawSlug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const slug = rawSlug?.toString() || ''

const { data: postData } = await useAsyncData(`blog-post-${slug}`, () =>
  queryContent('blog').where({ _path: `/blog/${slug}` }).findOne()
)

const article = computed(() => postData.value || null)

const formattedAuthors = computed(() => {
  if (!article.value?.authors) return ''
  return Array.isArray(article.value.authors) ? article.value.authors.join(', ') : String(article.value.authors)
})

const displayDate = computed(() => {
  if (!article.value) return ''
  const value = article.value.year ?? article.value.date
  if (!value) return ''
  if (typeof value === 'string') return value
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  try {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
  } catch {
    return ''
  }
})

const citationMeta = computed(() => {
  if (!article.value) return null
  const yearSource = article.value.year ?? article.value.date
  let year = ''
  if (typeof yearSource === 'string') {
    year = yearSource.slice(0, 4)
  } else if (yearSource instanceof Date) {
    year = `${yearSource.getFullYear()}`
  } else if (yearSource) {
    const date = new Date(yearSource)
    if (!Number.isNaN(date.getTime())) {
      year = `${date.getFullYear()}`
    }
  }

  return {
    title: article.value.title,
    authors: Array.isArray(article.value.authors)
      ? article.value.authors
      : [article.value.authors].filter(Boolean),
    year,
    url: article.value.canonical || article.value.original_url || ''
  }
})
</script>
