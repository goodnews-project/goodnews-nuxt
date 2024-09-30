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

onMounted(async () => {
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
