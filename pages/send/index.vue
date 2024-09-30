<script setup>
import StartPolymerizationPanel from '@/components/StartPolymerizationPanel/index.vue';
const router = useRouter();
const routerBack = () => {
  router.back();
};
import mitt from '@/utils/mitt';
const submitTweetCb = () => {
  router.back();
};
onMounted(() => {
  mitt.on('submit-tweet', submitTweetCb);
});
onUnmounted(() => {
  mitt.off('submit-tweet', submitTweetCb);
});
</script>

<template>
  <div class="pages">
    <StartPolymerizationPanel></StartPolymerizationPanel>
  </div>
</template>

<style lang="scss" scoped>
.pages {
  padding: 15px;
}
</style>
