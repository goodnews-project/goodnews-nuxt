<script setup>
const router = useRouter();
const showTrigger = ref(false);
const { t } = useI18n();
import { Message } from '@arco-design/web-vue';
const keyword = ref('');
const search = () => {
  if (!keyword.value) {
    Message.warning(t('search.searchContentNotNull'));
    return;
  }
  goSearchLink();
};
const goSearchLink = (type) => {
  addHistory(type);
  if (type) {
    router.push(`/search/${type}?q=${keyword.value}`);
  } else {
    router.push(`/search/status?q=${keyword.value}`);
  }
  showTrigger.value = false;
};

const addHistory = (type) => {
  const data = {
    label: keyword.value,
    type: type || '',
  };
  // 追加搜索记录
  searchStore.searchHistory(data);
};

const removeHistory = (index) => {
  searchStore.removeHistory(index);
};
const removeAll = () => {
  searchStore.removeAll();
};

const renderType = (type) => {
  return {
    status: t('public.tweet'),
    hashtag: 'hashtag',
    account: t('public.account'),
  }[type];
};

const goHistory = (item) => {
  if (item.type) {
    router.push(`/search/${item.type}?q=${item.label}`);
  } else {
    router.push(`/search/status?q=${item.label}`);
  }
};
const searchTypeList = [
  { label: t('search.match') + ' ${title} ' + t('search.tweets'), value: 'status' },
  { label: t('search.match') + ' ${title} ' + t('search.hashtags'), value: 'hashtag' },
  { label: t('search.match') + ' ${title} ' + t('search.accounts'), value: 'account' },
];
const renderSearchList = (item) => {
  const list = item.label.split('${title}');
  list.splice(1, 0, keyword.value);
  return list
    .map((item) => {
      return item === keyword.value ? `<span style="color: rgb(var(--arcoblue-6))">${item}</span>` : item;
    })
    .join('');
};

import { useSearchStore } from '@/stores/searchHistory';
const searchStore = useSearchStore();
const historyList = ref(searchStore.history);
</script>

<template>
  <div class="searchInput">
    <a-trigger v-model:popup-visible="showTrigger" :trigger="`focus`" auto-fit-popup-width :blur-to-close="false" scroll-to-close>
      <a-input :placeholder="$t('common.search')" v-model="keyword" @keyup.enter="search">
        <template #suffix>
          <div class="icon-box" @click="search">
            <Icon name="material-symbols:search"></Icon>
          </div>
        </template>
      </a-input>
      <template #content>
        <div class="container">
          <template v-if="keyword">
            <div class="list">
              <div class="type">
                <div class="type-title">{{ t('search.quickAction') }}</div>
                <div class="item" v-for="item in searchTypeList" @click="goSearchLink(item.value)">
                  <div class="label" v-html="renderSearchList(item)"></div>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="list">
              <div class="type" v-if="historyList.length">
                <div class="type-title">
                  {{ t('common.recent') }}
                  <a-button size="mini" type="text" class="removeAll" @click="removeAll">{{ t('common.clearAll') }}</a-button>
                </div>
                <div class="item" v-for="(item, i) in historyList" @click="goHistory(item)">
                  <Icon class="search-icon" name="mingcute:search-2-fill" />
                  <div class="text-box">
                    <div class="label">{{ item?.label || item }}</div>
                    <a-tag class="type" v-if="item.type">{{ renderType(item.type) }}</a-tag>
                  </div>
                  <div class="remove-box" @click.stop="removeHistory(i)">
                    <Icon name="material-symbols:close-small-outline" />
                  </div>
                </div>
              </div>
              <div v-else style="height: 100px; text-align: center; padding-top: 20px">{{ t('search.trySearch') }}</div>
            </div>
          </template>
        </div>
      </template>
    </a-trigger>
  </div>
</template>

<style scoped lang="scss">
.searchInput {
  position: relative;
  margin: 10px 0;
}
.icon-box {
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  &:hover {
    color: var(--el-color-primary);
  }
}
.container {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  background-color: #fff;
  .list {
    .type {
      .type-title {
        padding: 10px;
        font-size: 14px;
        color: #999;
        display: flex;
        .removeAll {
          margin-left: auto;
        }
      }
      .item {
        padding: 10px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        gap: 10px;
        &:hover {
          background: #f5f5f5;
        }
        .search-icon {
          font-size: 18px;
        }
        .remove-box {
          --size: 36px;
          margin-left: auto;
          font-size: 20px;
          color: rgb(var(--arcoblue-6));
          cursor: pointer;
          width: var(--size);
          height: var(--size);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 100px;
          &:hover {
            background: rgb(var(--arcoblue-1));
          }
        }
      }
    }
  }
}
</style>
