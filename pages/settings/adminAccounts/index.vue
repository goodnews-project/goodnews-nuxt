<script setup>
import { ref, h, render } from 'vue';
import { getRoleList, getUserList, bannedUser } from '@/api/admin/index.js';
import { setAccountSensitiveUser, setAccountUnSensitiveUser } from '@/api/admin/account';
import defaultAvatar from '@/assets/images/default-avatar.jpg';
import { useTransferStore } from '@/stores/transfer';
const { t } = useI18n();

definePageMeta({
  layout: 'settings',
  name: 'settings-adminAccounts',
  middleware: ['auth'],
});

const transferStore = useTransferStore();
const router = useRouter();

const selectedAll = ref(false);

const rowSelection = ref({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
});

const positionOptions = ref([
  {
    label: t('public.all'),
    value: 0,
  },
  {
    label: t('admin.account.local'),
    value: 1,
  },
  {
    label: t('admin.account.remote'),
    value: 2,
  },
]);

const statusOptions = ref([
  {
    label: t('public.all'),
    value: 0,
  },
  {
    label: t('admin.account.banned'),
    value: 1,
  },
]);

const roleOptions = ref([
  {
    label: t('public.all'),
    value: 0,
  },
]);

const sortordOptions = ref([
  {
    label: t('admin.account.recent'),
    value: 0,
  },
  {
    label: t('admin.account.recentActivity'),
    value: 1,
  },
]);

const position = ref(1);
const status = ref(0);
const roleId = ref(parseInt(transferStore.roleId || 0));
setTimeout(() => {
  transferStore.setRoleId('');
}, 3000);
const sortord = ref(0);
const username = ref('');
const nickname = ref('');
const email = ref('');
const ip = ref('');

const goDetail = (rowData) => {
  router.push(`/settings/adminAccounts/detail/${rowData.account_id}`);
};

const goRouter = (item) => {
  router.push(`/user/${item.acct}`);
};

const selectedRowKeys = ref([]);

const rowKey = 'user_id';

const tableData = ref([]);
const tableLoading = ref(false);

const pageIndex = ref(1);
const pageSize = ref(20);
const totalCount = ref(0);
const handlePageChange = (page) => {
  pageIndex.value = page;
  getUserListAsync();
};

const handleSearch = () => {
  getUserListAsync();
};

const handleReset = () => {
  position.value = 1;
  status.value = 0;
  roleId.value = 0;
  sortord.value = 0;
  username.value = '';
  nickname.value = '';
  email.value = '';
  ip.value = '';
};

const columns = ref([
  {
    title: t('admin.account.account'),
    dataIndex: 'acct',
    render: ({ record: row }) => {
      const avatar = row.avatar || defaultAvatar;
      return [
        h('div', { style: 'display:flex;justify-content:flex-start;align-items: center;' }, [
          h('img', {
            src: avatar,
            style: 'width: 30px; height: 30px; border-radius: 50%;margin-right:5px',
            onClick: () => goRouter(row),
          }),
          h(
            'div',
            {
              style: 'display:flex;flex-direction:column;justify-content:flex-start;align-items: flex-start;',
            },
            [
              h('div', { style: 'width:100%;display:flex;justify-content:flex-start;align-items: center;', onClick: () => goRouter(row) }, row.display_name),
              h('div', { style: 'display:flex;justify-content:center;align-items: center;cursor:pointer', onClick: () => goRouter(row) }, row.acct),
            ]
          ),
        ]),
      ];
    },
  },
]);

