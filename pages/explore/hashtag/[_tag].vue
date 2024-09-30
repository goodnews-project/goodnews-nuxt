<script setup>
const { t } = useI18n();
const route = useRoute();
const keyword = ref(route.params?._tag);
import queryString from '@/utils/function/queryString';
const tweetList = ref([]);
const tweetLoading = ref(false);
const tweetFinished = ref(false);
useHead({
  title: `${keyword.value} ${t('search.hashtags')}`,
  meta: [
    {
      name: 'description',
      content: `${keyword.value} ${t('search.hashtags')}`,
    },
  ],
});
const getListData = async (params) => {
  tweetLoading.value = true;
  const qs = queryString(params);
  const { data: res } = await useMyFetch(`/_api/v1/explore/${keyword.value}${qs}`);
  tweetLoading.value = false;
  tweetList.value.push(...res.value.data);
  if (tweetList.value.length >= res.value.total) {
    tweetFinished.value = true;
  }
};

const getList = (params) => {
  getListData(params);
};
</script>

<template>
  <div class="pages">
    <PageHeader>#{{ keyword }}</PageHeader>
    <div class="content">
      <TweetMessages viewKey="hashtag" :tweetList="tweetList" :loading="tweetLoading" @load="getList" :finished="tweetFinished"></TweetMessages>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pages {
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
    .list {
      .item {
        padding: 10px;
        align-items: center;
        gap: 6px;
      }
    }
  }
}
</style>
