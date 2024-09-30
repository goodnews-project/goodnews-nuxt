<script setup>
import CustomImage from '@/components/CustomImage/index.vue';
import CustomVideo from '@/components/CustomVideo/index.vue';
import TweetContentVote from '@/components/TweetContentVote/index.vue';
import defaultAvatar from '@/assets/images/default-avatar.jpg';
import defaultTweet from '@/assets/images/default-tweet.jpg';
import PhotoDetails from './components/PhotoDetails.vue';
import { Tippy } from 'vue-tippy';
import UserCardContent from '@/components/UserCard/content.vue';
import { blurHashData } from './config';
import { editTweetData, unlockTweet, getTweetDetail } from '~/api/tweet';
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const props = defineProps({
  status: {
    type: Object,
    default: () => ({}),
  },
  showMedia: {
    type: Boolean,
    default: true,
  },
});
const userInfo = getUser();

// 是不是本人的推文
const isSelf = computed(() => userInfo.value?.id === props.status.account.id);
import { useLoginModalStore } from '@/stores/loginModal';
const loginModalStore = useLoginModalStore();

const getSensitive = () => {
  if (getUser().value?.is_display_sensitive === 1) {
    return false;
  }
  if (props.status.is_sensitive === 1) {
    return true;
  }
  return false;
};
const isSensitive = ref(getSensitive());
const showSensitive = () => {
  isSensitive.value = false;
};
const hideSensitive = () => {
  isSensitive.value = true;
};
provide('isSensitive', isSensitive);

import { deepClone } from '~/utils';
const mergeProps = (config, data) => {
  const resultData = deepClone(data);
  if (resultData.thumbnail_height === undefined) {
    resultData.thumbnail_height = resultData.height;
  }
  if (resultData.thumbnail_width === undefined) {
    resultData.thumbnail_width = resultData.width;
  }
  Object.keys(config).forEach((key) => {
    if (resultData[key] === null) {
      resultData[key] = config[key];
    }
  });
  return resultData;
};
const tweetData = computed(() => props.status);
const emits = defineEmits(['reTweet', 'goDetail']);
const reTweet = (data) => {
  emits('reTweet', data);
};
const goDetail = () => {
  emits('goDetail');
};

const renderAvatar = (attachment, isSmall = false) => {
  const url = attachment.url || attachment.remote_url;
  if (url || attachment.thumbnail_url) {
    const thumbnail_url = attachment.thumbnail_url || url;
    return isSmall ? thumbnail_url : url;
  } else {
    return '';
  }
};
const dialogVisible = ref(false);
const photoDetailsDom = ref(null);
const popStateHandler = (e) => {
  if (e.type === 'popstate' && dialogVisible.value) {
    window.removeEventListener('popstate', popStateHandler);
    closeDialog();
  }
};
import useVideos from '@/hooks/useVideos';
const previewImage = async (image, i) => {
  if (isSensitive.value) {
    return;
  }

  // 暂停所有视频播放
  useVideos().pauseAllVideos();
  dialogVisible.value = true;
  await nextTick();
  photoDetailsDom.value && photoDetailsDom.value.handleCarousel(i + 1);
  history.pushState({ modalOpen: true }, '');
  window.addEventListener('popstate', popStateHandler);
};
const popClose = async () => {
  dialogVisible.value = false;
};
onUnmounted(() => {
  window.removeEventListener('popstate', popStateHandler);
});
const closeDialog = () => {
  if (history?.state?.modalOpen) {
    history.back();
  }
};
const tweetHtml = ref(null);
const tweetContent = ref(null);
// 文本是否超过三行
const tweetMode = inject('tweetMode', ref('default'));
// 是否是推文详情页 - 在推文详情页,不显示展开按钮
const isTweetDetail = computed(() => tweetMode.value === 'detail');
// 是否查看更多
const isExceeded = ref(isTweetDetail.value);
const isTextExceeded = computed(() => {
  if (tweetHtml.value) {
    // 文字内容是否超过3行
    const isShowExceeded = tweetHtml.value.scrollHeight > tweetHtml.value.clientHeight;
    return isShowExceeded && !isExceeded.value;
  }
  return false;
});
const showMore = () => {
  isExceeded.value = true;
};
const hideMoreTtmlStyle = computed(() => {
  const hideObj = {
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-line-clamp': '3',
    '-webkit-box-orient': 'vertical',
  };
  return !isExceeded.value ? hideObj : {};
});
const triggerTarget = ref(null);
const triggerAccount = ref(null);
const userCardContentRef = ref(null);
onMounted(async () => {
  tweetHtml.value.addEventListener('mouseover', async (e) => {
    if (e.target.classList.contains('mention')) {
      const currentUsername = e.target.href.split('/').pop();
      const currentAccount = props.status.mentions.find((account) => {
        return account.acct === currentUsername;
      });
      if (currentAccount) {
        triggerAccount.value = currentAccount;
        triggerTarget.value = e.target;
      }
    }
  });
  await nextTick();
  const elements = tweetHtml.value.querySelectorAll('*');
  elements.forEach((element) => {
    if (element.tagName === 'A') {
      element.addEventListener('click', (e) => {
        e.stopPropagation();

        if (e.target.href.includes(location.host)) {
          e.preventDefault();
          router.push(e.target.pathname);
        } else {
          e.preventDefault();
          window.open(e.target.href, '_blank');
        }
      });
    }
  });
});