import { mobileBreakpoint } from '@/utils/constant';
import { watchEffect } from 'vue';
const screenWidth = window.innerWidth;
const expandable = ref(null);
watchEffect(() => {
  if (screenWidth < mobileBreakpoint) {
    expandable.value = {
      width: 40,
    };
  } else {
    const tableHeaderCol = [
      {
        title: t('admin.account.tweetsNumber'),
        dataIndex: 'status_count',
      },
      {
        title: t('admin.account.followers'),
        dataIndex: 'followers_count',
      },
      {
        title: t('admin.account.recentActivity'),
        dataIndex: 'active_time',
      },
      {
        title: t('admin.account.from'),
        dataIndex: 'email',
        render: ({ record: row }) => {
          return [
            h(
              'div',
              {
                style: 'display:flex;flex-direction:column;justify-content:flex-start;align-items: flex-start;',
              },
              [
                h('div', { style: 'display:flex;justify-content:flex-start;align-items: center;' }, row.email),
                h('div', { style: 'display:flex;justify-content:flex-start;align-items: center;' }, row.current_signin_ip),
              ]
            ),
          ];
        },
      },
      {
        title: t('admin.account.sensitiveContentRatio'),
        render: ({ record: row }) => {
          if (row.status_count === 0) {
            return '0%';
          } else {
            return `${((row.sensitive_status_count / row.status_count) * 100).toFixed(0)}%`;
          }
        },
      },
      {
        title: t('admin.account.sensitiveAccount'),
        render: ({ record: row }) => {
          return row.sensitized_at ? t('common.yes') : t('common.no');
        },
      },
      {
        title: t('admin.account.setSensitiveAccount'),
        slotName: 'action',
      },
    ];
    columns.value.push(...tableHeaderCol);
  }
}, []);

const handleSelect = async (row, e) => {
  console.log(row, e);
  let res;
  if (e === 1) {
    res = await setAccountSensitiveUser(row.account_id);
  } else {
    res = await setAccountUnSensitiveUser(row.account_id);
  }
  console.log('res', res);
  row.sensitized_at = e;
};
const getUserListAsync = async () => {
  tableLoading.value = true;
  try {
    const params = {
      page: pageIndex.value,
      position: position.value,
      status: status.value,
      role_id: roleId.value,
      sortord: sortord.value,
      username: username.value,
      nickname: nickname.value,
      email: email.value,
      ip: ip.value,
    };
    const res = await getUserList(params);
    const dataList = res.data.map((element) => {
      return {
        ...element,
        expand: t('admin.account.tableRenderText', {
          tweetCount: element.status_count,
          followersCount: element.followers_count,
          activeTime: element.active_time,
          from: element.email,
        }),
      };
    });
    tableData.value = dataList || [];
    totalCount.value = res.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    tableLoading.value = false;
  }
};
getUserListAsync();

const getRoleListAsync = async () => {
  try {
    const res = await getRoleList();
    const data = res || [];
    data.forEach((element) => {
      element.label = element.name;
      element.value = element.id;
    });
    roleOptions.value = roleOptions.value.concat(data);
  } catch (err) {
  } finally {
  }
};
getRoleListAsync();

const bannedUserAsync = async () => {
  const searchParams = {
    position: position.value,
    status: status.value,
    role_id: roleId.value,
    sortord: sortord.value,
    username: username.value,
    nickname: nickname.value,
    email: email.value,
    ip: ip.value,
  };

  try {
    let params = {
      user_ids: selectedRowKeys.value,
    };
    if (selectedAll.value) {
      params.is_match_all = 1;
      params = { ...params, ...searchParams };
    } else {
      params.is_match_all = 0;
    }
    const res = await bannedUser(params);
  } catch (err) {
  } finally {
  }
};

