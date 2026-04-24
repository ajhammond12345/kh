<template>
  <footer class="bg-charcoal-900 text-cream-200 py-10">
    <div class="max-w-gallery mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="font-display text-2xl text-white mb-3">Knighton-Hammond</h3>
          <p class="font-serif text-sm leading-relaxed">
            The Knighton-Hammond Charitable Trust promotes the work of Arthur Henry Knighton-Hammond
            for the people of Nottingham and the wider community.
          </p>
        </div>
        <div>
          <h4 class="font-display text-lg text-white mb-3">Quick Links</h4>
          <ul class="space-y-1 font-serif text-sm">
            <li><NuxtLink to="/about" class="hover:text-gallery-gold transition-colors">About Us</NuxtLink></li>
            <li><NuxtLink to="/artist" class="hover:text-gallery-gold transition-colors">The Artist</NuxtLink></li>
            <li><NuxtLink to="/gallery" class="hover:text-gallery-gold transition-colors">Photo Gallery</NuxtLink></li>
            <li><NuxtLink to="/gallery-project" class="hover:text-gallery-gold transition-colors">Gallery Project</NuxtLink></li>
            <li><NuxtLink to="/privacy" class="hover:text-gallery-gold transition-colors">Privacy Policy</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="font-display text-lg text-white mb-3">Contact</h4>
          <ul class="space-y-1 font-serif text-sm">
            <li>
              <a href="mailto:chair@k-hct.org" class="hover:text-gallery-gold transition-colors">
                chair@k-hct.org
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/groups/229078159525663" target="_blank" rel="noopener" class="hover:text-gallery-gold transition-colors">
                Facebook Group
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/channel/UCPVP6xKN_vNn9BzmAMWmWnw" target="_blank" rel="noopener" class="hover:text-gallery-gold transition-colors">
                YouTube Channel
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="border-t border-charcoal-700 mt-8 pt-6 text-center font-serif text-xs text-cream-300">
        &copy; {{ new Date().getFullYear() }} The Knighton-Hammond Charitable Trust. All rights reserved.
      </div>
    </div>
  </footer>
</template>
