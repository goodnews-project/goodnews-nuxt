<script setup>
definePageMeta({
  layout: 'settings',
  name: 'settings-adminInstances-detail',
  middleware: ['auth'],
});
import { getInstanceDetail, putInstanceSetting } from '@/api/admin/instance';
import PanelComp from '@/components/PanelComp/index.vue';
import { formatFileSize } from '@/utils';
const { t } = useI18n();

const route = useRoute();
const pageData = ref({});
const panelData = ref([]);
const loading = ref(false);
const getData = async () => {
  try {
    loading.value = true;
    const res = await getInstanceDetail(route.params.domain);
    pageData.value = res;
    panelData.value = [
      { total: res.account_count, label: t('admin.instances.details.account') },
      { total: res.status_count, label: t('public.tweet') },
      { total: formatFileSize(res.attachment_sum, 'b'), label: t('admin.instances.details.media') },
      { total: res.follow_count, label: t('admin.instances.details.followers') },
      { total: res.follower_count, label: t('admin.instances.details.following') },
      { total: res.mostFollowed, label: t('admin.instances.details.reports') },
    ];
    if (res.instance) {
      instanceSettingData['is_disable_download'] = !!res.instance.is_disable_download;
      instanceSettingData['is_proxy'] = !!res.instance.is_proxy;
      instanceSettingData['is_disable_sync'] = !!res.instance.is_disable_sync;
    }
  } finally {
    loading.value = false;
  }
};
getData();
const instanceSettingData = reactive({
  is_disable_download: false,
  is_proxy: false,
  is_disable_sync: false,
});

const settingChange = async (settingKey, settingValue) => {
  try {
    loading.value = true;
    const res = await putInstanceSetting(route.params.domain, {
      [settingKey]: settingValue ? 1 : 0,
    });
    getData();
  } finally {
    loading.value = false;
  }
};
const router = useRouter();
const goRouter = (path) => {
  router.push(path);
};
</script>

<template>
  <div class="admin-detail">
    <PageHeader>{{ route.params.domain }}</PageHeader>
    <a-spin :loading="loading">
      <div class="main">
        <p class="content-tips">
          <i class="fa fa-info fa-fw"></i>
          {{ $t('admin.instances.details.desc') }}
        </p>

        <PanelComp :data="panelData" />
        <div class="dashboard" style="margin-bottom: 40px">
          <div class="dashboard__item">
            <div>
              <div class="dimension">
                <h4>
                  {{ $t('admin.instances.details.mostFollowed') }}
                </h4>
                <table>
                  <tbody>
                    <tr class="dimension__item" v-for="item in pageData.follower_rank">
                      <UserCard :account="item">
                        <td class="dimension__item__key" @click="goRouter(`/user/${item.acct}`)">
                          <span class="dimension__item__indicator"></span>
                          <span :title="item.acct">{{ item.username }}</span>
                        </td>
                      </UserCard>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <a-space size="large">
          <a-spin :loading="settingChangeLoading">
            <a-checkbox @change="settingChange('is_disable_download', $event)" v-model="instanceSettingData.is_disable_download">
              {{ t('admin.instances.thisInstanceDoesNotDownloadAttachments') }}
            </a-checkbox>
            <a-checkbox @change="settingChange('is_proxy', $event)" v-model="instanceSettingData.is_proxy">
              {{ t('admin.instances.reverseProxyAttachmentLinks') }}
            </a-checkbox>
            <a-checkbox @change="settingChange('is_disable_sync', $event)" v-model="instanceSettingData.is_disable_sync">
              {{ t('admin.instances.stopSyncingContentFromThisInstance') }}
            </a-checkbox>
          </a-spin>
        </a-space>
        <hr class="spacer" />
        <h3>
          {{ $t('admin.instances.details.usability') }}
        </h3>
        <p class="content-tips">
          {{ $t('admin.instances.details.usabilityDesc', { days: 7 }) }}
        </p>
        <div class="availability-indicator">
          <ul class="availability-indicator__graphic">
            <li
              class="availability-indicator__graphic__item"
              v-for="item in pageData.availability"
              :title="item.date"
              :class="{ red: item.status === false }"
            ></li>
          </ul>
          <div class="availability-indicator__hint">
            <span class="positive-hint">
              {{
                !pageData?.availability?.some((item) => item.status === false)
                  ? $t('admin.instances.details.noFailure')
                  : $t('admin.instances.details.failure', { count: pageData.availability.filter((item) => item.status === false).length })
              }}
            </span>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<style lang="scss" scoped>