watch(
  () => selectedRowKeys.value,
  (newValue) => {
    selectedAll.value = false;
  }
);

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
    <div class="header">
      <div class="top">
        <div class="top-item">
          <div class="top-title">{{ t('admin.account.site') }}</div>
          <a-select class="top-select" v-model="position" :options="positionOptions" />
        </div>
        <div class="top-item">
          <div class="top-title">{{ t('admin.account.manage') }}</div>
          <a-select class="top-select" v-model="status" :options="statusOptions" />
        </div>

        <div class="top-item">
          <div class="top-title">{{ t('admin.account.role') }}</div>
          <a-select class="top-select" v-model="roleId" :options="roleOptions" />
        </div>
        <div class="top-item">
          <div class="top-title">{{ t('admin.account.sortOrder') }}</div>
          <a-select class="top-select" v-model="sortord" :options="sortordOptions" />
        </div>
      </div>
      <div class="center">
        <a-input class="center-input" v-model="username" type="text" :placeholder="t('admin.account.username')" />
        <a-input class="center-input" v-model="nickname" type="text" :placeholder="t('admin.account.nickname')" />
        <a-input class="center-input" v-model="email" type="text" :placeholder="t('admin.account.emailAddress')" />
        <a-input class="center-input" v-model="ip" type="text" :placeholder="t('admin.account.ipAddress')" />
      </div>
      <div class="bottom">
        <a-button class="search" @click="handleSearch" type="primary"> {{ t('admin.account.search') }} </a-button>
        <a-button class="reset" @click="handleReset" type="primary" status="danger"> {{ t('admin.account.reset') }} </a-button>
      </div>
    </div>
    <div
      v-show="!tableLoading && (totalCount > pageSize ? selectedRowKeys.length === pageSize : selectedRowKeys.length === tableData.length) && tableData.length"
      class="select-tips"
    >
      <span v-show="!selectedAll">
        {{ t('admin.account.allOnPage') }}
        {{ selectedRowKeys.length }}
        {{ t('admin.account.projectSelected') }}。
      </span>
      <a-link v-show="!selectedAll" @click="selectedAll = true">
        {{ t('admin.account.selectAllSearch') }}
        {{ totalCount }}
        {{ t('admin.account.projects') }} 。
      </a-link>
      <span v-show="selectedAll">
        {{ t('public.all') }}
        {{ totalCount }}
        {{ t('admin.account.projectsAllMatching') }}。
      </span>
      <a-link v-show="selectedAll" @click="selectedAll = false">{{ t('admin.account.deselectAll') }}</a-link>
      <a-button type="primary" status="warning" @click="bannedUserAsync" size="small">{{ t('admin.account.ban') }}</a-button>
    </div>
    <div class="table-wrapper">
      <a-table
        :scroll-x="700"
        :loading="tableLoading"
        :columns="columns"
        :data="tableData"
        :row-key="rowKey"
        :row-selection="rowSelection"
        v-model:selectedKeys="selectedRowKeys"
        @row-click="goDetail"
        :pagination="false"
        :expandable="expandable"
      >
        <template #action="{ record }">
          <a-dropdown @click.stop>
            <a-button>
              {{ record.sensitized_at ? t('common.yes') : t('common.no') }}
              <icon-down style="margin-left: 8px" />
            </a-button>
            <template #content>
              <a-doption :value="1" @click="handleSelect(record, 1)">{{ t('common.yes') }}</a-doption>
              <a-doption :value="0" @click="handleSelect(record, 0)">{{ t('common.no') }}</a-doption>
            </template>
          </a-dropdown>
        </template>
      </a-table>

      <a-pagination
        :page-slot="windowWidth > 768 ? 8 : windowWidth > 480 ? 6 : 4"
        class=""
        v-model:current="pageIndex"
        v-model:page-size="pageSize"
        :total="totalCount"
        show-total
        @change="handlePageChange"
      >
        <template #prefix="{ itemCount }"> {{ t('common.itemTotal', { total: itemCount }) }} </template>
      </a-pagination>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-accounts {
  padding: 55px 25px 50px 25px;

  .header {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    .top {
      margin-bottom: 35px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .top-item {
        width: 20%;
        margin-right: 40px;

        .top-title {
          margin-bottom: 10px;
        }
      }
    }

    .user-ellipsis {
      // max-width: 150px;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      white-space: normal;
      word-break: break-word;
    }

    .center {
      .center-input {
        margin-bottom: 15px;
      }
    }

    .bottom {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      button {
        flex: 1;
      }
    }
  }
  .select-tips {
    margin-bottom: 10px;
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }
}

@include respond('phone') {
  .admin-accounts {
    .header {
      .top {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;

        .top-item {
          width: 48%;
          margin-right: 0;
          margin-bottom: 10px;
        }
      }
    }
  }
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
