<script setup>
import { Message } from '@arco-design/web-vue';
import { getIpRulesList, deleteIpRules } from '@/api/admin/ipRules';
import { ipRulesMap } from './config';
const { t } = useI18n();
definePageMeta({
  layout: 'settings',
  name: 'settings-ipRules',
  middleware: ['auth'],
});
const router = useRouter();
const handleAdd = () => {
  router.push('/settings/ipRules/add');
};

const pageLoading = ref(false);
const dataList = ref([]);
const getListData = async () => {
  pageLoading.value = true;
  const data = await getIpRulesList().finally(() => {
    pageLoading.value = false;
  });
  dataList.value = data || [];
  return Promise.resolve();
};
getListData();

const deleteLoading = ref(false);
const deleteData = async () => {
  if (!selectedRowKeys.value.length) {
    Message.warning(t('public.pleaseCheckData'));
    return;
  }
  deleteLoading.value = true;
  await deleteIpRules(selectedRowKeys.value).finally(() => {
    deleteLoading.value = false;
  });
  pageLoading.value = true;
  getListData().finally(() => {
    pageLoading.value = false;
  });
  Message.success(t('common.deleteSuccess'));
};

const rowSelection = ref({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
});

const selectedRowKeys = ref([]);

const columns = ref([
  {
    title: t('admin.ipRules.ip'),
    dataIndex: 'ip',
    render: ({ record: row }) => {
      return [h('div', row.ip), h('div', { style: 'font-size: 12px;color: var(--color-neutral-6)' }, t(ipRulesMap[row.severity]))];
    },
  },
]);
</script>

<template>
  <div class="email-bomain-blocks">
    <div class="header">
      <h2>{{ t('admin.ipRules.title') }}</h2>
      <a-button type="primary" @click="handleAdd">{{ t('admin.ipRules.newRule') }}</a-button>
    </div>
    <div class="table-wrapper">
      <div class="delete">
        <a-button type="primary" @click="deleteData" size="small" :loading="deleteLoading">{{ t('common.delete') }}</a-button>
      </div>

      <a-table
        :scroll-x="700"
        :loading="pageLoading"
        :columns="columns"
        :data="dataList"
        row-key="id"
        :row-selection="rowSelection"
        v-model:selectedKeys="selectedRowKeys"
        :pagination="false"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.email-bomain-blocks {
  padding: 55px 25px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  .header {
    margin-bottom: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
}
</style>
