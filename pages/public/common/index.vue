<script setup lang="ts">
import loadingIcon from '~/components/loadingIcon/index.vue';
import { manualFetch } from '~/api/base';
import useScroll from '@/hooks/useScroll.js';
const { t } = useI18n();
const route = useRoute();

const seoTitle = computed(() => {
  if (route.params.maxid) {
    return t('timeline.publicHeadForMaxid', { maxid: route.params.maxid });
  }
  return t('timeline.publicHead');
});

useHead({
  title: seoTitle.value,
  meta: [
    {
      name: 'description',
      content: t('timeline.publicHead'),
    },
  ],
});

definePageMeta({
  name: 'public-common',
  alias: '/public/common/page-maxid-:maxid?',
});

defineOptions({ name: 'public-common' });

const pullLoading = ref(false);
import mitt from '@/utils/mitt';
const { data, loading, refresh, maxId } = await useList('publicCommon', async ({ max_id }: { max_id: string }) => {
  const res = await manualFetch('/_api/v1/timeline', {
    method: 'get',
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
    });
    setTimeout(() => {
      newTweetList.value = [];
    }, 60000);
  }
};
const { subscribeTimelineCommon } = useWebSocketManager();

const getList = () => {
  if (tweetList.value.length > 0) {
    maxId.value = tweetList.value[tweetList.value.length - 1]?.id || '';
  }
};

const cb = (data: any) => {
  tweetList.value.unshift(data);
};
const editCb = (data: any) => {
  const index = tweetList.value.findIndex((item: any) => item.id === data.id);
  if (index !== -1) {
    tweetList.value.splice(index, 1, data);
  }
};
const refreshTweetCb = () => {
  const list = data.value?.list || [];
  const tweetList = useWsTweet.popData('common');
  if (tweetList.length) {
    list.unshift(...tweetList);
  }
};

import { useWsTweetStore } from '@/stores/wsTweet';
const useWsTweet = useWsTweetStore();
onMounted(() => {
  mitt.on('submit-tweet', cb);
  mitt.on('edit-tweet', editCb);
  mitt.on('refresh-tweet-list', refreshTweetCb);
  subscribeTimelineCommon((event: string, tweet: any) => {
    const list = data.value?.list || [];
    if (event === 'delete') {
      const index = list.findIndex((item: any) => item.id === tweet);

      if (index >= 0) {
        list.splice(index, 1);
      }

      return;
    }

    useWsTweet.addData(tweet, 'common');

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
  mitt.off('submit-tweet', cb);
  mitt.off('edit-tweet', editCb);
  mitt.off('refresh-tweet-list', refreshTweetCb);
});

onDeactivated(() => {
  useScroll().setScrollCache('public-common');
});

onActivated(() => {
  const scrollTop = useScroll().getScrollCache('public-common');
  nextTick(() => {
    useScroll().toScroll(scrollTop);
  });
});

const tweetMessageRef = ref(null);
const onRefresh = async () => {
  pullLoading.value = true;

  if (!maxId.value) {
    maxId.value = '';
    refresh();
    return;
  }

  maxId.value = '';
};

const router = useRouter();
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
  <div class="pages">
    <PageHeader> {{ t('timeline.public') }} </PageHeader>
    <nav class="tab-nav" ref="homeNav">
      <nuxt-link class="nav-item" v-for="item in tabList" :key="item.path" :class="{ active: item.path === '/public/common' }" :to="item.path">
        <div class="item-text">
          {{ item.name }}
        </div>
      </nuxt-link>
    </nav>
    <div class="content">
      <van-pull-refresh v-model="pullLoading" @refresh="onRefresh" head-height="75">
        <TweetMessages ref="tweetMessageRef" viewKey="local" :tweetList="tweetList" :loading="loading" @load="getList" :finished="finished"></TweetMessages>
        <nuxt-link :to="nextPageHref" class="nuxt-link-2">{{ t('public.nextPage') }}</nuxt-link>
        <template #loading>
          <loadingIcon></loadingIcon>
        </template>
      </van-pull-refresh>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nuxt-link-2 {
  display: none;
}
.pages {
  display: flex;
  flex-direction: column;
  height: 100%;
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
  .header {
    display: none;
  }
}
</style>
