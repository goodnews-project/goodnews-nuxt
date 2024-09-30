<script setup>
const props = defineProps({
  src: {
    type: String,
    required: true,
  },
});

const videoSrc = ref('');

const videoDom = ref(null);
const { stop } = useIntersectionObserver(
  videoDom,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      videoSrc.value = props.src;
      stop();
    }
  },
  {
    rootMargin: '500px',
  }
);

import Hls from 'hls.js';
const initVideo = () => {
  // 视频是否是流媒体
  const streamFileList = ['m3u8', 'mpd', 'ism'];
  const isStream = streamFileList.includes(props.src.split('.').pop());
  const source = props.src;
  const video = videoDom.value;
  if (isStream) {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(props.src);
      hls.attachMedia(videoDom.value);
      return;
    }
  }
  // 如果不是流媒体，则直接赋值src
  video.src = props.src;
};
onMounted(() => {
  initVideo();
});
</script>

<template>
  <video ref="videoDom" v-only-play></video>
</template>

<style scoped lang="scss">
.video-element {
  width: 100%;
  height: auto;
}
</style>
