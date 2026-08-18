export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return
  const { user, isAdmin, authReady } = useAuth()
  await authReady()
  if (!user.value) return navigateTo('/admin/login')
  if (!isAdmin.value) return navigateTo({ path: '/admin/login', query: { unauthorised: '1' } })
})
