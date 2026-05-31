export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/content',
    '@nuxt/image',
  ],

  googleFonts: {
    families: {
      'EB Garamond': [400, 500, 600],
      'Source Serif 4': [300, 400, 500, 600],
      'Inter': [300, 400, 500, 600],
    },
    display: 'swap',
  },

  tailwindcss: {
    configPath: 'tailwind.config.ts',
  },

  image: {
    quality: 85,
  },

  css: [
    '~/assets/css/kh-tokens.css',
    '~/assets/css/global.css',
    '~/assets/css/kh-mobile.css',
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3000',
    },
  },

  devServer: {
    port: 3100,
  },

  app: {
    head: {
      title: 'The Knighton-Hammond Charitable Trust',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'The Knighton-Hammond Charitable Trust — promoting the work of Arthur Henry Knighton-Hammond for the people of Nottingham and the wider community.' },
      ],
    },
  },
})
