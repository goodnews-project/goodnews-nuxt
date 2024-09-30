<script setup>
import { getList, enable, disable, del } from '@/api/admin/relay';
const { t } = useI18n();
definePageMeta({
  layout: 'settings',
  name: 'settings-relayStation',
  middleware: ['auth'],
});

const pageLoading = ref(false);
const dataList = ref([]);
const fetchData = async () => {
  pageLoading.value = true;
  const data = await getList().finally(() => {
    pageLoading.value = false;
  });
  dataList.value = data || [];
  return Promise.resolve();
};
watchEffect(() => {
  fetchData();
});

const columns = ref([
  {
    title: t('admin.relay.relayUrl'),
    dataIndex: 'inbox_url',
  },
  {
    title: t('public.status'),
    dataIndex: 'state',
    render: ({ record: row }) => {
      const map = {
        0: t('admin.already') + t('public.disabled'),
        1: t('admin.relay.waitingRelayConfirm'),
        2: t('admin.already') + t('public.enabled'),
        3: t('admin.relay.rejectedAdd'),
      };
      return h('div', {}, map[row.state]);
    },
  },
  {
    title: t('common.operation'),
    dataIndex: 'operation',
    slotName: 'operation',
  },
]);

const toggleState = async (item, state) => {
  if (state) {
    await enable(item.id);
  } else {
    await disable(item.id);
  }
  // 重新请求数据
  fetchData();
};

const deleteData = async (item) => {
  await del(item.id);
  fetchData();
};
const router = useRouter();
</script>

<template>
  <div class="pages">
    <PageHeader :showArrow="false"> {{ t('admin.relay.title') }} </PageHeader>
    <div class="desc">
      {{ t('admin.relay.relayDesc') }}
    </div>
    <div class="main">
      <a-button long type="primary" @click="router.push('/settings/relayStation/new')">{{ t('admin.relay.subscribeNewRelay') }}</a-button>
      <div class="list">
        <a-table ref="arcoTable" :scroll-x="700" :loading="pageLoading" :columns="columns" :data="dataList" row-key="account_id" :pagination="false">
          <template #operation="{ record }">
            <template v-if="record.state === 2">
              <a-link size="small" @click="toggleState(record, false)">{{ t('public.disabled') }}</a-link>
            </template>
            <template v-else-if="record.state === 0">
              <a-link size="small" @click="toggleState(record, true)">{{ t('public.enabled') }}</a-link>
            </template>
            <a-popconfirm :content="t('admin.relay.deleteRelay')" type="warning" @ok="deleteData(record)">
              <a-link size="small">{{ t('common.delete') }}</a-link>
            </a-popconfirm>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
    .list {
      margin-top: 20px;
    }
  }
}
</style>
