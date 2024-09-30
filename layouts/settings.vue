<script setup lang="ts">
import defaultAvatar from '@/assets/images/default-avatar.jpg';
import { useUserStore } from '@/stores/user';
const { t } = useI18n();

const router = useRouter();

const userStore = useUserStore();
const userInfo = computed(() => {
  return userStore.userInfo;
}) as any;

const menuList = [
  {
    label: t('setting.returnHome'),
    icon: 'mingcute:home-5-line',
    key: 'home',
    type: 'menuItem',
  },
  {
    label: t('setting.profile'),
    icon: 'iconamoon:profile-duotone',
    key: 'settings-profile',
    type: 'menuItem',
  },
  {
    label: t('setting.signOut'),
    icon: 'material-symbols:logout',
    key: 'logout',
    type: 'menuItem',
  },
];

const adminMenuList = [
  {
    label: t('admin.menu.filters'),
    key: 'settings-adminFilters',
    type: 'menuItem',
    icon: 'mdi:filter-outline',
  },
  {
    label: t('admin.importExport.menuName'),
    key: 'importExprrt',
    type: 'subMenu',
    icon: 'ic:sharp-import-export',
    children: [
      {
        label: t('admin.importExport.import'),
        key: 'settings-import',
      },
      {
        label: t('admin.importExport.export'),
        key: 'settings-export',
      },
    ],
  },
  {
    label: t('admin.menu.operation'),
    key: 'operation',
    type: 'subMenu',
    icon: 'ep:operation',
    children: [
      {
        label: t('report.name'),
        key: 'settings-reports',
      },
      {
        label: t('admin.menu.accounts'),
        key: 'settings-adminAccounts',
      },
      {
        label: t('admin.followRecommend.title'),
        key: 'settings-followRecommend',
      },
      {
        label: t('admin.menu.instances'),
        key: 'settings-adminInstances',
      },
      {
        label: t('admin.emailDomain.title'),
        key: 'settings-emailDomainBlocks',
      },
      {
        label: t('admin.ipRules.title'),
        key: 'settings-ipRules',
      },
    ],
  },
  {
    label: t('admin.nsq.title'),
    icon: 'iconamoon:profile-duotone',
    key: 'settings-nsq',
    type: 'menuItem',
  },
  {
    label: t('setting.manage'),
    key: 'manage',
    type: 'subMenu',
    icon: 'tabler:brand-asana',
    children: [
      {
        label: t('admin.menu.dashboard'),
        key: 'settings-dashboard',
      },
      {
        label: t('admin.menu.serverSetup'),
        key: 'settings-serverSetup',
      },
      {
        label: t('admin.menu.rules'),
        key: 'settings-rule',
      },
      {
        label: t('admin.menu.roles'),
        key: 'settings-adminRoles',
      },
      {
        label: t('admin.menu.relayStation'),
        key: 'settings-relayStation',
      },
    ],
  },
];
const logout = () => {
  userStore.logout();
  router.push('/');
};

const menuOptions = ref([...menuList]);

const username = computed(() => userInfo.value.acct);

if (userInfo.value.is_admin) {
  menuOptions.value.splice(2, 0, ...adminMenuList);
}

const route = useRoute();
const defaultRouteName = computed(() => route.name);

const handleUpdateValue = (e: any) => {
  showMenu(false);
};
const goHome = () => {
  router.push('/');
};
const isShowMenu = ref(false);
const showMenu = (bool?: boolean) => {
  if (bool === true || bool === false) {
    isShowMenu.value = bool;
    return;
  }

  isShowMenu.value = !isShowMenu.value;
};
const menuItemClick = (key: string) => {
  if (key === 'goHome') {
    goHome();
    return;
  }
  if (key === 'logout') {
    visible.value = true;
    return;
  }
  router.push({ name: key });
  showMenu(false);
};
const visible = ref(false);
const handleOk = async () => {
  console.log('handleOk run');
  visible.value = false;
  logout();
};

const handleCancel = async () => {
  console.log('handleCancel run');
  visible.value = false;
};
</script>

