<template>
  <div>
    <SiteHeader />
    <main class="container">
      <h1>Tom Pelletreau-Duris</h1>
      <p class="muted">PhD candidate in graph machine learning at the Vrije Universiteit Amsterdam under the supervision of Jieying Cheng and Michael Cochez. Part of the <a href="https://kai.cs.vu.nl/index" target="_blank" rel="noopener">KAI research group</a>. Guest in the <a href="https://lr.cs.vu.nl/about/people" target="_blank" rel="noopener">L&R group</a>.  Half funded by the <a href="https://zorro-project.nl/" target="_blank" rel="noopener">Zorro project</a>. A consortium with ASML, Canon Production Printers, ITEC, Philips, and ThermoFisher Scientific.</p>
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

// SEO: Set page meta and structured data
useHead({
  title: 'Tom Pelletreau-Duris | PhD Researcher in Graph Machine Learning & XAI',
  meta: [
    { name: 'description', content: 'PhD candidate in graph machine learning at VU Amsterdam. Researching explainability of neuro-symbolic AI, mechanistic interpretability for GNNs, and bridging philosophy of mind, neuroscience, and AI.' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Tom Pelletreau-Duris',
        jobTitle: 'PhD Candidate',
        affiliation: {
          '@type': 'Organization',
          name: 'Vrije Universiteit Amsterdam'
        },
        description: 'PhD candidate researching graph machine learning, explainable AI, and mechanistic interpretability for graph neural networks',
        url: 'https://tompelletreauduris.com',
        image: 'https://tompelletreauduris.com/images/Tom.jpeg',
        sameAs: [
          'https://www.linkedin.com/in/tom-pelletreau-duris',
          'https://bsky.app/profile/tompelletreauduris.bsky.social',
          'https://x.com/tompellduris'
        ],
        knowsAbout: [
          'Graph Machine Learning',
          'Explainable AI',
          'Graph Neural Networks',
          'Neuro-Symbolic AI',
          'Mechanistic Interpretability',
          'Philosophy of Mind',
          'Cognitive Science',
          'Neuroscience'
        ]
      })
    }
  ]
})

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
