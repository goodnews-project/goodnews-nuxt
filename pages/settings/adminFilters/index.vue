<script setup lang="ts">
import { getFilters, delFilters } from '@/api/filters/index.js';
import { Message } from '@arco-design/web-vue';
const { t } = useI18n();
definePageMeta({
  layout: 'settings',
  name: 'settings-adminFilters',
  middleware: ['auth'],
});

useHead({
  title: t('filter.title'),
});

const router = useRouter();

const addFilters = () => {
  router.push('/settings/adminFilters/new');
};
const editFilters = (id: string) => {
  router.push({
    path: '/settings/adminFilters/edit',
    query: {
      id,
    },
  });
};

const delFiltersAsync = async (id: string, index: number) => {
  console.log('delFiltersAsync run');
  try {
    pageLoading.value = true;
    await delFilters(id);
    Message.success(t('common.deleteSuccess'));
    filtersList.value.splice(index, 1);
  } catch (err) {
  } finally {
    pageLoading.value = false;
  }
};

const pageLoading = ref(false);
const filtersList = ref<any[]>([]);
const getFiltersAsync = async () => {
  if (pageLoading.value) return;
  try {
    pageLoading.value = true;
    const res = await getFilters();
    console.log('getFiltersAsync res:', res);
    filtersList.value = res || [];
    filtersList.value.forEach((element) => {
      element.kw_attr = element.kw_attr ? element.kw_attr : [];
    });
  } catch (err) {
  } finally {
    pageLoading.value = false;
  }
};
getFiltersAsync();
</script>

<template>
  <div class="admin-roles">
    <div class="header">
      <h2>{{ $t('filter.filterList.filter') }}</h2>
      <a-button type="primary" @click="addFilters">{{ $t('filter.filterList.add') }}</a-button>
    </div>
    <a-spin :loading="pageLoading">
      <div class="filter-card">
        <a-card :title="item.title" v-for="(item, index) in filtersList" :key="item.id">
          <div class="area-list-item" v-show="item?.kw_attr?.length">
            <Icon name="tabler:key-filled" width="24" height="24" style="color: #4a905f" />
            <div class="area-list-text">
              <span class="text-label">{{ item?.kw_attr?.length }} {{ $t('filter.filterList.keyword') }}</span>
              <span class="text-value">{{ item?.kw_attr?.map((item: any) => item.kw).join(',') }}</span>
            </div>
          </div>
          <div class="area-list-item" v-show="item.status_count">
            <Icon name="ion:chatbubble" width="20" height="20" style="color: #4a905f" />
            <div class="area-list-text">
              <span class="text-label">{{ t('filter.tweet', { count: item.status_count }) }}</span>
              <span class="text-value">{{ t('filter.tweet', { count: item.status_count }) }}</span>
            </div>
          </div>
          <div class="filter-card-footer">
            <div class="desc">{{ $t('filter.filterList.envDesc') }}</div>
            <div class="actions">
              <a-button @click="editFilters(item.id)" size="small">
                <template #icon>
                  <Icon name="mdi:pencil" />
                </template>
                {{ $t('filter.filterList.edit') }}
              </a-button>
              <a-button status="danger" @click="delFiltersAsync(item.id, index)" size="small">
                <template #icon>
                  <Icon name="fa6-solid:xmark" />
                </template>
                {{ $t('common.delete') }}
              </a-button>
            </div>
          </div>
        </a-card>
      </div>
    </a-spin>
  </div>
</template>

<style lang="scss" scoped>
.admin-roles {
  padding: 55px 25px 50px 25px;
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

  .filter-card {
    min-height: 540px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    .area-list-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 13px;
      gap: 8px;
      & + .area-list-item {
        margin-top: 20px;
      }
      .area-list-text {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        .text-label {
          font-weight: bold;
        }
      }
      .icon {
        color: #4a905f;
        width: 40px;
        height: 40px;
      }
    }
    .filter-card-footer {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 4px;
      .actions {
        display: flex;
        gap: 10px;
      }
    }
  }
}
</style>
