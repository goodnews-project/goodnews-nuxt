<script setup>
import loadingIcon from '~/components/loadingIcon/index.vue';
const { t } = useI18n();

const props = defineProps({
  scrollbar: { type: Boolean, default: true },
  showFooter: { type: Boolean, default: true },
  reachBottom: { type: Function, default: () => {} },
  loading: { type: Boolean, default: false },
});

const emits = defineEmits(['reach-bottom']);
const loadingDom = ref(null);

onMounted(async () => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      emits('reach-bottom');
    }
  });
  await nextTick();
  loadingDom.value && observer.observe(loadingDom.value);
});
</script>

<template>
  <div class="list">
    <slot name="header"></slot>
    <div class="list-container">
      <slot></slot>
    </div>
    <client-only>
      <div class="footer">
        <div class="loading" ref="loadingDom" v-if="props.scrollbar">
          <loadingIcon v-if="props.loading"></loadingIcon>
        </div>
        <div class="noMore" v-if="!props.scrollbar && props.showFooter">
          <div>{{ t('common.noMoreData') }}</div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  .loading,
  .noMore {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
  }
}
</style>
