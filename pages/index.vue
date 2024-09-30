<script setup lang="ts">
import TweetMessages from '@/components/Tweet/TweetMessages.vue';
import loadingIcon from '~/components/loadingIcon/index.vue';
import mitt from '@/utils/mitt.js';
import useScroll from '@/hooks/useScroll';
import { manualFetch } from '~/api/base';
const { t } = useI18n();
const componentName = 'home';
const route = useRoute();

const seoTitle = computed(() => {
  if (route.params.maxid) {
    return t('timeline.homeHeadForMaxid', { maxid: route.params.maxid });
  }
  return t('timeline.homeHead');
});

useHead({
  title: seoTitle.value,
  meta: [
    {
      name: 'description',
      content: t('timeline.homeHead'),
    },
  ],
});
definePageMeta({
  name: 'home',
  alias: '/page-maxid-:maxid?',
});

defineOptions({ name: 'home' });

const pullLoading = ref(false);

const userInfo = getUser();

const apiOptions = computed(() => {
  if (!userInfo.value?.username) {
    return { api: '/_api/v1/timeline', key: 'timeLine' };
  }
  return { api: '/_api/v1/following', key: 'following' };
});

const { data, loading, refresh, maxId } = await useList('homeList', async ({ max_id }: { max_id: string }) => {
  const res = await manualFetch(apiOptions.value.api, {
    params: !!max_id ? { max_id, limit: 30 } : { limit: 30 },
  });

  pullLoading.value = false;

  mitt.emit('tweetListLoading', false);

  return res;
});
const finished = computed(() => {
  let flag = false;
  if (data.value?.currentLength < 30) {
    flag = true;
  }
  return flag;
});

const tweetList = computed(() => {
  return data.value?.list || [];
});

import { useNewTweetToast } from '@/components/newTweetToast/index.js';
const showTweetToast = useNewTweetToast();
const newTweetList = ref<any>([]);
const homeNav = ref(null);
const isElementInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};
const addCount = (tweet: any) => {
  if (newTweetList.value.length === 3) return;
  newTweetList.value.push(tweet.account);
  if (newTweetList.value.length === 3) {
    showTweetToast({
      accounts: newTweetList.value,
      message: 'posted',
      isShowNav: isElementInViewport(homeNav.value),
    });
    setTimeout(() => {
      newTweetList.value = [];
    }, 60000);
  }
};

const getList = () => {
  if (tweetList.value.length > 0) {
    maxId.value = tweetList.value[tweetList.value.length - 1]?.id || '';
  }
};

const tweetMessagesRef = ref<any>(null);
const cb = (data: any) => {
  tweetList.value.unshift(data);
};
const editCb = (data: any) => {
  const index = tweetList.value.findIndex((item: any) => item.id === data.id);
  if (index !== -1) {
    tweetList.value.splice(index, 1, data);
  }
};
import { useWsTweetStore } from '@/stores/wsTweet';
const useWsTweet = useWsTweetStore();

const refresshTweetCb = () => {
  const list = data.value?.list || [];
  if (tweetList.length) {
    list.unshift(...tweetList);
  }
};
const { subscribeHome } = useWebSocketManager();
onMounted(() => {
  mitt.on('submit-tweet', cb);

  mitt.on('edit-tweet', editCb);

  mitt.on('refresh-tweet-list', refresshTweetCb);

  subscribeHome((event: string, tweet: any) => {
    const list = data.value?.list || [];
    if (event === 'delete') {
      const index = list.findIndex((item: any) => item.id === tweet);

      if (index >= 0) {
        list.splice(index, 1);
      }

      return;
    }

    useWsTweet.addData(tweet, 'home');

    tweet.attachments = tweet.media_attachments;
    tweet.content_rendered = tweet.content;
    if (tweet.in_reply_to_id) tweet.reply_to_id = tweet.in_reply_to_id;

    if (!list.length) {
      return;
    }

    addCount(tweet);
  });
});

