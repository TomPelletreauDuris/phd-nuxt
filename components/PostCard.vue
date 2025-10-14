<template>
  <article class="post-card">
    <h3><NuxtLink :to="`/blog/${slug}`">{{ title }}</NuxtLink></h3>
    <div class="muted">{{ date }} · <span v-if="tags">{{ tags.join(', ') }}</span></div>
    <p>{{ summary }}</p>
  </article>
</template>

<script setup>
defineProps({ title: String, date: String, summary: String, tags: Array, slug: String })
</script>
