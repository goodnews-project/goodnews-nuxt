<script setup>
import { computed } from 'vue';
const props = defineProps({
  account: { type: Object, default: () => null },
  size: { type: [Number, String], default: () => 48 },
  shape: { type: String, default: () => 'square' },
});
import defaultAvatar from '@/assets/images/default-avatar.jpg';
const renderImg = computed(() => {
  const accountAvatar = props.account?.avatar || props.account?.avatar_remote_url;
  return accountAvatar || defaultAvatar;
});
</script>

<template>
  <div class="avatar">
    <a-avatar :shape="props.shape" :size="Number(props.size)">
      <img
        :src="renderImg"
        alt="avatar"
        :width="props.size"
        :height="props.size"
        :style="{
          width: props.size + 'px',
          height: props.size + 'px',
          borderRadius: props.shape === 'circle' ? '50%' : 0,
        }"
      />
    </a-avatar>
  </div>
</template>

<style lang="scss" scoped>
.avatar {
  position: relative;
  border-radius: var(--border-radius-medium);
  --bg-color: var(--color-neutral-10);
  overflow: hidden;
  &::after {
    content: ' ';
    position: absolute;
    inset: 0;
    transition: all 0.3s ease-in-out;
  }
  &:hover {
    &::after {
      background-color: rgba($color: #000, $alpha: 0.3);
    }
  }
}
</style>