<template>
  <div class="wrapper">
    <header class="nav-tab">
      <div class="logo icon-logo" @click="goHome">
        <img src="/images/logo.png" alt="" />
      </div>
      <div class="btn-box">
        <a-button @click="showMenu()">
          <Icon name="gravity-ui:bars" v-if="!isShowMenu"></Icon>
          <Icon name="gravity-ui:xmark" v-else></Icon>
        </a-button>
      </div>
    </header>
    <div class="menu-mobile" v-if="isShowMenu">
      <a-menu @menu-item-click="menuItemClick" :default-selected-keys="['settings-profile']" :auto-open-selected="true">
        <template v-for="item in menuOptions">
          <a-sub-menu v-if="item.type === 'subMenu'" :key="item.key">
            <template #title>
              <div class="router-item" style="display: flex; align-items: center; gap: 4px">
                <Icon :name="item.icon"></Icon>
                <span>{{ item.label }}</span>
              </div>
            </template>
            <a-menu-item v-for="menu in (item as any).children" :key="menu.key">{{ menu.label }}</a-menu-item>
          </a-sub-menu>
          <a-menu-item v-if="item.type === 'menuItem'" :key="item.key">
            <div class="router-item" style="display: flex; align-items: center; gap: 4px">
              <Icon :name="item.icon"></Icon>
              <span>{{ item.label }}</span>
            </div>
          </a-menu-item>
        </template>
      </a-menu>
    </div>
    <div class="sidebar-wrapper">
      <div class="sidebar-wrapper__inner">
        <div class="sidebar">
          <div class="logo">
            <img alt="Mastodon" class="logo logo--icon" :src="userInfo?.avatar || defaultAvatar" />
          </div>
          <div class="router-list">
            <a-menu @menu-item-click="menuItemClick" :default-selected-keys="[defaultRouteName]" :selected-keys="[defaultRouteName]" :auto-open-selected="true">
              <template v-for="item in menuOptions">
                <a-sub-menu v-if="item.type === 'subMenu'" :key="item.key">
                  <template #title>
                    <div class="router-item" style="display: flex; align-items: center; gap: 4px">
                      <Icon :name="item.icon"></Icon>
                      <span>{{ item.label }}</span>
                    </div>
                  </template>
                  <a-menu-item v-for="menu in (item as any).children" :key="menu.key">{{ menu.label }}</a-menu-item>
                </a-sub-menu>
                <a-menu-item v-if="item.type === 'menuItem'" :key="item.key">
                  <div class="router-item" style="display: flex; align-items: center; gap: 4px">
                    <Icon :name="item.icon"></Icon>
                    <span>{{ item.label }}</span>
                  </div>
                </a-menu-item>
              </template>
            </a-menu>
          </div>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <slot />
    </div>
    <ClientOnlyAModal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" simple>
      <template #title> {{ t('login.areYouSureYouWantToSignOut') }}</template>
    </ClientOnlyAModal>
  </div>
</template>

<style scoped lang="scss">
.nav-tab {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #d9e1e8;
  z-index: 3;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: #000;
  gap: 10px;
  overflow: hidden;
  display: none;
  .icon-logo {
    height: 40px;
  }
  .btn-box {
    margin-left: auto;
    font-size: 26px;
  }
}
.menu-mobile {
  position: fixed;
  inset: 0;
  z-index: 2;
  background-color: #fff;
  padding-top: 60px;
  display: none;
  .menu-item {
    padding: 20px;
  }
}
.wrapper {
  display: flex;
  .sidebar-wrapper {
    border-right: 1px solid #ebeef5;
    .sidebar-wrapper__inner {
      padding-left: 200px;
      overflow-y: auto;
      display: flex;
      height: 100%;
      justify-content: flex-end;
      .sidebar {
        padding: 0;
        pointer-events: auto;
        width: 240px;

        .logo {
          display: block;
          height: 100px;
          margin: 40px auto;
          width: 100px;
          border-radius: 10px;
        }
      }
    }
  }
  .content-wrapper {
    flex: 1 1 auto;
    width: 100%;
    max-width: 860px;
    .content {
      padding: 20px;
      padding: 50px 20px;
      max-width: calc(100% - 40px);
      .content__heading {
        margin-bottom: 45px;
        h2 {
          font-size: 24px;
          font-weight: 700;
          line-height: 36px;
        }
        .desc {
          margin-top: 30px;
          font-size: 17px;
          line-height: 22px;
        }
      }
    }
  }
}

@include respond('phone') {
  .nav-tab {
    display: flex;
  }
  .wrapper {
    flex-direction: column;
    padding-top: 60px;
    .sidebar-wrapper {
      display: none;
    }
    .menu-mobile {
      display: block;
    }
    .content-wrapper {
      .content {
        max-width: none;
      }
    }
  }
}
</style>
