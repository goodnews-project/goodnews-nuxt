<template>
  <RealList @reach-bottom="getListData" :scrollbar="scrollbar" class="hashtag-list">
    <div v-for="hash in dataList" :key="hash.id" class="hashtag-item px-5 py-4 cursor-pointer hover:bg-light-primary/10">
      <NuxtLink class="hashtag-item-text" :to="`/explore/hashtag/${hash.name}`" v-if="hash.name"> #{{ hash.name }} </NuxtLink>
      <div class="hashtag-item-text" v-else @click="goTabsBlank">#{{ hash.name }}</div>
    </div>
  </RealList>
</template>
<script setup>
import { ref } from 'vue';
import { getHashTagData } from '@/api/search';
const dataList = ref([]);
const scrollbar = ref(true);
const route = useRoute();
const currentPage = ref(0);
const { t } = useI18n();
const getListData = async () => {
  currentPage.value++;
  const params = {
    q: route.query.q,
    type: 'hashtags',
    page: currentPage.value,
  };
  const { data, total } = await getHashTagData(params);
  dataList.value.push(...data);
  if (dataList.value.length >= total) scrollbar.value = false;
};

import { Message } from '@arco-design/web-vue';
const goTabsBlank = () => {
  Message.error(t('explore.hashtagNotFound'));
};
</script>
<style lang="scss" scoped>
.hashtag-list {
  .hashtag-item {
    padding: 14px;
    cursor: pointer;
    &:hover {
      background: var(--color-neutral-2);
      .hashtag-item-text {
        text-decoration: underline;
      }
    }
    .hashtag-item-text {
      display: flex;
      font-weight: bold;
    }
  }
}
</style>
