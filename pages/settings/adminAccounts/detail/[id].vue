<script setup>
definePageMeta({
  layout: 'settings',
  name: 'settings-adminAccounts-detail',
  middleware: ['auth'],
});
import {
  getAccountInfo,
  disableAccount,
  enableAccount,
  setAccountSensitive,
  setAccountUnSensitive,
  setAccountSilence,
  setAccountUnSilence,
  setAccountSuspend,
  setAccountUnSuspend,
} from '@/api/admin/account';
import { formatFileSize } from '@/utils';
import PanelComp from '@/components/PanelComp/index.vue';
const { t } = useI18n();
const route = useRoute();
const pageData = ref({});
const panelData = ref([]);
const loading = ref(false);
const getData = async () => {
  try {
    loading.value = true;
    const res = await getAccountInfo(route.params.id);
    pageData.value = res;
    panelData.value = [
      { total: res.account?.status_count, label: t('public.tweet') },
      { total: formatFileSize(res.attachment_sum, 'b'), label: t('admin.account.media') },
      { total: res.account?.followers_count, label: t('admin.account.followers') },
      { total: res.target_report_count, label: t('admin.account.reportByAccount') },
      { total: res.report_count, label: t('admin.account.reportsForThisAccount') },
    ];
  } finally {
    loading.value = false;
  }
};
getData();

const formValue = ref({
  textareaValue: '',
});

import defaultAvatar from '@/assets/images/default-avatar.jpg';
const renderAvatar = computed(() => {
  if (pageData.value.account?.avatar) {
    return pageData.value.account.avatar;
  } else {
    return defaultAvatar;
  }
});
const warningActionMap = {
  1: t('admin.account.frozen'),
  2: t('admin.account.setSensitiveUser'),
  3: t('admin.account.hideUser'),
  4: t('admin.account.disableAccount'),
};
const actionMap = reactive({
  disableAccount: { loading: false, fn: disableAccount },
  enableAccount: { loading: false, fn: enableAccount },
  setAccountSensitive: { loading: false, fn: setAccountSensitive },
  setAccountUnSensitive: { loading: false, fn: setAccountUnSensitive },
  setAccountSilence: { loading: false, fn: setAccountSilence },
  setAccountUnSilence: { loading: false, fn: setAccountUnSilence },
  setAccountSuspend: { loading: false, fn: setAccountSuspend },
  setAccountUnSuspend: { loading: false, fn: setAccountUnSuspend },
});
const handleAccountAction = async (action) => {
  try {
    actionMap[action]['loading'] = true;
    const res = await actionMap[action].fn(pageData.value.account.id);
    await getData();
  } finally {
    actionMap[action]['loading'] = false;
  }
};
const router = useRouter();
const goAccount = () => {
  router.push(`/user/${pageData.value.account.acct}`);
};
</script>

