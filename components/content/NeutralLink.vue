<template>
  <component
    :is="isExternal ? 'a' : 'NuxtLink'"
    :href="isExternal ? href : undefined"
    :to="!isExternal ? href : undefined"
    :target="target"
    :rel="isExternal ? computedRel : undefined"
    class="neutral-link"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  href: {
    type: String,
    required: true
  },
  target: {
    type: String,
    default: undefined
  },
  rel: {
    type: String,
    default: undefined
  }
})

const isExternal = computed(() => /^(https?:)?\/\//i.test(props.href) || props.href.startsWith('mailto:'))

const computedRel = computed(() => {
  if (props.rel) return props.rel
  return props.target === '_blank' ? 'noopener noreferrer' : undefined
})
</script>
