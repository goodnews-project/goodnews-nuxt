<script setup>
import loadingIcon from '~/components/loadingIcon/index.vue';
import { removeAllBookmark } from '@/api/bookmarks/index.js';
import { manualFetch } from '~/api/base';
const { t } = useI18n();
useHead({
  title: t('bookmark.head'),
  meta: [
    {
      name: 'description',
      content: t('bookmark.head'),
    },
  ],
});
definePageMeta({
  name: 'bookmarks',
});
defineOptions({ name: 'bookmarks' });

const handleCommand = (key) => {
  if (key === 'removeAll') {
    removeAll();
  }
};

const removeAll = async () => {
  await removeAllBookmark();
  refresh();
};

const pullLoading = ref(false);

const { data, loading, refresh, maxId, finished } = await useList('bookmarks', async ({ max_id }) => {
  const res = await manualFetch('/_api/v1/bookmarks', {
    params: !!max_id ? { max_id, limit: 30 } : { limit: 30 },
  });
  pullLoading.value = false;
  return res;
});

const tweetList = computed(() => {
  return data.value?.list || [];
});

const getList = () => {
  if (tweetList.value.length > 0) {
    maxId.value = tweetList.value[tweetList.value.length - 1]?.id || '';
  }
};
const tweetUpdate = (e) => {
  const result = data.value.list || [];
  const index = result.findIndex((item) => item.status.id === e.id);
  result.splice(index, 1);
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

const router = useRouter();
const route = useRoute();
const nextPageHref = computed(() => {
  const routes = router.getRoutes();
  const currentIndex = routes.find((r) => r.path === route.path);
  return currentIndex?.path + '?max_id=' + tweetList.value[tweetList.value.length - 1]?.id;
});
watchEffect(() => {
  if (route.query.max_id) {
    maxId.value = route.query.max_id || '';
  }
});
</script>

<template>
  <div>
    <div class="page">
      <PageHeader>
        {{ $t('bookmark.title') }}
        <template #right>
          <a-dropdown trigger="click" @select="handleCommand">
            <a-button type="text" shape="circle" class="dropdown-btn">
              <nuxt-icon name="gengduo"></nuxt-icon>
            </a-button>
            <template #content>
              <a-doption value="removeAll">
                {{ $t('bookmark.clearAllBookmarks') }}
              </a-doption>
            </template>
          </a-dropdown>
        </template>
      </PageHeader>
      <div class="content">
        <van-pull-refresh v-model="pullLoading" @refresh="onRefresh" head-height="75">
          <RealList @reach-bottom="getList" :scrollbar="!finished" class="hashtag-list" :showFooter="false" :loading="loading">
            <TweetMessage class="tweet-item" v-for="tweet in tweetList" :status="tweet.status" @reTweet="tweetUpdate" :key="tweet.id"> </TweetMessage>
          </RealList>
          <nuxt-link :to="nextPageHref" class="nuxt-link-2">{{ t('public.nextPage') }}</nuxt-link>
          <template #loading>
            <loadingIcon></loadingIcon>
          </template>
        </van-pull-refresh>
        <div v-show="!tweetList?.length && !loading" class="bookmarks-null-list">
          <div class="title">{{ $t('bookmark.savePostsForLater') }}</div>
          <div class="subtitle">{{ $t('bookmark.addPostsFindAgain') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.nuxt-link-2 {
  display: none;
}
.dropdown-btn {
  @extend %dropdown-color;
}

.content {
  .bookmarks-null-list {
    display: flex;
    padding: 12px;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    padding-top: 60px;

    .title {
      font-size: 31px;
      line-height: 36px;
      font-weight: 800;
      margin-bottom: 10px;
      color: rgb(var(--gray-7));
    }

    .subtitle {
      font-size: 15px;
      line-height: 20px;
      font-weight: 400;
      color: rgb(var(--gray-8));
    }
  }
}
</style>
