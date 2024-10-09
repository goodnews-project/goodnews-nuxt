<script setup>
import CustomImage from '@/components/CustomImage/index.vue';
import CustomVideo from '@/components/CustomVideo/index.vue';
import TweetBar from '@/components/Tweet/TweetBar.vue';
import TweetContent from '@/components/Tweet/TweetContent.vue';
import UserCard from '@/components/UserCard/index.vue';
import { Message } from '@arco-design/web-vue';
const loginModalStore = useLoginModalStore();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const props = defineProps({
  status: {
    type: Object,
    default: () => {},
  },
});
const emits = defineEmits(['close', 'reTweet']);

const goBack = () => {
  emits('close');
};

const goRouter = (path) => {
  goBack();
  router.push(path);
  return;
};

const userStore = useUserStore();

const carouselDom = ref(null);
watchEffect(() => {
  if (carouselDom.value) {
    carouselDom.value.$el.addEventListener('click', (e) => {
      if (typeof e.target.className === 'string') {
        const ableClass = ['arco-carousel-indicator-item', 'arco-carousel-arrow-right', 'arco-carousel-arrow-left'];
        const flag = ableClass.some((item) => e.target.className.includes(item));
        if (!flag) {
          goBack();
          e.stopPropagation();
        }
      }
    });
  }
});
const currentImg = ref(0);

const tweetData = computed(() => {
  return props.status;
});

const attatchmentList = ref([]);

onMounted(() => {
  attatchmentList.value = tweetData.value.attachments;
});

const replyTweet = ref('');
const tweetByReplyLoading = ref(false);
import mitt from '~/utils/mitt.js';
import { replyToTweet } from '@/api/tweet';
const sendTweetByReply = async () => {
  if (!userStore.userInfo) {
    loginModalStore.openLoginModal();
    return;
  }
  const content = `@${tweetData.value.account.acct} ${replyTweet.value}`;
  const params = {
    content: content,
    reply_to_id: tweetData.value.id,
    is_sensitive: false,
    attachments: [],
  };
  tweetByReplyLoading.value = true;
  const newReplyTweet = await replyToTweet(params).finally(() => {
    tweetByReplyLoading.value = false;
  });
  console.log('data', newReplyTweet);
  replyTweetList.value.unshift(newReplyTweet);
  mitt.emit('submit-tweet', newReplyTweet);
  Message.success(t('tweet.commentSuccess'));
  replyTweet.value = '';
};

const replyTweetList = ref([]);
const tweetLoading = ref(false);
const tweetFinished = ref(false);
import { getTweetReplyList } from '@/api/tweet';
const getReplyTweetListData = async (params) => {
  tweetLoading.value = true;
  const tweetParams = {
    acct: tweetData.value.account.acct,
    id: tweetData.value.id,
  };
  const { data } = await getTweetReplyList(tweetParams, params).finally(() => {
    tweetLoading.value = false;
  });
  replyTweetList.value.push(...Array.from(data.value.data));
  if (replyTweetList.value.length >= Array.from(data.value.data).length) {
    tweetFinished.value = true;
  }
};

const moreHandleOptions = {
  showDelete: false,
  openOriginUrl: true,
  embed: false,
  mention: false,
  message: true,
  follow: true,
  top: false,
  mute: false,
  block: false,
  hide: false,
  filterPost: false,
};

const handleCarousel = async (index) => {
  currentImg.value = index;
};
defineExpose({
  handleCarousel,
});

const viewDetail = () => {
  const path = `/${tweetData.value.account.acct}/status/${tweetData.value.id}`;
  goRouter(path);
};
router.beforeEach((to, from, next) => {
  goBack();
  next();
});
provide('tweetMode', ref('detail'));

import useVideos from '@/hooks/useVideos';
onUnmounted(() => {
  useVideos().pauseAllVideos();
});

const renderAvatar = (attachment, isSmall = false) => {
  const url = attachment.url || attachment.remote_url;
  if (url || attachment.thumbnail_url) {
    const thumbnail_url = attachment.thumbnail_url || url;
    return isSmall ? thumbnail_url : url;
  } else {
    return defaultAvatar;
  }
};
</script>

