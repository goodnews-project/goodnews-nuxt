<script setup>
import { computed, watchEffect } from 'vue';
import { getReportList } from '@/api/setting/index.js';
const { t } = useI18n();
definePageMeta({
  layout: 'settings',
  name: 'settings-reports',
  middleware: ['auth'],
});

const form = reactive({
  status: '',
  source: '',
  domain: '',
});

const resetForm = () => {
  form.status = '1';
  form.source = '0';
  form.domain = '';
};

const statusList = computed(() => {
  return [
    { label: t('public.untreated'), value: '1' },
    { label: t('public.processed'), value: '2' },
  ];
});
const sourceList = computed(() => {
  return [
    { label: t('public.all'), value: '0' },
    { label: t('public.local'), value: '1' },
    { label: t('public.remote'), value: '2' },
  ];
});

const router = useRouter();
const dataList = ref([]);
const getData = async () => {
  const params = {
    ...form,
  };
  const { data } = await getReportList(params);
  console.log('datalist', data);
  dataList.value = data;
};
const resetData = () => {
  resetForm();
  getData();
};
watchEffect(() => {
  resetForm();
  getData();
});

const goDetail = (e) => {
  console.log('eee', e);
  router.push({
    name: 'settings-reports-detail',
    params: {
      id: e.id,
    },
  });
};
</script>

<template>
  <div class="pages">
    <PageHeader :showArrow="false">{{ t('report.name') }}</PageHeader>
    <div class="wrapper">
      <a-form :model="form" layout="vertical">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item field="status" :label="t('public.status')" label-col-flex="100px">
              <a-radio-group type="button" size="mini" v-model="form.status">
                <a-radio v-for="item in statusList" :key="item.value" :value="item.value">{{ item.label }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="source" :label="t('report.reportAccountSource')" label-col-flex="80px">
              <a-radio-group type="button" size="mini" v-model="form.source">
                <a-radio v-for="item in sourceList" :key="item.value" :value="item.value">{{ item.label }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item field="domain" label-col-flex="100px">
              <a-input v-model="form.domain" :placeholder="t('report.reportAccountDomain')" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-button long type="primary" @click="getData">{{ t('common.search') }}</a-button>
          </a-col>
          <a-col :span="12">
            <a-button long type="primary" status="danger" @click="resetData">{{ t('search.reset') }}</a-button>
          </a-col>
        </a-row>
      </a-form>

      <div class="data-list">
        <div class="data-item" v-for="item in dataList.value" :key="item.id">
          <div class="data-user">
            <div class="user">
              <UserItem :isShowFollow="false" :isShowUserCard="false" :isShowNote="false" :data="item"></UserItem>
            </div>
            <div class="info">
              <div class="total">{{ t('report.noteCount', { count: item.notes }) }}</div>
            </div>
          </div>
          <div class="reported-user" v-for="reportUser in item.reported" :key="reportUser.id">
            <div class="user-name">{{ reportUser.account.username }}</div>
            <div class="content" @click="goDetail(reportUser)">
              <div class="commit-text">
                {{ reportUser.comment || t('report.noReportReason') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pages {
  padding: 55px 25px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  .header {
    padding-left: 0;
  }

  .wrapper {
    margin-top: 40px;
    width: 100%;

    .data-list {
      margin-top: 30px;

      .data-item {
        & + .data-item {
          margin-top: 20px;
        }

        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 10px 20px 10px 10px;
        border-bottom: 1px solid var(--color-neutral-2);
        background: var(--color-neutral-1);

        .data-user {
          display: flex;
          align-items: center;
          flex: 1;
          justify-content: space-between;
        }

        .reported-user {
          padding-left: 10px;
          display: flex;
          gap: 20px;

          .content {
            .commit-text {
              // font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
