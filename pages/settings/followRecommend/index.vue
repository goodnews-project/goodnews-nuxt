<script setup>
import { Message } from '@arco-design/web-vue';
const router = useRouter();
const pageLoading = ref(false);
const dataList = ref([]);
const { t } = useI18n();
const btnLoading = ref(false);

definePageMeta({
  layout: 'settings',
  name: 'settings-followRecommend',
  middleware: ['auth'],
});

const rowSelection = ref({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
});

const selectedRowKeys = ref([]);
import UserItem from '@/components/User/UserItem.vue';
import { statusMap } from './config';
const columns = ref([
  {
    title: t('public.status'),
    dataIndex: 'status',
    render: ({ record: row }) => {
      return h('div', {}, t(statusMap[row.status]));
    },
  },
  {
    title: t('common.user'),
    dataIndex: 'account',
    render: ({ record: row }) => {
      return h(UserItem, { data: row.account, isShowFollow: false });
    },
  },
]);

import { getDataList, bannedRecommend } from '@/api/admin/followRecommend';
import { languageList as langList } from './config';
const languageList = langList.map((item) => ({ label: t(item.label), value: item.value }));
const languageOptions = [{ label: t('public.all'), value: '' }, ...languageList];
const filterValue = ref({
  language: '',
  status: '1',
});
import { h, watchEffect } from 'vue';
const fetchData = async () => {
  const params = {
    ...filterValue.value,
  };
  pageLoading.value = true;
  const data = await getDataList(params).finally(() => {
    pageLoading.value = false;
  });
  dataList.value = data || [];
  return Promise.resolve();
};
watchEffect(() => {
  selectedRowKeys.value = [];
  fetchData();
});
const arcoTable = ref(null);
const handleFollow = async () => {
  console.log('arcoTable', arcoTable.value);
  return;
  if (selectedRowKeys.value.length === 0) {
    Message.warning(t('public.pleaseCheckData'));
    return;
  }
  const params = {
    account_ids: selectedRowKeys.value,
    status: filterValue.value.status === '1' ? '2' : '1',
    language: filterValue.value.language,
  };
  btnLoading.value = true;
  await bannedRecommend(params).finally(() => {
    btnLoading.value = false;
  });
  selectedRowKeys.value = [];
  fetchData();
};
</script>

<template>
  <div class="pages">
    <PageHeader :showArrow="false"> {{ t('admin.followRecommend.title') }} </PageHeader>
    <div class="desc">
      <strong> {{ t('admin.followRecommend.followRecommendDesc') }}</strong>
      {{ t('admin.followRecommend.recommendDesc') }}
    </div>
    <div class="main">
      <a-form :model="filterValue" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="value1" :label="t('public.selectLanguage')" label-col-flex="100px">
              <a-select v-model="filterValue.language" :style="{ width: '320px' }" placeholder="Please select ...">
                <a-option v-for="item in languageOptions" :key="item.value" :value="item.value">{{ item.label }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="value1" :label="t('public.tweet')" label-col-flex="100px">
              <a-radio-group v-model="filterValue.status">
                <a-radio value="1">{{ t('public.active') }}</a-radio>
                <a-radio value="2">{{ t('common.already') }}{{ t('public.disable') }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-wrapper">
      <div class="delete">
        <a-button
          type="primary"
          size="small"
          v-if="filterValue.status === '1'"
          @click="handleFollow"
          :loading="btnLoading"
          :disabled="selectedRowKeys.length === 0"
        >
          {{ t('public.disable') }}{{ t('admin.followRecommend.title') }}
        </a-button>
        <a-button
          type="primary"
          size="small"
          v-if="filterValue.status === '2'"
          @click="handleFollow"
          :loading="btnLoading"
          :disabled="selectedRowKeys.length === 0"
        >
          {{ t('public.enabled') }}{{ t('admin.followRecommend.title') }}
        </a-button>
      </div>
      <a-table
        ref="arcoTable"
        :scroll-x="700"
        :loading="pageLoading"
        :columns="columns"
        :data="dataList"
        row-key="account_id"
        :row-selection="rowSelection"
        v-model:selectedKeys="selectedRowKeys"
        :pagination="false"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pages {
  padding: 55px 25px;
  .header {
    padding: 0;
  }
  .desc {
    font-size: 17px;
    line-height: 22px;
  }
  .main {
    margin-top: 40px;
  }
}
.table-wrapper {
  position: relative;
  .delete {
    position: absolute;
    top: 6px;
    right: 10px;
    z-index: 99;
  }
}
</style>
