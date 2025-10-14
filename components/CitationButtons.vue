<template>
  <div v-if="meta">
    <button @click="copyBib">Copy BibTeX</button>
    <button @click="downloadBib">Download .bib</button>
    <button @click="copyCSL">Copy CSL JSON</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({ meta: Object })

function makeBibtex(m) {
  const key = (m.title || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const authors = (m.authors || []).join(' and ')
  return `@article{${key},
  title={${m.title}},
  author={${authors}},
  year={${m.year}},
  url={${m.url}}
}`
}

function makeCSL(m){
  return JSON.stringify({
    title: m.title,
    author: (m.authors||[]).map(a=>({name:a})),
    issued: { 'date-parts': [[parseInt(m.year) || new Date().getFullYear()]] },
    URL: m.url
  }, null, 2)
}

function copyText(text){
  navigator.clipboard.writeText(text)
}

function copyBib(){ copyText(makeBibtex(props.meta)) }
function downloadBib(){
  const blob = new Blob([makeBibtex(props.meta)], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(props.meta.title||'citation').replace(/[^a-z0-9]+/gi,'-')}.bib`
  a.click()
  URL.revokeObjectURL(url)
}
function copyCSL(){ copyText(makeCSL(props.meta)) }
</script>