:deep(.arco-spin) {
  .arco-checkbox {
    margin-right: 20px;
  }
}

:deep(.header) {
  padding: 4px 0;
}

.admin-detail {
  padding: 55px 25px 50px 25px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  .header {
    margin-bottom: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .arrow {
      .n-button {
        font-size: 18px;
      }
    }
  }
}

.main {
  .content-tips {
    font-size: 14px;
    line-height: 21px;
    color: #282c37;
    margin-bottom: 20px;
  }
  h4 {
    text-transform: uppercase;
    font-size: 13px;
    font-weight: 700;
    color: #282c37;
    padding-bottom: 8px;
    margin-bottom: 8px;
    border-bottom: 1px solid #c0cdd9;
  }
  hr {
    width: 100%;
    height: 0;
    border: 0;
    border-bottom: 1px solid rgba(176, 192, 207, 0.6);
    margin: 20px 0;
    &.spacer {
      height: 1px;
      border: 0;
    }
  }
  h3 {
    color: #282c37;
    font-size: 20px;
    line-height: 28px;
    font-weight: 400;
    margin-bottom: 30px;
  }
  button {
    margin-top: 10px;
  }
  .n-button {
    &.underLine {
      text-decoration: underline;
    }
  }
  .dashboard {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
    grid-gap: 10px;

    .sparkline {
      display: block;
      text-decoration: none;
      background: #ccd7e0;
      border-radius: 4px;
      position: relative;
      padding: 0 0 75px;
      overflow: hidden;
      .sparkline__value {
        display: flex;
        line-height: 33px;
        align-items: flex-end;
        padding: 20px 20px 10px;
        .sparkline__value__total {
          display: block;
          margin-right: 10px;
          font-weight: 500;
          font-size: 28px;
          color: #000;
        }
      }
      .sparkline__label {
        padding: 0 20px 10px;
        text-transform: uppercase;
        color: #282c37;
        font-weight: 500;
      }
      .sparkline__graph {
        position: absolute;
        bottom: 0;
        width: 100%;
        svg {
          display: block;
          margin: 0;
        }
        path:first-child {
          fill: rgba(58, 59, 255, 0.25) !important;
          fill-opacity: 1 !important;
        }
        path:last-child {
          stroke: #1c1dff !important;
          fill: none !important;
        }
      }
    }
  }

  @include respond('phone') {
    .dashboard {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
  }
  .dimension {
    .dimension__item {
      border-bottom: 1px solid #ccd7e0;
      .dimension__item__indicator {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #6364ff;
        margin-right: 10px;
        &.dimension__item__indicator--30 {
          background-color: rgba(99, 100, 255, 0.3);
        }
      }
      .dimension__item__key {
        font-weight: 500;
        padding: 11px 10px;
      }
      .dimension__item__value {
        text-align: right;
        color: #282c37;
        padding: 11px 10px;
      }
    }
  }
  .availability-indicator {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    font-size: 14px;
    line-height: 21px;
    .availability-indicator__graphic {
      display: flex;
      margin: 0 -2px;
      .availability-indicator__graphic__item {
        display: block;
        flex: 0 0 auto;
        width: 4px;
        height: 21px;
        background: #c0cdd9;
        margin: 0 2px;
        border-radius: 2px;
        &.red {
          background: #ff6363;
        }
      }
    }
    .availability-indicator__hint {
      padding: 0 15px;
    }
  }
}
</style>
