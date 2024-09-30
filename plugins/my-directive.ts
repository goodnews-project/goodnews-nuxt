export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('account-name', {
    beforeMount(el, binding) {
      const emojiList = binding?.value?.emoji || [];
      emojiList.forEach((item: any) => {
        const text = `:${item.shortcode}:`;
        const reg = new RegExp(text, 'g');
        el.innerHTML = el.innerHTML.replace(reg, `<img src="${item.image_url}" style="width:20px;height:20px;display: inline-block" />`);
      });
    },
  });
  nuxtApp.vueApp.directive('tweetContontEmoji', {
    beforeMount(el, binding) {
      const emojiList = binding?.value?.emoji || [];
      emojiList.forEach((item: any) => {
        const text = `:${item.shortcode}:`;
        const reg = new RegExp(text, 'g');
        el.innerHTML = el.innerHTML.replace(reg, `<img src="${item.image_url}" style="width:20px;display: inline-block" />`);
      });
    },
  });

  nuxtApp.vueApp.directive('only-play', {
    beforeMount(el) {
      el.cb = () => {
        const videos: NodeListOf<HTMLVideoElement> = document.querySelectorAll('video[data-playing="true"]');

        for (const video of videos) {
          if (video !== el) {
            video.pause();
          }
        }
        el.setAttribute('data-playing', 'true');
      };

      el.cb2 = () => {
        el.removeAttribute('data-playing');
      };
      el.addEventListener('play', el.cb);

      el.addEventListener('pause', el.cb2);
    },
    unmounted(el) {
      // 暂停
      el.pause();
      el.removeEventListener('play', el.cb);
      el.removeEventListener('pause', el.cb2);
    },
  });

  nuxtApp.vueApp.directive('swipe', {
    async mounted(el, binding) {
      await nextTick();
      let scrollY = 0;
      let startRecord = false;
      const handleSrcoll = (e) => {
        if (!startRecord) return;
        // 获取当前滚动行为是上滑还是下滑
        if (e.target.documentElement.scrollTop <= 0) return;
        // 如果即将到达底部，则不触发
        const maxScroll = e.target.documentElement.scrollHeight - e.target.documentElement.clientHeight;
        if (e.target.documentElement.scrollTop >= maxScroll - 150) return;
        const direction = e.target.documentElement.scrollTop - scrollY > 0 ? 'down' : 'up';
        binding.value(direction);
        // 记录滚动条高度
        scrollY = e.target.documentElement.scrollTop;
      };
      const handleTouchStart = (e) => {
        startRecord = true;
      };

      const handleTouchEnd = (e) => {
        startRecord = false;
      };

      document.addEventListener('pointerdown', handleTouchStart);
      document.addEventListener('pointerup', handleTouchEnd);
      document.addEventListener('scroll', handleSrcoll);
      // 在卸载的时候移除事件监听
      document._handleTouchStart = handleTouchStart;
      document._handleTouchEnd = handleTouchEnd;
      document._handleScroll = handleSrcoll;
    },
    unmounted(el) {
      document.removeEventListener('pointerdown', document._handleTouchStart);
      document.removeEventListener('pointerup', document._handleTouchEnd);
      document.removeEventListener('scroll', document._handleScroll);
    },
  });

  nuxtApp.vueApp.directive('timeline-restrain', {
    async mounted(el, binding) {
      const isImg = el.tagName === 'IMG';
      if (!isImg) return;
      // 图片是否是竖直方向
      const isVertical = binding.value.width < binding.value.height;
      // 如果图片是竖图，则设置高度为推文最大宽度的120%，同比例缩放宽度
      if (isVertical) {
        // 给图片设置最大宽度和最大高度
        const width = el.offsetWidth;
        const maxHeight = width * 1;
        // 高度设置为maxHeight 宽度等比例缩放
        el.style.height = `${maxHeight}px`;
        el.style.width = 'auto';
        el.style['border-radius'] = '4px';
        return;
      }
      // 正常图片，宽度
      const width = el.offsetWidth;
      const originWidth = binding.value.width;
      const originHeight = binding.value.height;
      el.style.height = `${originHeight * (width / originWidth)}px`;
      el.style.width = '100%';
      return;
    },
  });
});