<template>
  <div class="admin-detail">
    <PageHeader>{{ pageData.account?.display_name }}</PageHeader>
    <a-spin :loading="loading">
      <div class="content">
        <div class="card h-card">
          <a target="_blank" rel="noopener noreferrer">
            <div class="card__bar" @click="goAccount">
              <div class="avatar">
                <img alt="" width="48" height="48" :src="renderAvatar" />
              </div>
              <div class="display-name">
                <bdi>
                  <strong class="emojify p-name">{{ pageData.account?.user?.email }}</strong>
                </bdi>
                <span> @{{ pageData.account?.acct }} </span>
              </div>
            </div>
          </a>
        </div>

        <PanelComp :data="panelData" />

        <div style="margin-bottom: 20px">
          <a-table size="small">
            <tbody class="table-body">
              <tr class="table-row">
                <td>{{ t('admin.account.role') }}</td>
                <td>{{ t('admin.account.noRole') }}</td>
                <td>
                  <!-- {{ `${t('common.change')}${t('admin.account.role')}` }} -->
                </td>
              </tr>
              <tr>
                <td>{{ t('admin.account.email') + t('admin.account.address') }}</td>
                <td>{{ pageData.account?.user?.email }}</td>
                <td>
                  <!-- <n-button text>{{ `${t('common.change')}${t('admin.account.email')}` }}</n-button> -->
                </td>
              </tr>
              <tr>
                <td>{{ t('admin.account.emailStatus') }}</td>
                <td>{{ pageData.account?.user?.confirmed_at ? t('admin.account.confirmed') : t('admin.account.unconfirmed') }}</td>
                <td></td>
              </tr>
              <tr>
                <td>{{ t('admin.account.interfaceLanguage') }}</td>
                <td>{{ pageData.account?.user?.locale }}</td>
                <td></td>
              </tr>
              <tr>
                <td>{{ t('admin.account.joinedAt') }}</td>
                <td>{{ pageData.account?.user?.created_at }}</td>
                <td></td>
              </tr>
              <tr>
                <td>{{ t('admin.account.lastActive', { type: t('admin.ipRules.ip') }) }}</td>
                <td>{{ pageData.account?.user?.current_signin_ip }}</td>
                <td></td>
              </tr>
              <tr>
                <td>{{ t('admin.account.lastActive', { type: t('public.time') }) }}</td>
                <td>{{ pageData.account?.user?.current_signin_at }}</td>
                <td></td>
              </tr>
            </tbody>
          </a-table>
        </div>

        <a-space size="large">
          <a-button
            type="primary"
            :loading="actionMap['disableAccount'].loading"
            @click="handleAccountAction('disableAccount')"
            v-if="pageData.account?.user?.is_disable == 0"
          >
            {{ t('admin.account.freeze') }}
          </a-button>
          <a-button type="primary" :loading="actionMap['enableAccount'].loading" @click="handleAccountAction('enableAccount')" v-else>
            {{ t('admin.account.unfreeze') }}
          </a-button>
          <a-button
            type="primary"
            :loading="actionMap['setAccountSensitive'].loading"
            @click="handleAccountAction('setAccountSensitive')"
            v-if="pageData.account?.sensitized_at === null"
          >
            {{ t('admin.account.sensitiveContent') }}
          </a-button>
          <a-button type="primary" :loading="actionMap['setAccountUnSensitive'].loading" @click="handleAccountAction('setAccountUnSensitive')" v-else>
            {{ t('admin.account.un') }}{{ t('admin.account.sensitiveContent') }}
          </a-button>
          <a-button
            type="primary"
            :loading="actionMap['setAccountSilence'].loading"
            @click="handleAccountAction('setAccountSilence')"
            v-if="pageData.account?.silence_at === null"
          >
            {{ t('admin.account.hide') }}
          </a-button>
          <a-button type="primary" :loading="actionMap['setAccountUnSilence'].loading" @click="handleAccountAction('setAccountUnSilence')" v-else>
            {{ t('admin.account.un') }}{{ t('admin.account.hide') }}
          </a-button>
          <a-button
            type="primary"
            :loading="actionMap['setAccountSuspend'].loading"
            @click="handleAccountAction('setAccountSuspend')"
            v-if="pageData.account?.suspend === null"
          >
            {{ t('admin.account.ban') }}
          </a-button>
          <a-button type="primary" :loading="actionMap['setAccountUnSuspend'].loading" @click="handleAccountAction('setAccountUnSuspend')" v-else>
            {{ t('admin.account.un') }}{{ t('admin.account.ban') }}
          </a-button>
        </a-space>
        <a-divider class="half-divider" />
        <a-row :style="{ width: '100%' }">
          <a-list :style="{ width: '100%' }">
            <a-list-item v-for="account_warning in pageData.account_warnings" :key="account_warning.id">
              <a-list-item-meta
                :title="`${account_warning.account.acct} ${warningActionMap[account_warning.action]} ${account_warning.target_account.acct}`"
                :description="account_warning.created_at"
              >
                <template #avatar>
                  <div
                    style="
                      background-color: rgba(255, 0, 0, 0.4);
                      width: 40px;
                      height: 40px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      border-radius: 50%;
                    "
                  >
                    <Icon name="heroicons-solid:exclamation" width="20" height="20" style="color: black" />
                  </div>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </a-row>
      </div>
    </a-spin>
  </div>
</template>

<style lang="scss" scoped>
:deep(.header) {
  padding: 4px 0;
}

:deep(.arco-spin) {
  width: 100%;
}

.arco-list-item {
  width: 100%;
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

.content {
  --bg-color: #f9fafb;

  h2 {
    color: #282c37;
    font-size: 24px;
    line-height: 36px;
    font-weight: 700;
  }

  .display-name {
    display: block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card {
    & > a {
      display: block;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    }

    .card__img {
      height: 130px;
      position: relative;
      background: #fff;
      border-radius: 4px 4px 0 0;

      img {
        display: block;
        width: 100%;
        height: 100%;
        margin: 0;
        -o-object-fit: cover;
        object-fit: cover;
        border-radius: 4px 4px 0 0;
      }
    }

    .card__bar {
      position: relative;
      padding: 15px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background: var(--bg-color);
      border-radius: 0 0 4px 4px;
      cursor: pointer;
      transition: all 0.3s ease-out;
      &:hover {
        color: rgb(var(--arcoblue-6));
      }
      .avatar {
        flex: 0 0 auto;
        width: 48px;
        height: 48px;
        padding-top: 2px;
        border-radius: 5px;
        overflow: hidden;
      }

      .display-name {
        margin-left: 15px;
        text-align: left;

        span {
          display: block;
          font-size: 14px;
          color: #282c37;
          font-weight: 400;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  .action-buttons {
    display: flex;
    gap: 10px;
  }

  .simple_form textarea {
    box-sizing: border-box;
    font-size: 16px;
    color: #000;
    display: block;
    width: 100%;
    outline: 0;
    font-family: inherit;
    resize: vertical;
    background: #f9fafb;
    border: 1px solid #fff;
    border-radius: 4px;
    padding: 10px;
  }

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

  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;

    tbody tr td {
      padding: 10px;
      border-bottom: 1px solid #ccd7e0;
    }
  }
}

:deep(.arco-table-element) {
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
