<template>
  <ClientOnlyAModal modal-class="embed-tweet-comp" v-model:visible="visiable" @close="handleClose" :title="t('tweet.embed.title')">
    <div class="embed-tweet-comp_content">
      <div>{{ t('tweet.embed.desc') }}</div>
      <a-input type="text" :default-value="inputVal" readonly />
      <div>{{ t('tweet.embed.showDesc') }}</div>
      <iframe v-if="visiable" class="w-full h-full" :src="url"></iframe>
    </div>
  </ClientOnlyAModal>
</template>
<script setup>
import { ref, watch } from 'vue';
const emit = defineEmits(['update:show']);
const { t } = useI18n();
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  path: {
    type: String,
    default: '',
  },
});

const visiable = ref(false);
const url = ref('');

onMounted(() => {
  const baseUrl = location.origin;
  url.value = `${baseUrl}/${props.path}`;
});

watch(url, (newUrl) => {
  inputVal.value = `<iframe src="${newUrl}" width="400" allowfullscreen="allowfullscreen" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"></iframe>`;
});

const inputVal = ref(
  `<iframe src="${url.value}" width="400" allowfullscreen="allowfullscreen" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"></iframe>`
);

const handleClose = () => {
  emit('update:show', false);
};

watch(
  () => props.show,
  (newValue) => {
    visiable.value = newValue;
  }
);
</script>

<style lang="scss">
.embed-tweet-comp {
  .embed-tweet-comp_content {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>

<style lang="scss" scoped>
iframe {
  border: 2px solid var(--color-neutral-3);
}
</style>
