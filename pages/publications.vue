<template>
  <div>
    <SiteHeader />
    <main class="container">
      <h1>Publications</h1>
      <ul class="publication-list">
        <li v-for="p in pubs" :key="p._path" class="publication-item">
          <div>
            <strong>{{ p.title }}</strong>
            <div class="muted">
              {{ p.authors?.join(', ') }} — {{ p.venue }}
              <span v-if="p.publishedLabel">
                ·
                <time :datetime="p.publishedDate">{{ p.publishedLabel }}</time>
              </span>
              <span v-else-if="p.year"> · {{ p.year }}</span>
            </div>
            <p v-if="p.summary" class="muted summary">{{ p.summary }}</p>
            <div><a :href="p.url" target="_blank" rel="noopener">Read publication</a></div>
          </div>
        </li>
      </ul>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SiteHeader from '~/components/SiteHeader.vue'
import Footer from '~/components/Footer.vue'
import { normalizePublication, sortPublications } from '~/utils/publications'

const { data: publications } = await useAsyncData('publications-list', () =>
  queryContent('publications')
    .where({ draft: { $ne: true } })
    .find()
)

const pubs = computed(() => sortPublications((publications.value || []).map((p) => normalizePublication(p))))
</script>