onUnmounted(() => {
  mitt.off('edit-tweet', editCb);
  mitt.off('submit-tweet', cb);
  mitt.off('refresh-tweet-list', refresshTweetCb);
});

const router = useRouter();

const goRouter = (path = '/public/timeline') => {
  router.push(path);
};

const onRefresh = async () => {
  pullLoading.value = true;

  if (!maxId.value) {
    maxId.value = '';
    refresh();
    return;
  }

  maxId.value = '';
};

onDeactivated(() => {
  useScroll().setScrollCache(componentName);
});

onActivated(() => {
  const { getScrollCache, toScroll } = useScroll();
  const scrollTop = getScrollCache(componentName);
  toScroll(scrollTop);
});

const nextPageHref = computed(() => {
  const routes = router.getRoutes();
  const currentIndex = routes.find((r) => r.path === route.path);
  const path = currentIndex?.path.endsWith('/') ? currentIndex?.path : currentIndex?.path + '/';
  return path + 'page-maxid-' + tweetList.value[tweetList.value.length - 1]?.id;
});
watchEffect(() => {
  if (route.params.maxid) {
    maxId.value = route.params.maxid || '';
  }
});

const tabList = [
  {
    name: t('layout.home'),
    path: '/',
  },
  {
    name: t('public.local'),
    path: '/public/local',
  },
  {
    name: t('public.crossSite'),
    path: '/public/common',
  },
];
</script>

<template>
  <div class="home-view-pages">
    <nav class="tab-nav" ref="homeNav">
      <nuxt-link class="nav-item" v-for="item in tabList" :key="item.path" :class="{ active: item.path === '/' }" :to="item.path">
        <div class="item-text">
          {{ item.name }}
        </div>
      </nuxt-link>
    </nav>
    <van-pull-refresh v-model="pullLoading" @refresh="onRefresh" head-height="75">
      <TweetMessages ref="tweetMessagesRef" :tweetList="tweetList" :loading="loading" @load="getList" @onRefresh="onRefresh" :finished="finished">
        <template #nullText>
          <div class="null-text">
            <p>{{ t('timeline.currentlyNoContent') }}</p>
            <div class="tips">
              {{ t('timeline.recommendTo') }}
              <a-link @click="goRouter('/public/common')">
                {{ t('timeline.public') }}
              </a-link>
              {{ t('timeline.or') }}
              <a-link @click="goRouter('/public/local')"> {{ t('timeline.local') }} </a-link>
              {{ t('timeline.browseMessagesAndFollowUsersYouLike') }}
            </div>
          </div>
        </template>
      </TweetMessages>
      <nuxt-link :to="nextPageHref" class="nuxt-link-2">
        {{ t('public.nextPage') }}
      </nuxt-link>
      <template #loading>
        <loadingIcon></loadingIcon>
      </template>
    </van-pull-refresh>
  </div>
</template>

<style lang="scss">
.nuxt-link-2 {
  display: none;
}
.dark .home-view-pages {
  color: white !important;
}

.home-view-pages {
  width: 100%;
}

.null-text {
  padding: 20px;
  text-align: center;

  .tips {
    font-size: 14px;
  }
}

.tab-nav {
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
  line-height: 36px;
  display: none;

  .nav-item {
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    padding: 8px 0;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease-out;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    .item-text {
      color: #536471;
      width: 100%;
      text-align: center;
      height: 40px;
      line-height: 40px;
      font-weight: 700;
      font-size: 15px;
    }
    &:hover {
      background-color: var(--color-neutral-3);
    }
    &.active {
      &::before {
        content: ' ';
        display: block;
        background: rgb(var(--arcoblue-6));
        width: 56px;
        height: 4px;
        border-radius: 2px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      .item-text {
        color: #0f1419;
      }
    }
  }
}
@include respond('phone') {
  .tab-nav {
    display: flex;
  }
}
</style>