const styleResult = computed((index) => {
  // 如果是1个图片，则占据100%的宽度和高度
  // 如果是2个图片，则各自占据一半的宽度
  // 如果是3个图片，则第一张图片占据一半的宽度，100%的高度。后面两张图片占据剩下的一半的宽度，各自占据50%的高度
  // 如果是4个图片，则分别占据50%的宽度和50%的高度
  // 没有其他情况
  const length = fileList.value?.length;
  let result = [];
  if (length === 1) {
    result = [
      {
        width: '100%',
        height: '100%',
        inset: 'auto 1px auto 1px',
      },
    ];
  } else if (length === 2) {
    result = [
      {
        width: 'calc(50% - 1px)',
        height: '100%',
        inset: 'auto auto auto auto',
      },
      {
        width: 'calc(50% - 1px)',
        height: '100%',
        inset: 'auto 0 auto auto',
      },
    ];
  } else if (length === 3) {
    result = [
      {
        width: 'calc(50% - 1px)',
        height: '100%',
        inset: '0 auto 0 0',
      },
      {
        width: 'calc(50% - 1px)',
        height: 'calc(50% - 1px)',
        inset: '0 0 auto auto',
      },
      {
        width: 'calc(50% - 1px)',
        height: 'calc(50% - 1px)',
        inset: 'auto 0 0 auto',
      },
    ];
  } else if (length === 4) {
    result = [
      {
        width: 'calc(50% - 1px)',
        height: 'calc(50% - 1px)',
        inset: '0 auto auto 0',
      },
      {
        width: 'calc(50% - 1px)',
        height: 'calc(50% - 1px)',
        inset: '0 0 auto auto',
      },
      {
        width: 'calc(50% - 1px)',
        height: 'calc(50% - 1px)',
        inset: 'auto auto 0 0',
      },
      {
        width: 'calc(50% - 1px)',
        height: 'calc(50% - 1px)',
        inset: 'auto 0 0 auto',
      },
    ];
  }
  return result;
});

const fileList = computed(() => {
  if (props.status.attachments?.length && props.showMedia) {
    return props.status.attachments?.filter((item, i) => i < 4);
  }

  return [];
});

import { useArticleStore } from '@/stores/articleStore';
const articleStore = useArticleStore();
const { stop } = useIntersectionObserver(tweetHtml, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    articleStore.addArticleId(props.status.id);
  }
});
</script>

