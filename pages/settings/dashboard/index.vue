<script setup lang="ts">
import { getDashboardData } from '@/api/setting/index.js';

const { t } = useI18n();
definePageMeta({
  layout: 'settings',
  name: 'settings-dashboard',
  middleware: ['auth'],
});

useHead({
  title: t('admin.dashboard.title'),
});

const dashboardData = ref<any>(null);

const panelData = ref<any[]>([]);
const hasPending = ref(false);
const loading = ref(false);
const getDashboardDataAsync = () => {
  loading.value = true;
  getDashboardData()
    .then(({ data }) => {
      const res = data.value;
      const new_user = res?.new_user;
      new_user.rate = ((new_user.total - new_user.prev) / Math.max(new_user.prev, 1)) * 100;
      new_user.rate = new_user.rate.toFixed(2);
      new_user.rise = new_user.total > new_user.prev;
      const active_user = res.active_user;
      active_user.rate = ((active_user.total - active_user.prev) / Math.max(active_user.prev, 1)) * 100;
      active_user.rate = active_user.rate.toFixed(2);
      active_user.rise = active_user.total > active_user.prev;
      const status = res.status;
      status.rate = ((status.total - status.prev) / Math.max(status.prev, 1)) * 100;
      status.rate = status.rate.toFixed(2);
      status.rise = status.total > status.prev;
      const clientList = res.client;
      const langList = res.lang;
      const domainList = res.domain;
      dashboardData.value = {
        ...res.data,
        new_user,
        active_user,
        status,
        clientList,
        langList,
        domainList,
      };
      hasPending.value = true;
      panelData.value = [
        {
          ...dashboardData.value.new_user,
          label: t('admin.dashboard.newUser'),
        },
        {
          ...dashboardData.value.active_user,
          label: t('admin.dashboard.activeUser'),
        },
        {
          ...dashboardData.value.status,
          label: t('admin.dashboard.interactionsNumber'),
        },
        { label: t('admin.dashboard.receivedReports') },
        { label: t('admin.dashboard.resolvedReports') },
      ];
      //数据特殊处理
    })
    .finally(() => {
      loading.value = false;
    });
};

getDashboardDataAsync();
</script>

<template>
  <div class="pages">
    <a-spin :loading="loading">
      <div class="page-header">
        <h2 class="uppercase">{{ $t('admin.dashboard.title') }}</h2>
        <div class="right">
          {{ `${dashboardData?.start_at || $dayjs().format('YYYY-MM-DD')} - ${dashboardData?.end_at || $dayjs().format('YYYY-MM-DD')}` }}
        </div>
      </div>
      <PanelComp :hasPending="hasPending" :hasPencent="true" :data="panelData" />
      <div class="active-servers">
        <div class="servers-card">
          <div class="header uppercase">
            {{ $t('admin.dashboard.servers.registrationClient') }}
          </div>
          <div class="card-item" v-for="(item, index) in dashboardData?.clientList" :key="index">
            <div class="left">
              <span :class="[index > 0 ? 'active' : '']" class="indicator"></span>
              <span class="title">{{ item.client || '--' }}</span>
            </div>
            <div class="right">{{ item.total }}</div>
          </div>
        </div>
        <div class="servers-card">
          <div class="header uppercase">
            {{ $t('admin.dashboard.servers.mostActiveLanguage') }}
          </div>
          <div class="card-item" v-for="(item, index) in dashboardData?.langList" :key="index">
            <div class="left">
              <span :class="[index > 0 ? 'active' : '']" class="indicator"></span>
              <span class="title">{{ item.language || '--' }}</span>
            </div>
            <div class="right">{{ item.total }}</div>
          </div>
        </div>

        <div class="servers-card">
          <div class="header uppercase">
            {{ $t('admin.dashboard.servers.mostActiveServers') }}
          </div>
          <div
            class="card-item"
            v-for="(item, index) in dashboardData?.domainList
              .slice(0, 8)
              .sort((a: any, b: any) => b.total - a.total)"
            :key="index"
          >
            <div class="left">
              <span :class="[index > 0 ? 'active' : '']" class="indicator"></span>
              <span class="title">{{ item.domain }}</span>
            </div>
            <div class="right">{{ item.total }}</div>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<style lang="scss" scoped>
:deep(.arco-spin) {
  width: 100%;
  display: block;
}
.pages {
  padding: 20px;
  .page-header {
    margin-bottom: 45px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h2 {
      font-size: 24px;
      font-weight: 700;
      line-height: 36px;
    }
    .right {
      float: right;
    }
  }
}

.active-servers {
  width: 100%;
  min-height: 390px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;

  .servers-card {
    width: calc(100% / 3);
    margin-right: 10px;
    .header {
      font-weight: bolder;
      color: #282c37;
      padding-bottom: 8px;
      margin-bottom: 8px;
      border-bottom: 1px solid #c0cdd9;
    }

    .card-item {
      padding: 10px;
      min-height: 40px;
      border-bottom: 1px solid #ccd7e0;
      display: flex;
      align-items: center;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .indicator {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6364ff;
          opacity: 0.8;
          margin-right: 10px;
        }

        .active {
          opacity: 0.2;
        }

        .title {
          font-weight: bolder;
        }
      }

      .right {
        width: 45px;
        min-width: 45px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }

  .card-item:last-child {
    border-bottom: none;
  }
  .servers-card:last-child {
    margin-right: 0;
  }
}
</style>
