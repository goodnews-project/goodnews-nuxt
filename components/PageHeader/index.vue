<script setup>
const router = useRouter();
const onClickLeft = () => {
  router.back();
};
const props = defineProps({
  showArrow: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <div class="header">
    <div class="arrow" v-if="props.showArrow">
      <a-button type="text" shape="circle" @click="onClickLeft">
        <Icon name="material-symbols:arrow-back-rounded" />
      </a-button>
    </div>
    <div class="main">
      <slot></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  gap: 16px;
  align-items: center;
  padding: 4px 10px;
  height: 50px;
  position: sticky;
  top: 0;
  backdrop-filter: blur(12px);
  z-index: 1;
  transition: all .2s ease-out;
  .arrow {
    font-size: 24px;
    display: flex;
    align-items: center;
    --primary-6: var(--gray-8);
  }
  .main {
    text-align: center;
    font-size: 24px;

    font-weight: 700;
    word-wrap: break-word;
    word-break: break-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .right {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-left: auto;
  }
}

@include respond('phone') {
  .header {
    top: var(--header-height);
  }
}
</style>
