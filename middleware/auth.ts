export default defineNuxtRouteMiddleware((to, from) => {
  const user = getUser();
  if (!user.value) {
    return navigateTo('/?login=true');
  }
});
