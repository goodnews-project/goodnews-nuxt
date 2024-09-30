<script setup>
import LoadingIcon from '@/components/loadingIcon/index.vue';
const isLoading = ref(true);
const finishLoading = () => {
  isLoading.value = false;
};
onMounted(async () => {
  await nextTick();
  finishLoading();
});
import defaultJpg from '@/assets/images/loading.gif';
</script>

<template>
  <div v-if="isLoading" class="loading-overlay">
    <!-- <LoadingIcon></LoadingIcon> -->
    <div class="spinner">
      <img :src="defaultJpg" alt="" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.spinner {
  width: 200px;
}
</style>
