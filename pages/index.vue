<template>
  <div>
    <SiteHeader />
    <main class="container">
      <h1>Pelletreau-Duris Tom</h1>
      <p class="muted">PhD candidate in graph machine learning at the Vrije Universiteit Amsterdam under the supervision of Michael Cochez and Jieying Cheng.</p>
      <p class="muted">Officially advancing explainability of neuro-symbolic AI. Tactically working on mechanistic interpretability for graph ml. Personally trying to bridge disciplinaries I love, networking philosophy of mind, social sciences, AI and neurosciences through the lens of graph theory and XAI. Systematizing rhizomes. </p>
      <!-- <RhizomeVisualization /> -->
      <CVNetworkVisualization />
      <section class="latest-posts">
        <h2>Latest posts</h2>
        <div v-for="post in posts" :key="post._path">
          <PostCard :title="post.title" :date="post.date" :summary="post.summary" :tags="post.tags" :slug="post.slug" />
        </div>
      </section>
  <section v-if="latestPublication" class="latest-publication">
        <h2>Latest publication</h2>
        <article class="publication-card">
          <h3>{{ latestPublication.title }}</h3>
          <p class="muted">
            {{ latestPublication.authors?.join(', ') }} — {{ latestPublication.venue }}
            <span v-if="latestPublication.publishedLabel">
              ·
              <time :datetime="latestPublication.publishedDate">{{ latestPublication.publishedLabel }}</time>
            </span>
            <span v-else-if="latestPublication.year"> · {{ latestPublication.year }}</span>
          </p>
          <p v-if="latestPublication.summary">{{ latestPublication.summary }}</p>
          <div>
            <a :href="latestPublication.url" target="_blank" rel="noopener">Read publication</a>
          </div>
        </article>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SiteHeader from '~/components/SiteHeader.vue'
import Footer from '~/components/Footer.vue'
import PostCard from '~/components/PostCard.vue'
import RhizomeVisualization from '~/components/RhizomeVisualization.client.vue'
import CVNetworkVisualization from '~/components/CVNetworkVisualization.vue'
import { normalizePublication, sortPublications } from '~/utils/publications'
const { data: posts } = await useAsyncData('latest-posts', () =>
  queryContent('blog')
    .where({ draft: { $ne: true } })
    .sort({ date: -1 })
    .limit(3)
    .find()
)

posts.value = (posts.value || []).map((p) => ({
  ...p,
  slug: (p._path || '').replace(/^\/?blog\//, ''),
  summary: p.summary || p.description || p.excerpt || ''
}))

const { data: publications } = await useAsyncData('latest-publications', () =>
  queryContent('publications')
    .where({ draft: { $ne: true } })
    .find()
)

const normalizedPublications = computed(() =>
  sortPublications((publications.value || []).map((p) => normalizePublication(p)))
)

const latestPublication = computed(() => normalizedPublications.value[0] || null)
</script>
