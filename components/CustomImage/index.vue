<template>
  <img alt="Lazy-loaded Image" ref="img" v-bind="{ ...$attrs }" :src="src" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  defaultImg: {
    type: String,
    default: '',
  },
  dataSrc: {
    type: String,
    default: '',
  },
});

const tweetMode = inject('tweetMode', ref('list'));
const isDetail = computed(() => {
  return tweetMode.value === 'detail';
});

const renderWidth = computed(() => {
  if (isDetail.value) {
    if (props.data.width) {
      const num = props.data.width + '';
      return num;
    }
    return '';
  }
  const num = (props.data.thumbnail_width || props.data.width || 500) + '';
  return num;
});
const isSensitive = inject('isSensitive', ref(false));
// 敏感内容封面
const sensitiveCover = ref('');
const src = ref(props.defaultImg || '/images/bg-white.png');
// 原图是否加载完成
const isOriginal = ref(false);
// 原图url
watchEffect(() => {
  if (!isSensitive.value && isOriginal.value) {
    if (src.value != props.dataSrc) {
      src.value = props.dataSrc;
    }
  }
  if (isSensitive.value) {
    src.value = sensitiveCover.value;
  }
});
const img = ref(null);
let observer = null;

import MyWorker from '@/workers/worker.js?worker';
onMounted(async () => {
  await nextTick();
  observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 如果有blurhash,则显示模糊图片
        if (props.data?.blurhash && props.data.height && props.data.width) {
          const worker = new MyWorker();
          const data = JSON.stringify(props.data);
          worker.postMessage(data);
          worker.onmessage = (e) => {
            try {
              const blob = e.data;
              const blobUrl = URL.createObjectURL(blob);
              sensitiveCover.value = blobUrl;
              if (!isOriginal.value) {
                src.value = blobUrl;
              }
            } catch (error) {
              console.log(error);
            }
            worker.terminate();
          };
        } else {
          if (props.defaultImg) {
            sensitiveCover.value = props.defaultImg;
            src.value = props.defaultImg;
          }
        }
        if (props.dataSrc === '') {
          return;
        }
        const image = new Image();
        image.src = props.dataSrc;
        image.onload = () => {
          isOriginal.value = true;
          if (!isSensitive.value) {
            src.value = props.dataSrc;
          }
        };
        observer.unobserve(entry.target);
      }
    });
  });
  img.value && observer.observe(img.value);
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>
