import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxtjs/sitemap'],
  components: true,
  css: ['~/assets/styles.css'],
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ['annotation', 'annotation-xml'].includes(tag)
    }
  },
  // Content configuration
  content: {
    documentDriven: true,
    highlight: {
      preload: ['nix']
    },
    markdown: {
      remarkPlugins: ['remark-math'],
      rehypePlugins: ['rehype-katex']
    }
  },
  nitro: {
    preset: 'vercel',
    prerender: {
      crawlLinks: true
    }
  },
  app: {
    head: {
      title: 'Tom Pelletreau-Duris | PhD Researcher in Graph Machine Learning & XAI',
      meta: [
        { name: 'description', content: 'PhD candidate in graph machine learning at VU Amsterdam. Researching explainability of neuro-symbolic AI, mechanistic interpretability for GNNs, and bridging philosophy of mind, neuroscience, and AI through graph theory.' },
        { name: 'keywords', content: 'graph machine learning, explainable AI, XAI, graph neural networks, GNN, neuro-symbolic AI, mechanistic interpretability, philosophy of mind, neuroscience, cognitive science, VU Amsterdam, PhD researcher' },
        { name: 'author', content: 'Tom Pelletreau-Duris' },
        // Open Graph
        { property: 'og:title', content: 'Tom Pelletreau-Duris | PhD Researcher in Graph ML & XAI' },
        { property: 'og:description', content: 'PhD candidate researching explainability of neuro-symbolic AI, mechanistic interpretability for GNNs, bridging philosophy, neuroscience, and AI through graph theory.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://tompelletreauduris.com' },
        { property: 'og:image', content: 'https://tompelletreauduris.com/images/Tom.jpeg' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Tom Pelletreau-Duris | PhD Researcher in Graph ML & XAI' },
        { name: 'twitter:description', content: 'PhD candidate researching explainability of neuro-symbolic AI and mechanistic interpretability for GNNs.' },
        { name: 'twitter:image', content: 'https://tompelletreauduris.com/images/Tom.jpeg' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Source+Serif+4:wght@300;400;600&display=swap' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css' },
        { rel: 'canonical', href: 'https://tompelletreauduris.com' }
      ],
      script: []
    }
  },
  compatibility: {
    // suggested by Nitro warning — set to today's date for predictable builds
    date: '2026-03-30'
  },
  site: {
    url: 'https://tompelletreauduris.com'
  }
})
