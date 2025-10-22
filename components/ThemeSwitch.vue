<template>
  <label class="switch">
    <input type="checkbox" v-model="isDark" @change="toggleTheme" />
    <span class="slider">
      <span class="icon">{{ isDark ? '🌙' : '☀️' }}</span>
    </span>
  </label>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(false)

onMounted(() => {
  // Use localStorage to persist theme
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') {
    isDark.value = true
    document.body.classList.add('dark')
  } else {
    isDark.value = false
    document.body.classList.remove('dark')
  }
})

function toggleTheme() {
  if (isDark.value) {
    document.body.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.body.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: auto;
  height: 28px;
  gap: 8px;
  cursor: pointer;
}
.switch input[type="checkbox"] {
  opacity: 0;
  width: 48px;
  height: 28px;
  position: absolute;
  left: 0;
  top: 0;
  margin: 0;
  z-index: 2;
  cursor: pointer;
}
.switch .slider {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 28px;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 28px;
  z-index: 1;
}
.switch .slider .icon {
  position: absolute;
  left: 3px;
  bottom: 3px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  background: white;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  transition: transform 0.4s;
  transform: translateX(0);
}
.switch input[type="checkbox"]:checked + .slider {
  background-color: #2196F3;
}
.switch input[type="checkbox"]:checked + .slider .icon {
  transform: translateX(20px);
}
</style>
