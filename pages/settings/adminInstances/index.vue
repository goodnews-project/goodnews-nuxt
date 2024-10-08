<script setup>
definePageMeta({
  layout: 'settings',
  name: 'settings-adminInstances',
  middleware: ['auth'],
});
const { t } = useI18n();

const rowKey = 'user_id';

const statusOptions = ref([
  {
    label: t('public.all'),
    value: 0,
  },
  {
    label: t('public.limited'),
    value: 1,
  },
]);

const positionOptions = ref([
  {
    label: t('public.all'),
    value: 0,
  },
  {
    label: t('public.sendFailed'),
    value: 1,
  },
  {
    label: t('public.unavailable'),
    value: 2,
  },
]);

const operateType = ref(1);
const usabilityType = ref(0);
const domainName = ref('');

const columns = ref([
  {
    title: t('public.domain'),
    dataIndex: 'domain',
  },
  {
    title: t('admin.instances.statistics'),
    dataIndex: 'status_count',
  },
]);

const handleSearch = () => {
  getUserListAsync();
};

const handleReset = () => {
  usabilityType.value = 0;
  operateType.value = 1;
};

const tableData = ref([]);
const tableLoading = ref(false);
const pageIndex = ref(1);
const pageSize = ref(20);
const totalCount = ref(0);
const handlePageChange = (page) => {
  pageIndex.value = page;
  getUserListAsync();
};
import { getInstanceList } from '@/api/admin/instance';
const getUserListAsync = async () => {
  tableLoading.value = true;
  const params = {
    page: pageIndex.value,
  };
  try {
    const res = await getInstanceList(params);
    tableData.value = res?.data || [];
    totalCount.value = res?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    tableLoading.value = false;
  }
};
getUserListAsync();

const router = useRouter();
const tableRowProps = (val) => {
  router.push(`/settings/adminInstances/detail/${val.domain}`);
};

const windowWidth = ref(window.innerWidth);
const updateWidth = () => {
  windowWidth.value = window.innerWidth;
};
onMounted(() => {
  window.addEventListener('resize', updateWidth);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWidth);
});
</script>

<template>
  <div class="admin-accounts">
    <div class="table-wrapper">
      <a-table :scroll-x="700" :loading="tableLoading" :columns="columns" :data="tableData" :row-key="rowKey" @row-click="tableRowProps" :pagination="false" />
      <a-pagination
        :page-slot="windowWidth > 768 ? 8 : windowWidth > 480 ? 6 : 4"
        class=""
        v-model:current="pageIndex"
        v-model:page-size="pageSize"
        :total="totalCount"
        show-total
        @change="handlePageChange"
      >
        <template #prefix="{ itemCount }"> {{ $t('admin.instances.total', { total: itemCount }) }} </template>
      </a-pagination>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-accounts {
  padding: 55px 25px 50px 25px;
}

.table-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;

  :deep(.arco-table) {
    width: 100%;
  }
}
</style>
