export default defineNuxtRouteMiddleware(() => {
  const { user, loggedIn } = useUserSession();

  if (!loggedIn.value) {
    return navigateTo("/profile");
  }

  const isAdmin = (user.value as { isAdmin?: boolean } | null)?.isAdmin;

  if (!isAdmin) {
    return navigateTo("/");
  }
});
