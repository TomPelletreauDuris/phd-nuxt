<template>
  <div>
    <SiteHeader />
    <main class="container">
      <h1>Publications</h1>
      <ul>
        <li v-for="p in pubs" :key="p._path">
          <div>
            <strong>{{ p.title }}</strong>
            <div class="muted">{{ p.authors?.join(', ') }} — {{ p.venue }} ({{ p.year }})</div>
            <div><a :href="p.url" target="_blank" rel="noopener">link</a></div>
          </div>
        </li>
      </ul>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import SiteHeader from '~/components/SiteHeader.vue'
import Footer from '~/components/Footer.vue'
const { data: pubs } = await useAsyncData('pubs', () =>
  queryContent('publications')
    .where({ draft: { $ne: true } })
    .sort({ year: -1, title: 1 })
    .find()
)

pubs.value = pubs.value || []
</script>
