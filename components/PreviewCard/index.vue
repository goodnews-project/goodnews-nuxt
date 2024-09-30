<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
defineProps({
  previewCard: {
    type: Object,
  },
});
const goHref = (url) => {
  window.open(url);
  return false;
};
</script>
<template>
  <div @click.stop="goHref(previewCard.url)" ref="nofollow" class="preview-card">
    <div v-if="previewCard.provider_name == 'YouTube'">
      <embed style="width: 100%" class="aspect-[1.9/1]" :src="previewCard.url" type="" />
    </div>
    <div v-else-if="previewCard.image_url">
      <img class="preview-" :src="previewCard.image_url" alt="" />
      <div class="text-content">
        <h3 class="text-name">{{ previewCard.provider_name }}</h3>
        <h2 class="text-title">{{ previewCard.title }}</h2>
        <p class="text-desc">
          {{ previewCard.description }}
        </p>
      </div>
    </div>
    <div v-else class="type-icon">
      <div class="icon-block">
        <nuxt-icon class="icon-box" name="file-lines"></nuxt-icon>
      </div>
      <div class="text-content">
        <h3 class="text-name">{{ previewCard.provider_name }}</h3>
        <h2 class="text-title">{{ previewCard.title }}</h2>
        <p class="text-desc">{{ previewCard.description }}</p>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.preview-card {
  cursor: pointer;
  width: 100%;
  border: 1px solid var(--color-neutral-3);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease-out;
  margin-bottom: 20px;
  background-color: #fff;
  .preview-image {
    object-fit: cover;
    width: 100%;
    aspect-ratio: 1.91/1;
  }
  .text-content {
    word-break: break-all;
    padding: 4px;
    padding-left: 12px;
    .text-name {
      margin-bottom: 10px;
    }
    .text-title {
      font-weight: bold;
    }
    .text-desc {
      color: var(--color-neutral-8);
    }
  }
  .type-icon {
    display: flex;
    // justify-start
    justify-content: flex-start;

    .icon-block {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 38px;
      border-right: 1px solid rgb(229 231 235 / var(--tw-border-opacity));
      // p-4 bg-[#f7f9f9]
      padding: 16px;
      background: #f7f9f9;
    }
  }
}
</style>
