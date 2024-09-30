<script setup>
import { getTweetFilters, createTweetFilters, filterTweets } from '~/api/filterModal';
const props = defineProps({
  status: {
    type: Object,
    default: () => ({}),
  },
});
const emits = defineEmits(['success']);
const dayjs = useDayjs();
const { t } = useI18n();
// 搜索条件
const searchVal = ref('');
// 弹窗关闭
const handleCancel = () => (showFilterModal.value = false);
const showFilterModal = inject('showFilterModal', ref(false));
const { data: filterList } = getTweetFilters();
// 过滤器列表搜索
const searchFilterList = computed(() => {
  return filterList.value.filter((item) => item.title.includes(searchVal.value));
});

// 是否已过滤
const isFiltered = ref(false);

// 过滤中
const filterLoading = ref(false);
// 过滤推文
const handleFilter = async (item) => {
  try {
    filterLoading.value = true;
    await filterTweets({ filter_id: item.id }, props.status.id);
    useMessage().success(t('tweet.filter.success'));
    searchVal.value = item.title;
    isFiltered.value = true;
    emits('success', item);
  } catch (err) {
  } finally {
    filterLoading.value = false;
  }
};
// 创建过滤器
const handleCreateFilter = async (filterVal) => {
  try {
    filterLoading.value = true;
    const filterId = await createTweetFilters({ title: filterVal });
    await filterTweets({ filter_id: filterId }, props.status.id);
    useMessage().success(t('tweet.filter.success'));
    isFiltered.value = true;
    const tempData = {
      id: filterId,
      title: filterVal,
      expired_at: null,
      context: [1, 2, 3, 4, 5],
      act: 1,
      kw_attr: null,
      created_at: dayjs(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
      updated_at: dayjs(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
      expires_in: 0,
      status_count: 0,
      expired_at_fmt: '\u6c38\u4e0d\u8fc7\u671f',
      context_fmt: [
        {
          context: 1,
          context_name: '\u4e3b\u9875\u65f6\u95f4\u8f74',
        },
        {
          context: 2,
          context_name: '\u901a\u77e5',
        },
        {
          context: 3,
          context_name: '\u516c\u5171\u65f6\u95f4\u8f74',
        },
        {
          context: 4,
          context_name: '\u5bf9\u8bdd',
        },
        {
          context: 5,
          context_name: '\u4e2a\u4eba\u8d44\u6599',
        },
      ],
      context_enum: ['home', 'notifications', 'public', 'thread', 'account'],
    };
    emits('success', tempData);
  } catch (err) {
  } finally {
    filterLoading.value = false;
  }
};
</script>

<template>
  <ClientOnlyAModal v-model:visible="showFilterModal" @cancel="handleCancel" :footer="false">
    <template #title> {{ t('tweet.filter.filterOne') }} </template>
    <a-spin class="content" :loading="filterLoading">
      <template v-if="!isFiltered">
        <div class="title">{{ t('tweet.filterPost') }}</div>
        <div class="subtitle">{{ t('tweet.filter.useExistFilter') }}</div>
        <div class="search">
          <a-input-search v-model="searchVal" :placeholder="t('tweet.filter.searchOrCreateFilter')"> </a-input-search>
        </div>
        <div class="list" v-if="!searchVal">
          <div class="item" v-for="item in filterList" :key="item.id" @click="handleFilter(item)">{{ item.title }}</div>
        </div>
        <div class="list list2" v-if="searchVal">
          <div class="item" v-for="item in searchFilterList" :key="item.id" @click="handleFilter(item)">
            {{ item.title }}
          </div>
          <div class="item" @click="handleCreateFilter(searchVal)">+ {{ t('tweet.filter.newFilter') }} {{ searchVal }}</div>
        </div>
      </template>
      <template v-else>
        <div class="title">{{ t('tweet.filter.filterAdded') }}</div>
        <div class="subtitle">{{ t('tweet.filter.thisTweetAdded', { filterName: searchVal }) }}</div>
        <a-button class="success-btn" type="primary" @click="handleCancel" long>{{ t('common.complete') }}</a-button>
      </template>
    </a-spin>
  </ClientOnlyAModal>
</template>

<style scoped lang="scss">
.content {
  height: 320px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  .success-btn {
    margin-top: auto;
  }
}
.title {
  font-size: 20px;
}
.subtitle {
  font-size: 16px;
  margin-top: 10px;
}
.search {
  margin-top: 10px;
}
.list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 10px;
  padding-bottom: 10px;
  .item {
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 5px;
    &:hover {
      background-color: #f0f0f0;
    }
  }
}
</style>
