<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <client-only>
      <LoginModal></LoginModal>
      <ChangePasswordModal></ChangePasswordModal>
    </client-only>
    <NuxtPage :keepalive="{ include: 'home,acct,public-local,public-common,notification' }" />
    <Loading />
  </NuxtLayout>
</template>
<script setup>
import './assets/main.scss';

import Loading from '@/components/loading/index.vue';
const useClientCss = () => {
  if (process.client) {
    import('./assets/main.scss');
    import('tippy.js/dist/tippy.css');
    import('tippy.js/themes/light.css');
    import('tippy.js/animations/scale.css');
  }
};

onMounted(() => {
  useClientCss();
});
const isDark = ref(false);
provide('isDark', isDark);
onMounted(async () => {
  // 深色模式
  const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
  const prefersDarkMode = darkThemeMq.matches;
  if (prefersDarkMode) {
    document.body.setAttribute('arco-theme', 'dark');
    isDark.value = true;
  }
  darkThemeMq.addListener((e) => {
    if (e.matches) {
      document.body.setAttribute('arco-theme', 'dark');
      isDark.value = true;
    } else {
      document.body.removeAttribute('arco-theme');
      isDark.value = false;
    }
  });
  await nextTick();

  const script = document.createElement('script');
  script.src = '/lib/rive/rive@2.16.0.js';
  document.body.appendChild(script);
  // 开发环境添加vconsole
  if (process.env.NODE_ENV === 'development') {
    const script = document.createElement('script');
    script.src = '//unpkg.com/vconsole@latest/dist/vconsole.min.js';
    document.head.appendChild(script);
  }

  window.dispatchEvent(new Event('nuxt:loading-finish'));
});
</script>
