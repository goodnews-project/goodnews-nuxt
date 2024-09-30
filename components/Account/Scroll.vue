<template><div></div></template>
<script setup>
import useScroll from '@/hooks/useScroll';

onDeactivated(() => {
  console.log('onDeactivated');
  useScroll().setScrollCache('acct');
});

onActivated(async () => {
  console.log('onActivated');
  const { getScrollCache, toScroll } = useScroll();
  const scrollTop = getScrollCache('acct');
  console.log(scrollTop);
  setTimeout(() => {
    toScroll(scrollTop);
  }, 300);
});
</script>
