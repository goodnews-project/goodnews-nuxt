<script setup>
const { t } = useI18n();
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(['update:visible', 'confirm']);
const onClose = () => {
  emits('update:visible', false);
};
const onConfirm = () => {
  emits('confirm');
};
</script>

<template>
  <teleport to="body" v-if="props.visible">
    <div class="delete-tweet-pop__wrapper">
      <div class="delete-tweet-pop__content">
        <div class="delete-tweet-pop__title">{{ t('tweet.deleteTweet') }}</div>
        <div class="delete-tweet-pop__desc">
          {{ t('tweet.deleteTweetDesc') }}
        </div>
        <div class="delete-tweet-pop__btns">
          <a-button
            type="primary"
            status="danger"
            @click="onConfirm"
            shape="round"
            size="large"
            :loading="props.loading"
          >
            {{ t('common.delete') }}
          </a-button>
          <a-button @click="onClose" shape="round" size="large">{{
            t('common.cancel')
          }}</a-button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.delete-tweet-pop__wrapper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  .delete-tweet-pop__content {
    width: 400px;
    min-height: 300px;
    background-color: #fff;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-radius: 20px;
    .delete-tweet-pop__title {
      font-size: 20px;
      font-weight: bold;
    }
    .delete-tweet-pop__desc {
      flex: 1;
    }
    .delete-tweet-pop__btns {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 10px;
    }
  }
}
</style>
