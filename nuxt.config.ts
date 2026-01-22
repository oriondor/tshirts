// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["orio-ui", "nuxt-auth-utils"],
  css: ["@/assets/css/main.css"],
  runtimeConfig: {
    session: {
      maxAge: 60 * 60 * 24 * 7, // 1 week
    },
    oauth: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },
  },
});
