<script setup>
const { t } = useI18n();
import { getNsqInfo } from '@/api/setting/nsq';
import { computed, ref } from 'vue';
useHead({
  title: t('admin.nsq.title'),
});

definePageMeta({
  layout: 'settings',
  name: 'settings-nsq',
  middleware: ['auth'],
});

const loading = ref(false);
const nsqData = await getNsqInfo().finally(() => {
  loading.value = false;
});
const panelData = computed(() => {
  const result = [
    { label: t('admin.nsq.currentStatus'), value: nsqData?.health },
    { label: t('admin.nsq.waitingNumber'), value: tableData.value.reduce((prev, cur) => prev + cur.depth, 0) },
    { label: t('admin.nsq.consumerNumber'), value: tableData.value.reduce((prev, cur) => prev + cur.in_flight_count, 0) },
    { label: t('admin.nsq.completeNumber'), value: tableData.value.reduce((prev, cur) => prev + cur.totalCount, 0) },
  ];
  return result;
});
const tableData = computed(() => {
  const result = nsqData?.topics.map((item) => {
    item.children = item.channels;
    return item;
  });
  const calcDepth = (data) => {
    data.forEach((item) => {
      if (item.children) {
        item.in_flight_count = item.children.reduce((prev, cur) => prev + cur.in_flight_count, 0);
        item.totalCount = item.children.reduce((prev, cur) => prev + cur.in_flight_count + cur.message_count, 0);
        item.requeue_count = item.children.reduce((prev, cur) => prev + cur.requeue_count, 0);
        calcDepth(item.children);
      }
    });
  };
  calcDepth(result);
  return result;
});
const columns = [
  { title: t('admin.nsq.queueName'), dataIndex: 'topic_name', width: '180' },
  { title: t('admin.nsq.channel'), dataIndex: 'channel_name', width: '180' },
  { title: t('admin.nsq.waitingNumber'), dataIndex: 'depth', width: '100' },
  { title: t('admin.nsq.consumingNumber'), dataIndex: 'in_flight_count', width: '100' },
  { title: t('admin.nsq.completeNumber'), dataIndex: 'message_count', width: '90' },
  { title: t('admin.nsq.requeueNumber'), dataIndex: 'requeue_count', width: '100' },
];
</script>

<template>
  <div class="pages">
    <a-spin :loading="loading">
      <pageHeader :showArrow="false">{{ $t('admin.nsq.title') }}</pageHeader>
      <div class="panel-list">
        <div class="panel-item" v-for="item in panelData">
          <div class="label">{{ item.label }}</div>
          <div class="value">{{ item.value }}</div>
        </div>
      </div>

      <a-table class="table-box" :columns="columns" :data="tableData" row-key="topic_name" :pagination="false"> </a-table>
    </a-spin>
  </div>
</template>

<style scoped lang="scss">
.pages {
  padding: 20px;
  .header {
    padding-left: 0;
  }
}
.arco-spin {
  width: 100%;
}

.panel-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  .panel-item {
    flex: 1;
    min-width: 120px;
    --bg-option: 0.1;
    padding: 20px;
    border-radius: 8px;
    background-color: rgba(204, 215, 224, var(--bg-option));
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    .label {
      font-size: 16px;
      color: var(--gray-8);
    }
    .value {
      font-size: 24px;
      font-weight: 700;
      margin-top: 8px;
    }
    &:hover {
      --bg-option: 0.3;
    }
  }
}
.table-box {
  margin-top: 60px;
}
</style>
