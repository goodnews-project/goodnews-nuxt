<script setup lang="ts">
import { getRoleList } from '@/api/admin/index.js';
import { useTransferStore } from '@/stores/transfer';
const { t } = useI18n();
definePageMeta({
  layout: 'settings',
  name: 'settings-adminRoles',
  middleware: ['auth'],
});

useHead({
  title: t('admin.role.manageRoles'),
});

const transferStore = useTransferStore() as any;
const router = useRouter();
const addRole = () => {
  router.push('/settings/adminRoles/new');
};

const editRole = (id: string, name: string) => {
  transferStore.setRoleName(name);
  router.push({
    path: '/settings/adminRoles/edit',
    query: {
      id,
    },
  });
};

const footerLoading = ref(false);

const roleList = ref<any[]>([]);

const getRoleListAsync = async () => {
  if (footerLoading.value) return;
  try {
    footerLoading.value = true;
    const res = await getRoleList();
    roleList.value = res || [];
  } catch (err) {
  } finally {
    footerLoading.value = false;
  }
};
getRoleListAsync();

const goAdminAccounts = (id: string) => {
  transferStore.setRoleId(id);
  router.push(`/settings/adminAccounts`);
};
</script>

<template>
  <div class="admin-roles">
    <div class="header">
      <h2>{{ t('admin.role.title') }}</h2>
      <a-button class="btn" @click="addRole">{{ t('admin.role.addRole') }}</a-button>
    </div>
    <div class="desc">
      {{ t('admin.role.use') }}
      <span class="font-bold">{{ t('admin.role.useuserRole') }}</span>
      {{ t('admin.role.youCanCustomizeTheFunctionsAndAreasThatYourUsersCan') }}
    </div>
    <div class="default">
      <div class="default-top">
        <Icon name="heroicons:users-solid" width="18" height="18" style="color: black" />
        <span style="margin-left: 4px">{{ t('admin.role.defaultPermissions') }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span style="flex: 1">{{ t('admin.role.thisIsTheBasicRoleThatAffectsAllUsersIncludingThoseWhoAreNotAssignedARole') }}</span>
      </div>
    </div>
    <a-spin :loading="footerLoading">
      <div class="footer">
        <div class="item" v-for="item in roleList" :key="item.id">
          <div class="item-top">
            <Icon name="heroicons:users-solid" width="18" height="18" style="color: black" />
            <span style="margin-left: 4px; font-weight: bold">
              {{ item.name }}
            </span>
          </div>
          <div class="item-center">
            <div class="item-center-left">
              <span @click="goAdminAccounts(item.id)" style="text-decoration: underline" class="cursor-pointer">
                {{ item.users_count }} {{ t('common.user') }}
              </span>
              •
              <span style="text-decoration: underline dotted" class="cursor-pointer">{{ item.priority }} {{ t('admin.role.permissions') }}</span>
            </div>
            <div class="item-center-right" @click="editRole(item.id, item.name)">
              <Icon name="mdi:pencil" /><span class="ml-1 font-bold cursor-pointer">{{ t('common.edit') }}</span>
            </div>
          </div>
        </div>
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

    .btn {
      background-color: #626aef;
      color: white;
    }
  }

  .desc {
    margin-bottom: 40px;
  }

  .default {
    background-color: #d9e1e8;
    padding: 15px;
    margin-bottom: 40px;

    .default-top {
      margin-bottom: 8px;
      font-weight: bold;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }

  .footer {
    background-color: #d9e1e8;

    .item {
      padding: 15px;
      border-bottom: 1px solid #ccd7e0;

      .item-top {
        font-weight: bold;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 8px;
      }

      .item-center {
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;

        .item-center-right {
          display: flex;
          align-items: center;
          font-size: 14px;
          font-weight: bold;
        }
      }
      .item-btn {
        background-color: #626aef;
        color: white;
      }
    }
  }
}
</style>
