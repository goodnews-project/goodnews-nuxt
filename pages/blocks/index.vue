<script setup>
import { getBlockList, unBlockUser } from '@/api/account/index.js';
const { t } = useI18n();
const dataList = ref([]);
const loading = ref(false);
const currentPage = ref(0);
const scrollbar = ref(true);
const getData = async () => {
  if (loading.value) return;
  loading.value = true;
  currentPage.value++;
  const params = {
    page: currentPage.value,
  };
  const { data } = await getBlockList(params).finally(() => {
    loading.value = false;
  });
  const newList = Array.from(data.value.data).map((item) => {
    return {
      ...item,
      _btnLoading: false,
    };
  });
  dataList.value.push(...newList);
  if (dataList.value.length >= Array.from(data.value.data)) scrollbar.value = false;
};
getData();
const delData = async (item) => {
  item._btnLoading = true;
  await unBlockUser(item.target_account_id).finally(() => {
    item._btnLoading = false;
  });
  dataList.value = dataList.value.filter((i) => i.target_account_id !== item.target_account_id);
};
</script>

<template>
  <div class="pages">
    <PageHeader>{{ t('login.blockedUser') }}</PageHeader>
    <div class="content">
      <RealList @reachBottom="getData" :scrollbar="scrollbar" :loading="loading">
        <div v-for="item in dataList" class="item">
          <UserCard :account="item.target_account">
            <div class="user-info">
              <div class="user-avatar">
                <Avatar :account="item.target_account"></Avatar>
              </div>
              <div class="flex items-center">
                <p class="user-name" @click="goRouter(item)">
                  {{ item.target_account?.display_name || item.target_account?.username }}
                </p>
                <p class="user-acct" @click="goRouter(item)">@{{ item.target_account?.acct }}</p>
              </div>
            </div>
          </UserCard>

          <div class="button-group">
            <a-button type="primary" :loading="item._btnLoading" @click="delData(item)"> {{ t('account.removeBlacklist') }} </a-button>
          </div>
        </div>
      </RealList>
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
      display: flex;
      flex-direction: column;
      gap: 10px;
      .item {
        display: flex;
        width: 100%;
        border-bottom: 1px solid var(--color-neutral-3);
        padding: 10px;
        align-items: center;
        gap: 6px;
        .user-info {
          cursor: pointer;
          display: flex;
          gap: 10px;
          .user-name {
            font-weight: bold;
          }
          .user-acct {
            color: var(--color-text-2);
          }
        }
        .button-group {
          margin-left: auto;
        }
      }
    }
  }
}
</style>