<template>
  <div class="pages">
    <div class="photo-area">
      <div class="close" @click="goBack">
        <Icon name="tdesign:close-circle-filled" />
      </div>
      <div class="right-btn" v-if="route.name !== 'tweet-status'">
        <a-dropdown>
          <a-button type="text">
            <nuxt-icon name="gengduo"></nuxt-icon>
          </a-button>
          <template #content>
            <a-doption @click="viewDetail">{{ t('tweet.viewDetail') }}</a-doption>
          </template>
        </a-dropdown>
      </div>
      <div class="container">
        <a-carousel class="photo-carousel" ref="carouselDom" v-model:current="currentImg">
          <a-carousel-item v-for="(attachment, i) in status.attachments" :key="i" class="carousel-item">
            <template v-if="attachment.file_type == 4">
              <CustomVideo class="carousel-img" :src="attachment.url" controls :poster="attachment.thumbnail_url" @click.stop></CustomVideo>
            </template>
            <template v-else>
              <CustomImage
                class="carousel-img"
                :data="attachment"
                :defaultImg="renderAvatar(attachment, false)"
                :data-src="attachment.url || attachment.remote_url"
                @click.stop
              ></CustomImage>
            </template>
          </a-carousel-item>
        </a-carousel>
      </div>
    </div>
    <div class="tweet-info">
      <div class="tweet-main">
        <div class="tweet-header">
          <div class="tweet-avatar">
            <UserCard :account="tweetData.account">
              <Avatar :account="tweetData.account" @click="goRouter(`/${tweetData.account.acct}`)"></Avatar>
            </UserCard>
          </div>
          <UserCard :account="tweetData.account">
            <div class="userinfo" @click="goRouter(`/${tweetData.account.acct}`)">
              <div class="userinfo-name">
                {{ tweetData.account.display_name }}
              </div>
              <div class="userinfo-desc">{{ tweetData.account.acct }}</div>
            </div>
          </UserCard>
          <MoreHandle :status="tweetData" :index="props.index" :options="moreHandleOptions"></MoreHandle>
        </div>
        <div class="tweet-body">
          <TweetContent :status="tweetData" :showMedia="false"></TweetContent>
        </div>
        <div class="tweet-time">
          <!-- {{ $dayjs(status.published_at).format('YYYY-MM-DD HH:mm:ss') }} -->
        </div>
        <TweetBar v-model="tweetData"></TweetBar>

        <div class="reply-handle">
          <div class="mention">
            <a-tag color="arcoblue">@{{ tweetData.account.acct }}</a-tag>
          </div>
          <a-textarea
            v-model="replyTweet"
            :placeholder="t('tweet.writeYourComment')"
            allow-clear
            :auto-size="{
              minRows: 3,
            }"
          />
          <div style="text-align: right">
            <a-button type="primary" :loading="tweetByReplyLoading" @click="sendTweetByReply">{{ t('tweet.comment') }}</a-button>
          </div>
        </div>
        <div class="replyList">
          <TweetMessages
            viewKey="local"
            :tweetList="replyTweetList"
            :loading="tweetLoading"
            @load="getReplyTweetListData"
            :finished="tweetFinished"
            class="replyTweetsList"
          ></TweetMessages>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pages {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;

  .photo-area {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-text-1);
    position: relative;

    .close {
      position: absolute;
      top: 4px;
      left: 4px;
      width: 32px;
      height: 32px;
      font-size: 32px;
      z-index: 2;
      transition: all 0.3s ease-in-out;
      color: var(--color-neutral-9);
      @extend %cp;
      @extend %flex-col-center;

      &:hover {
        color: var(--color-neutral-8);
      }
    }

    .right-btn {
      --size: 24px;
      position: absolute;
      right: 4px;
      top: 4px;
      z-index: 2;
      font-size: var(--size);
      @extend %cp;
      @extend %flex-col-center;
      @extend %dropdown-color;
      gap: 10px;
    }

    .container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .photo-carousel {
        width: 100%;
        height: 100%;

        .carousel-item {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: #000000;
          .carousel-img {
            max-width: 80%;
            max-height: 80%;
            margin: auto;
            width: auto;
            height: auto;
          }
        }
      }
    }
  }

  .tweet-info {
    width: 560px;
    text-align: left;
    padding-top: 10px;
  }

  .tweet-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .tweet-header {
      display: flex;
      gap: 10px;
      padding: 0 10px;
      align-items: center;

      .userinfo {
        display: flex;
        flex-direction: column;
        align-items: baseline;
        font-size: 14px;

        .userinfo-name {
          color: var(--color-text-2);
        }

        .userinfo-desc {
          color: var(--color-text-3);
        }
      }
    }

    .tweet-body {
      --avatar: 48px;
      padding: 10px;
      font-size: 15px;
      color: var(--color-text-1);
    }

    .tweet-time {
      color: var(--color-text-3);
      font-size: 14px;
      padding: 0 10px;
    }

    .tweet-bar {
      border-top: 1px solid var(--color-neutral-3);
      border-bottom: 1px solid var(--color-neutral-3);
      padding: 16px;
      height: 50px;
    }

    .reply-handle {
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }
}

@include respond('phone') {
  .tweet-info {
    display: none;
  }

  .right-show {
    display: none;
  }

  .right-unshow {
    display: block;
  }
}
</style>
