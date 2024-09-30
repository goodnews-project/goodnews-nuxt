<script setup>
const { t } = useI18n();
definePageMeta({
  layout: 'settings',
  name: 'settings-emailDomainBlocks',
  middleware: ['auth'],
});
import { Message } from '@arco-design/web-vue';
import { getEmailDomainBlocksList, deleteEmailDomainBlocks } from '@/api/admin/emailDomainBlocks';

const router = useRouter();
const handleAdd = () => {
  router.push('/settings/emailDomainBlocks/new');
};

const pageLoading = ref(false);
const emailDomainBlocksList = ref([]);
const getEmailDomainBlocksListAsync = async () => {
  try {
    pageLoading.value = true;
    const res = await getEmailDomainBlocksList();
    emailDomainBlocksList.value = res.data || [];
  } finally {
    pageLoading.value = false;
  }
};
getEmailDomainBlocksListAsync();

const deleteEmailDomainBlocksAsync = async () => {
  try {
    pageLoading.value = true;
    const id = selectedRowKeys.value.join(',');
    console.log('id :>> ', id);
    if (!id) {
      Message.warning(t('public.pleaseCheckData'));
      return;
    }
    await deleteEmailDomainBlocks(id);
    getEmailDomainBlocksListAsync();
    Message.success(t('common.deleteSuccess'));
  } finally {
    pageLoading.value = false;
  }
};

const rowKey = 'id';
const rowSelection = ref({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
});

const selectedRowKeys = ref([]);

const columns = ref([
  {
    title: t('public.domain'),
    dataIndex: 'domain',
    render: ({ record: row }) => {
      return [h('div', { style: 'display:flex;justify-content:flex-start;align-items: center;' }, row.domain)];
    },
  },
]);
</script>
<template>
  <div class="email-bomain-blocks">
    <div class="header">
      <h2>{{ t('admin.emailDomain.title') }}</h2>
      <a-button type="primary" @click="handleAdd">{{ t('admin.emailDomain.add') }}</a-button>
    </div>
    <div class="table-wrapper">
      <div class="delete">
        <a-button type="primary" @click="deleteEmailDomainBlocksAsync" size="small">{{ t('common.delete') }}</a-button>
      </div>

      <a-table
        :scroll-x="700"
        :loading="pageLoading"
        :columns="columns"
        :data="emailDomainBlocksList"
        :row-key="rowKey"
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
