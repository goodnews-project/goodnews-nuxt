<script setup>
import TweetMessages from '@/components/Tweet/TweetMessages.vue';
import HashtagList from '@/components/Explore/HashtagList/index.vue';
import UserList from '@/components/User/UserList.vue';
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
useHead({
  title: t('search.searchResults', { keyword: route.query?.q }),
  meta: [
    {
      name: 'description',
      content: t('search.searchResults', { keyword: route.query?.q }),
    },
  ],
});
import queryString from '@/utils/function/queryString';
import { computed } from 'vue';
const tweetList = ref([]);
const tweetLoading = ref(false);
const tweetFinished = ref(false);
const routeName = computed(() => {
  const map = {
    status: 'search-status',
    hashtag: 'search-hashtag',
    account: 'search-account',
  };
  return map[route.params._type];
});
const getTimeLine = async (params) => {
  tweetLoading.value = true;
  const query = {
    ...params,
    q: route.query?.q,
    type: 'statuses',
  };
  const qs = queryString(query);
  const { data } = await useMyFetch(`/_api/v1/search${qs}`);
  tweetLoading.value = false;
  tweetList.value.push(...data.value.data);
  if (tweetList.value.length >= data.value.total) {
    tweetFinished.value = true;
  }
};
const getList = (params) => {
  getTimeLine(params);
};

watch(
  () => route.query.q,
  () => {
    tweetList.value = [];
    tweetLoading.value = true;
    tweetFinished.value = false;
    getList({ page: 1 });
  }
);

const menuList = [
  {
    text: t('public.tweet'),
    toPath: (e) => `/search/status?q=${e}`,
    routerName: 'search-status',
  },
  {
    text: t('public.hashtag'),
    toPath: (e) => `/search/hashtag?q=${e}`,
    routerName: 'search-hashtag',
  },
  {
    text: t('public.account'),
    toPath: (e) => `/search/account?q=${e}`,
    routerName: 'search-account',
  },
];
</script>
<template>
  <div class="search-view">
    <PageHeader>{{ t('public.searchResults') }}</PageHeader>
    <section>
      <nav class="tabs">
        <router-link
          v-for="(item, i) in menuList"
          :key="i"
          class="router-link"
          :class="{ active: routeName === item.routerName }"
          :to="item.toPath(route.query?.q)"
          replace
        >
          <p class="router-link-text">{{ item.text }}</p>
        </router-link>
      </nav>
      <TweetMessages
        v-if="routeName == 'search-status'"
        viewKey="local"
        :tweetList="tweetList"
        :loading="tweetLoading"
        @load="getList"
        :finished="tweetFinished"
      ></TweetMessages>
      <HashtagList v-if="routeName == 'search-hashtag'"> </HashtagList>
      <UserList v-if="routeName == 'search-account'" :url="`/_api/v1/search?q=${route.query?.q}&type=accounts&resolve=true`"></UserList>
    </section>
  </div>
</template>

<style scoped lang="scss">
.search-view {
  .tabs {
    display: flex;
    justify-content: space-between;
    overflow-y: auto;
    height: 40px;
    border: 1px solid erd;
    border-bottom: 1px solid var(--color-neutral-3);
    height: 50px;
    &:hover {
      .router-link-text {
        color: var(--light-primary);
      }
    }
    .router-link {
      display: flex;
      flex: 1;
      justify-content: center;
      color: var(--color-neutral-8);
      font-weight: bold;
      align-items: center;
      transition: all 0.3s;
      &:hover {
        background: var(--color-neutral-3);
      }
      &.active {
        position: relative;
        &::before {
          content: ' ';
          display: block;
          width: 30px;
          height: 4px;
          border-radius: 10px;
          background: rgb(var(--arcoblue-6));
          position: absolute;
          bottom: 0;
        }
      }
    }
  }
}
</style>
