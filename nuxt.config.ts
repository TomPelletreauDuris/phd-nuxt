import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxt/content'],
  components: true,
  css: ['~/assets/styles.css'],
  // @ts-ignore: adding content config for @nuxt/content (document-driven mode)
  content: {
    documentDriven: true
  },
  nitro: {
    preset: 'vercel'
  },
  app: {
    head: {
      title: 'PhD Website',
      meta: [
        { name: 'description', content: 'Academic website' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Source+Serif+4:wght@300;400;600&display=swap' }
      ]
    }
  },
  compatibility: {
    // suggested by Nitro warning — set to today's date for predictable builds
    date: '2025-10-14'
  }
})