<template>
  <div class="tweet-content">
    <tippy
      :triggerTarget="triggerTarget"
      theme="light"
      interactive
      interactiveDebounce="25"
      placement="bottom-start"
      :offset="[0, 35]"
      animation="scale"
      inertia
    >
      <template #content>
        <div style="padding: 10px">
          <UserCardContent v-if="triggerAccount" :account="triggerAccount"></UserCardContent>
        </div>
      </template>
    </tippy>
    <div class="tweet-html" ref="tweetHtml" @click="goDetail" :style="hideMoreTtmlStyle">
      <div
        ref="tweetContent"
        v-html="tweetData.origin_status?.content_rendered || tweetData.content_rendered || tweetData.content"
        v-tweetContontEmoji="tweetData"
      ></div>
    </div>
    <a-link v-if="isTextExceeded" class="showmore" @click.stop="showMore">{{ t('tweet.showMore') }}</a-link>
    <nuxt-link class="nuxt-link-href" :to="`/user/${tweetData.account.acct}/status/${tweetData.id}`">{{ t('tweet.viewDetail') }}</nuxt-link>
    <div class="vote-block" v-if="status.polls">
      <TweetContentVote :data="status" @reTweet="reTweet"></TweetContentVote>
    </div>
    <PreviewCard v-if="status.preview_card" :previewCard="status.preview_card"></PreviewCard>

    <div @click.stop class="media-frame" v-if="showMedia && fileList?.length">
      <div class="media-sensitive" v-if="status.is_sensitive === 1">
        <div @click.stop="showSensitive" v-if="isSensitive">{{ t('tweet.showSensitiveContent') }}</div>
        <div @click.stop="hideSensitive" v-else>{{ t('tweet.hide') }}</div>
      </div>
      <template v-if="fileList.length === 1">
        <div class="media-gallery" @click.stop :style="fileList.length == 1 ? '--height : auto' : ''">
          <div class="media-gallery__item" :key="attachment.id" v-for="(attachment, i) in fileList" style="position: static">
            <div class="video-box" v-if="attachment.file_type == 4">
              <CustomVideo class="w-full" :src="attachment.url" controls :poster="attachment.thumbnail_url" @click.stop></CustomVideo>
            </div>
            <template v-else>
              <CustomImage
                :data-src="renderAvatar(attachment, !tweetMode === 'detail')"
                :data="mergeProps(blurHashData, attachment)"
                @click.stop="previewImage(renderAvatar(attachment), i)"
                defaultImg="/images/bg-white.png"
                class="media-gallery__image"
                v-timeline-restrain="attachment"
                alt=""
              />
            </template>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="media-gallery media-gallerys" @click.stop :style="fileList.length == 1 ? '--height : auto' : ''">
          <div class="media-gallery__item" :key="attachment.id" v-for="(attachment, i) in fileList" :style="styleResult[i]">
            <template v-if="attachment.file_type == 4">
              <CustomVideo class="w-full h-full" :src="attachment.url" controls :poster="attachment.thumbnail_url" @click.stop></CustomVideo>
            </template>
            <template v-else>
              <CustomImage
                :data-src="renderAvatar(attachment, !tweetMode === 'detail')"
                :data="mergeProps(blurHashData, attachment)"
                @click.stop="previewImage(renderAvatar(attachment), i)"
                defaultImg="/images/bg-white.png"
                class="media-gallery__image"
                alt=""
              />
            </template>
          </div>
        </div>
      </template>
    </div>

    <ClientOnlyAModal
      v-model:visible="dialogVisible"
      :footer="false"
      hide-title
      fullscreen
      body-class="photo-detail-body"
      modal-class="photo-detail-modal"
      @close="closeDialog"
    >
      <PhotoDetails v-if="dialogVisible" ref="photoDetailsDom" :status="props.status" @close="popClose"></PhotoDetails>
    </ClientOnlyAModal>
  </div>
</template>

<style lang="scss" scoped>
.video-box {
  background: #000;
  max-height: 500px;
  flex: 1;
  height: 100%;
  video {
    height: 100%;
    max-height: 500px;
  }
}

.tweet-html {
  padding-top: 0;
  // 英文单词换行
  word-break: break-word;
  :deep(*) {
    .mention,
    .hashtag,
    .u-url,
    a {
      color: rgb(var(--arcoblue-6));

      &:hover {
        // 显示下划线
        text-decoration: underline;
      }
    }
  }
}
.showmore {
  padding: 0;
}

.nuxt-link-href {
  display: none;
}
.media-frame {
  position: relative;
  .media-sensitive {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    color: #fff;
    padding: 6px 16px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(50px);
  }
}
.media-gallery {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  &.media-gallerys {
    // 多图情况下，容器比例为16:9
    width: 100%;
    aspect-ratio: 16 / 9;
    .media-gallery__item {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
  }
  .media-gallery__item {
    border: 0;
    display: block;
    display: flex;
    align-items: center;
    overflow: hidden;
    .media-gallery__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
.subscription-desc {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
  .text-strong {
    font-weight: 600;
  }
}
@include respond('phone') {
  .media-gallery {
    --height: 200px;
  }
}
</style>

<style lang="scss">
.photo-detail-modal {
  position: fixed;
  inset: 0;
  .photo-detail-body {
    padding: 0;
    height: 100%;
  }
}
</style>
