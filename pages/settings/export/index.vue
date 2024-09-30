<script setup lang="ts">
import { Button } from '@arco-design/web-vue';
import { Icon } from '#components';
import { getExportsList, requestData } from '@/api/setting/export';
import { h } from 'vue';
const { t } = useI18n();

definePageMeta({
  layout: 'settings',
  name: 'settings-export',
  middleware: ['auth'],
});

useHead({
  title: `${t('admin.importExport.export')}${t('admin.importExport.data')}`,
});

const pageLoading = ref(false);
const dataList = ref([]);
const showBtn = ref(false);
const getListData = async () => {
  pageLoading.value = true;
  const data = await getExportsList().finally(() => {
    pageLoading.value = false;
  });
  showBtn.value = data.showRequestBtn;
  dataList.value = data.statistics;
  exportData.value = data.exports;
  return Promise.resolve();
};
getListData();

const requestLoading = ref(false);
const submitRequest = async () => {
  requestLoading.value = true;
  await requestData().finally(() => {
    requestLoading.value = false;
  });
  getListData();
};

const selectedRowKeys = ref([]);

import { formatFileSize } from '@/utils';
import { manualFetch } from '~/api/base';
const columns = ref([
  {
    title: '',
    dataIndex: 'name',
  },
  {
    dataIndex: 'stat',
    render: ({ record }: any) => {
      if (record.is_file_stat) {
        return h('div', formatFileSize(record.stat, 'b'));
      } else {
        return record.stat;
      }
    },
  },
  {
    dataIndex: 'link',
    render: ({ record }) => {
      if (record.link) {
        return h(
          Button,
          {
            style: 'display: flex; align-items: center; gap: 4px; --primary-6: var(--gray-8)',
            type: 'text',
            onClick: async () => {
              const downloadUrl = record.link;
              const res = await manualFetch(downloadUrl, {
                method: 'get',
                responseType: 'blob',
              });
              const blob = new Blob([res], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              const fileName = record.link.split('/').pop();
              a.download = `${fileName}`;
              a.click();
            },
          },
          [h(Icon, { name: 'ph:download-fill' }), h('span', 'CSV')]
        );
      }
    },
  },
]);

const exportColumns = ref([
  { title: t('public.date'), dataIndex: 'created_at' },
  {
    title: t('public.size'),
    dataIndex: 'filesize',
    render: ({ record }: any) => {
      if (record.filesize) {
        return h('div', formatFileSize(record.filesize, 'b'));
      } else {
        return t('admin.importExport.preparingYourArchive');
      }
    },
  },
  {
    title: '',
    dataIndex: '',
    render: ({ record }) => {
      if (record.filesize) {
        return h(
          Button,
          {
            style: 'display: flex; align-items: center; gap: 4px; --primary-6: var(--gray-8)',
            type: 'text',
            onClick: async () => {
              const baseUrl = ((import.meta as any).env as any).VITE_BASE_API;
              const id = record.id;
              const fileUrl = `${baseUrl}/_api/admin/backups/${id}/download`;
              const a = document.createElement('a');
              a.href = fileUrl;
              a.click();
            },
          },
          [h(Icon, { name: 'ph:download-fill' }), h('span', t('admin.importExport.downloadYourArchive'))]
        );
      } else {
      }
    },
  },
]);
const exportData = ref([]);
</script>

<template>
  <div class="email-bomain-blocks">
    <PageHeader :showArrow="false">{{ t('admin.importExport.export') }}</PageHeader>
    <div class="table-wrapper">
      <a-table :scroll-x="700" :loading="pageLoading" :columns="columns" :data="dataList" row-key="id" :pagination="false" :show-header="false" />
      <div class="desc">
        {{ t('admin.importExport.youCanRequestAnAccountDataArchive') }}
      </div>
      <div>
        <a-button v-if="showBtn" type="primary" @click="submitRequest" :loading="requestLoading"> {{ t('admin.importExport.requestYourArchive') }} </a-button>
      </div>

      <a-table :columns="exportColumns" :data="exportData" :loading="pageLoading" :pagination="false"></a-table>
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
    display: flex;
    flex-direction: column;
    gap: 20px;
    .desc {
      margin-top: 40px;
    }
  }
}
</style>
