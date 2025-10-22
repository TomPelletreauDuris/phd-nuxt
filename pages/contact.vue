<template>
  <div>
    <SiteHeader />
    <main class="container">
      <h1>Contact</h1>
      <p>I am always open to share thoughts and ideas. If you want to create fruitful interaction, contact me.</p>
      
      <h3 style="margin-top: 2rem;">Email</h3>
      <p>t.a.p.FULL-NAMEatvudotnl</p>
      
      <h3 style="margin-top: 2rem;">Connect</h3>
      <div class="social-links">
        <a href="https://www.linkedin.com/in/tompelletreauduris" target="_blank" rel="noopener noreferrer" class="social-link">
          <img src="/images/Linkedin-PNG-HD.webp" alt="LinkedIn" class="social-icon" />
        </a>
        <a href="https://bsky.app/profile/tompelletreau.bsky.social" target="_blank" rel="noopener noreferrer" class="social-link">
          <img src="/images/bluesky-logo-png.webp" alt="Bluesky" class="social-icon" />
        </a>
        <a href="https://x.com/_DurisTom" target="_blank" rel="noopener noreferrer" class="social-link">
          <img src="/images/x_twitter.webp" alt="X (Twitter)" class="social-icon" />
        </a>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import SiteHeader from '~/components/SiteHeader.vue'
import Footer from '~/components/Footer.vue'
</script>

<style scoped>
.social-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid rgba(102, 112, 132, 0.25);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  background: #f6f7fa;
  width: fit-content;
}

.social-link:hover {
  background: #e8eaf0;
  border-color: rgba(102, 112, 132, 0.4);
  transform: translateX(4px);
}

.social-icon {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  object-fit: contain;
}

body.dark .social-link {
  background: var(--card);
  border-color: var(--border);
}

body.dark .social-link:hover {
  background: #2d3338;
  border-color: var(--link);
}
</style>

