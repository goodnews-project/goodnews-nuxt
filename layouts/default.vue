<script setup name="layout">
import RightPanel from './rightPanel.vue';
import { storeToRefs } from 'pinia';
import defaultAvatar from '@/assets/images/default-avatar.jpg';
import { computed } from 'vue';
import useScroll from '@/hooks/useScroll';
import { getNum } from '~/api/nav';
import { getUser, getToken } from '@/utils/auth';
const userStore = useUserStore();
const { t } = useI18n();

const loginModalStore = useLoginModalStore();
const modalStore = useModalStore();
const notificationsNum = useNotificationsNum();
const userInfo = getUser();
watchEffect(async () => {
  if (!loginModalStore.$state.isShowLogin && getUser().value) {
    if (process.client) {
      const data = await getNum();
      notificationsNum.value = data;
    }
  }
});

const route = useRoute();

const closeUserMenu = () => {
  showUserMenu.value = false;
};
const changePWD = () => {
  closeUserMenu();
  modalStore.openChangePwdModal();
};
const menuList = computed(() => {
  return [
    {
      name: 'home',
      label: t('layout.home'),
      path: '/',
      icon: 'mingcute:home-5-line',
      icon_active: 'mingcute:home-5-fill',
      isMobileActive: () => {
        const activeNames = ['home', 'public-common', 'public-local'];
        return activeNames.includes(route.name);
      },
    },
    {
      name: 'notification',
      label: t('layout.notification'),
      path: `/notifications`,
      icon: 'iconamoon:notification',
      icon_active: 'iconamoon:notification-fill',
      badge: notificationsNum.value.notifications,
      isShow: () => {
        return userInfo.value?.acct;
      },
    },
    {
      name: 'followRequests',
      label: t('followRequests.title'),
      path: `/followRequests`,
      icon: 'ri:user-follow-line',
      icon_active: 'ri:user-follow-fill',
      badge: notificationsNum.value.follow_requests,
      isShow: () => {
        return userInfo.value?.acct && notificationsNum.value?.follow_requests;
      },
      mobileShow: () => false,
    },
    {
      name: 'message',
      label: t('message.title'),
      path: `/message`,
      icon: 'mingcute:message-3-line',
      icon_active: 'mingcute:message-3-fill',
      badge: notificationsNum.value.direct_messages,
      isShow: () => {
        return userInfo.value?.acct;
      },
    },
    {
      name: 'bookmarks',
      label: t('bookmark.title'),
      path: `/bookmarks`,
      icon: 'material-symbols:bookmark-outline-rounded',
      icon_active: 'material-symbols:bookmark-rounded',
      isShow: () => {
        return userInfo.value?.acct;
      },
      mobileShow: () => false,
    },
    {
      name: 'acct',
      label: t('profile.title'),
      path: `/user/${userInfo.value?.acct}`,
      icon: 'iconamoon:profile',
      icon_active: 'iconamoon:profile-fill',
      isShow: () => {
        return userInfo.value?.acct;
      },
      isActive: (n) => {
        return route.params?.acct === userInfo.value?.acct && route.name === 'acct';
      },
      mobileShow: () => false,
    },
    {
      name: 'public',
      label: t('timeline.public'),
      path: '/public/common',
      icon: 'ph:globe-hemisphere-west-bold',
      icon_active: 'ph:globe-hemisphere-west-fill',
      isActive: () => {
        return route.name === 'public-common';
      },
      mobileShow: () => {
        return false;
      },
    },
    {
      name: 'public-local',
      label: t('timeline.local'),
      path: '/public/local',
      icon: 'material-symbols:interactive-space-outline',
      icon_active: 'material-symbols:interactive-space',
      mobileShow: () => {
        return false;
      },
    },
    {
      name: 'lists',
      label: t('list.title'),
      path: '/lists',
      icon: 'material-symbols-light:lists-rounded',
      icon_active: 'material-symbols:lists-rounded',
      isShow: () => {
        return userInfo.value?.acct;
      },
      mobileShow: () => {
        return false;
      },
    },
    {
      name: 'settings-profile',
      label: t('layout.preferences'),
      path: '/settings/profile',
      icon: 'tabler:settings',
      icon_active: 'tabler:settings-filled',
      divid: true,
      isShow: () => {
        return userInfo.value?.acct;
      },
      mobileShow: () => {
        return false;
      },
    },
    {
      name: 'about',
      label: t('about.title'),
      path: '/about',
      icon: 'mdi:information-outline',
      icon_active: 'mdi:information',
      mobileShow: () => {
        return false;
      },
    },
  ];
});

const drawerMenuList = computed(() => {
  const routerNames = ['home', 'bookmarks', 'acct', 'lists', 'settings-profile', 'about'];
  return routerNames;
});
const router = useRouter();
const showUserMenu = ref(false);
const goRouter = (path) => {
  closeUserMenu();
  router.push(path);
};

const clickToLogin = () => {
  loginModalStore.openLoginModal();
};
const logout = () => {
  closeUserMenu();
  userStore.logout();
  router.push('/');
};
const isLogin = computed(() => {
  return !!userInfo.value?.id;
});

const showRightPanel = computed(() => {
  const noShowRightPanelRoutes = ['message'];
  return !noShowRightPanelRoutes.includes(route.name);
});

onMounted(() => {
  const html = document.querySelector('html');
  useScroll().initScroll(html);

  if (!!route.query.login && !getUser().value) {
    loginModalStore.openLoginModal();
  }

  const isAccessed = localStorage.getItem('isAccessed');

  if (!userInfo.value?.username && route.name === 'home' && !isAccessed) {
    router.replace('/public/local');
    localStorage.setItem('isAccessed', true);
  }
});

const { subscribeNotification, initWebSocket } = useWebSocketManager();
initWebSocket();
onMounted(() => {
  subscribeNotification((event, newNotification) => {
    if (newNotification.type === 'follow_request') {
      notificationsNum.value.follow_requests += 1;
      return;
    }
    if (route.path !== '/notifications') {
      notificationsNum.value.notifications += 1;
    }
  });
});

import { getTweetEditor } from '@/utils/editor';
router.beforeEach((to, from, next) => {
  const noHaveEditor = ['message', 'settings-profile'];
  if (noHaveEditor.some((item) => item.includes(to.name))) {
    const editor = getTweetEditor();
    const text = editor?.getText();
    if (text) {
      const confirmed = window.confirm(t('editor.leaveWithoutSaving'));
      if (!confirmed) {
        next(false);
        return;
      }
    }
  }
  next();
});

router.beforeEach((to, from, next) => {
  const needLoginPaths = ['message', 'notification'];
  if (needLoginPaths.includes(to.name)) {
    if (!isLogin.value) {
      loginModalStore.openLoginModal();
      return;
    }
  }
  next();
});

// 监听浏览器的 beforeunload 事件
const confirmLeave = (event) => {
  const editor = getTweetEditor();
  const text = editor?.getText();
  if (text) {
    event.preventDefault();
    event.returnValue = '';
  }
};

onMounted(async () => {
  await nextTick();
  window.addEventListener('beforeunload', confirmLeave);
});

// 在组件销毁时移除 beforeunload 事件监听
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', confirmLeave);
});

// 记录当前滚动条位置
const showMobileHeader = ref(true);
const showMobileFooter = ref(true);
import mitt from '@/utils/mitt';

const handleSwipe = (e) => {
  if (e === 'up' || e === 'down') {
    const map = {
      up: true,
      down: false,
    };
    showMobileHeader.value = map[e];
    showMobileFooter.value = map[e];
  }
};

const htmlDom = ref(null);
onMounted(async () => {
  htmlDom.value = document.querySelector('html');
  await nextTick();
  // 每次滚动时都刷新滚动条位置
});

const showSendBtn = computed(() => {
  const routerNames = ['home', 'search', 'notification', 'public-common', 'public-local'];
  return routerNames.some((name) => name === route.name);
});

const showLeftSlide = ref(false);
import { getUserInfo } from '@/api/base';
const leftSildeLoading = ref(false);
const openLeftSlide = async () => {
  showLeftSlide.value = true;
  // 重新获取数据
  if (!userInfo.value.acct) return;
  leftSildeLoading.value = true;
  const { data } = await getUserInfo(userInfo.value.acct).finally(() => {
    leftSildeLoading.value = false;
  });
  const resultObj = {};
  for (const key in data.value.account) {
    if (Object.prototype.hasOwnProperty.call(userInfo.value, key)) {
      resultObj[key] = data.value.account[key];
    }
  }
  userInfo.value = resultObj;
};

const goTop = () => {
  if (showLeftSlide.value) showLeftSlide.value = false;

  openDevTools();
};

const showBackTop = computed(() => {
  const showRouters = ['home', 'public-common', 'public-local'];
  return showRouters.includes(route.name);
});

let clickCount = 0;
let devtoolsTimer = null;
const openDevTools = () => {
  clickCount++;
  if (clickCount >= 5) {
    console.log('打开调试器');
    clearTimeout(devtoolsTimer);
    clickCount = 0;
    new VConsole();
  } else {
    devtoolsTimer = setTimeout(() => {
      clickCount = 0;
    }, 1000);
  }
};

const mobileFooterList = computed(() => {
  const routerList = menuList.value.filter((item) => {
    return (item.mobileShow ? item.mobileShow() : true) && (item.isShow ? item.isShow() : true);
  });

  if (routerList.length === 1) {
    return [];
  }
  return routerList;
});

const backTopTarget = (e) => {
  if (!showMobileFooter.value) showMobileFooter.value = true;
};
const { logo } = useLogo();
</script>

<template>
  <div class="layout" :class="{ hideHeader: !showMobileFooter }" v-swipe="handleSwipe">
    <div class="mobile-header" :class="{ hide: !showMobileFooter }">
      <div class="nav-tab">
        <div class="userinfo" @click="openLeftSlide">
          <img :src="userInfo?.avatar || defaultAvatar" />
        </div>
        <div class="logo" @click="goTop">
          <img :src="logo" alt="" />
        </div>
        <div class="btn-handle">
          <nuxt-link class="nav-nuxt-link" style="font-size: 20px; color: rgb(var(--gray-6))" to="/search">
            <Icon name="mingcute:search-line" />
          </nuxt-link>
          <template v-if="isLogin">
            <nuxt-link class="nav-nuxt-link" style="font-size: 20px; color: rgb(var(--gray-6))" to="/settings/profile">
              <Icon name="mingcute:settings-4-fill" />
            </nuxt-link>
          </template>
          <template v-else>
            <a-button type="primary" @click="clickToLogin">{{ t('login.login') }}</a-button>
          </template>
        </div>
      </div>
    </div>
    <div class="layout-container">
      <div class="menu-area">
        <div class="menu-panel">
          <div class="menu-panel_logo">
            <img :src="logo" alt="" />
          </div>
          <div class="menu-routerlist">
            <template v-for="item in menuList">
              <div class="menu-panel_divid" v-if="item.divid"></div>
              <nuxt-link
                :to="item.path"
                class="menu-panel_link"
                v-if="item.isShow ? item.isShow() : true"
                :class="{
                  'menu-panel_link-active': item.isActive ? item.isActive(1) : route?.name?.includes(item.name),
                }"
              >
                <client-only>
                  <div class="menu-panel_link-icon">
                    <Icon :name="item.isActive?.() || route.name?.includes(item.name) ? item.icon_active : item.icon" />
                    <a-badge class="menu-panel_link-icon_badge" :max-count="99" :count="item.badge || 0" style="--danger-6: var(--arcoblue-6)"> </a-badge>
                  </div>
                </client-only>
                <div class="menu-panel_link-name">
                  {{ item.label }}
                </div>
              </nuxt-link>
            </template>
          </div>

          <client-only>
            <div class="menu-panel-userInfo">
              <template v-if="!userInfo?.acct">
                <div class="menu-panel-login">
                  <a-button type="outline" shape="round" @click="goRouter('/register')"> {{ t('login.createAccount') }}</a-button>
                  <a-button type="primary" shape="round" @click="clickToLogin">{{ t('login.clickToLogin') }}</a-button>
                </div>
              </template>
              <template v-else>
                <div class="menu-panel-user">
                  <a-trigger
                    position="top"
                    auto-fit-position
                    auto-fit-popup-width
                    :unmount-on-close="false"
                    trigger="click"
                    :popup-translate="[0, -10]"
                    v-model:popupVisible="showUserMenu"
                  >
                    <div class="menu-panel-user-block">
                      <a-image class="round" width="40" height="40" round :src="userInfo?.avatar || defaultAvatar" :preview="false" />
                      <div>{{ userInfo?.acct }}</div>
                      <Icon style="margin-left: auto" name="material-symbols:more-horiz" />
                    </div>
                    <template #content>
                      <div class="user-menu-basic">
                        <div class="user-menu-item user-menu-header">
                          <a-image class="round" width="40" height="40" round :src="userInfo?.avatar || defaultAvatar" :preview="false" />
                          <div>{{ userInfo?.acct }}</div>
                        </div>
                        <div class="user-menu-item" @click="goRouter('/mutes')">
                          <div class="user-menu-item_text">{{ t('login.mutedUser') }}</div>
                        </div>
                        <div class="user-menu-item" @click="goRouter('/blocks')">
                          <div class="user-menu-item_text">{{ t('login.blockedUser') }}</div>
                        </div>
                        <div class="user-menu-item" @click="logout">
                          <div class="user-menu-item_text">{{ t('login.signOut') }}</div>
                        </div>
                        <div class="user-menu-item" @click="changePWD">
                          <div class="user-menu-item_text">{{ t('login.changePassword') }}</div>
                        </div>
                      </div>
                    </template>
                  </a-trigger>
                </div>
              </template>
            </div>
          </client-only>
        </div>
      </div>
      <div class="main-area">
        <slot />
      </div>
      <client-only>
        <div class="panel-area" v-if="showRightPanel">
          <div class="panel-container">
            <RightPanel></RightPanel>
          </div>
        </div>
      </client-only>
    </div>

    <!-- 手机端底部导航 -->
    <client-only>
      <div class="mobile-footer" :class="{ hide: !showMobileFooter }">
        <div class="mobile-footer-top">
          <!-- 手机端底部左下角--返回顶部 -->
          <div class="mobile-handle-backtop" v-show="showBackTop">
            <a-back-top :target-container="htmlDom" style="left: 20px; bottom: 30px" :visible-height="200" @click="backTopTarget" />
          </div>
          <!-- 手机端底部按钮--发推 -->
          <div class="mobile-handle-btn" :class="{ hide: !showMobileFooter }">
            <!-- 在固定的某些路由下显示此按钮 -->
            <template v-if="showSendBtn">
              <nuxt-link class="mobile-handle-send" v-if="isLogin" to="/send">
                <div class="icon">
                  <Icon name="ri:quill-pen-fill" />
                </div>
              </nuxt-link>
              <nuxt-link class="mobile-handle-send" v-else @click="clickToLogin">
                <div class="icon">
                  <Icon name="ri:quill-pen-fill" />
                </div>
              </nuxt-link>
            </template>
          </div>
        </div>

        <div class="mobile-router-frame" v-if="mobileFooterList.length">
          <template v-for="item in mobileFooterList">
            <div
              class="mobile-router-item safe-area-padding"
              :class="{
                'menu-panel_link-active': item.isActive ? item.isActive(1) : route?.name?.includes(item.name),
              }"
            >
              <nuxt-link class="menu-router-link" :to="item.path">
                <Icon :name="item.isMobileActive?.() || item.isActive?.() || route.name?.includes(item.name) ? item.icon_active : item.icon" />
                <a-badge class="menu-panel_link-icon_badge" :max-count="99" :count="item.badge || 0" style="--danger-6: var(--arcoblue-6)"> </a-badge>
              </nuxt-link>
            </div>
          </template>
        </div>
      </div>
    </client-only>
    <client-only>
      <a-drawer
        :width="300"
        :height="340"
        v-model:visible="showLeftSlide"
        placement="left"
        unmountOnClose
        :header="false"
        :footer="false"
        class="silde-drawer"
        esc-to-close
      >
        <div class="mobile-slide">
          <div class="mobile-slide-header" v-if="isLogin">
            <nuxt-link class="mobile-slide-header-avatar" :to="`/user/${userInfo.acct}`" @click="goTop">
              <img :src="userInfo?.avatar || defaultAvatar" />
            </nuxt-link>
            <nuxt-link :to="`/user/${userInfo.acct}`" @click="goTop">
              <div class="mobile-slide-header-name">{{ userInfo.display_name }}</div>
              <div class="mobile-slide-header-acct">@{{ userInfo.acct }}</div>
            </nuxt-link>
            <div class="mobile-slide-header-follow-list">
              <nuxt-link class="follow-item" :to="`/user/${userInfo.acct}?tab=tweets`" @click="goTop">
                <template v-if="leftSildeLoading">
                  <a-spin />
                </template>
                <template v-else>
                  <div class="follow-item-value">{{ userInfo?.status_count || 0 }}</div>
                </template>
                <div class="follow-item-label">{{ t('public.tweet') }}</div>
              </nuxt-link>
              <nuxt-link class="follow-item" :to="`/user/${userInfo.acct}/follower`" @click="goTop">
                <template v-if="leftSildeLoading">
                  <a-spin />
                </template>
                <template v-else>
                  <div class="follow-item-value">{{ userInfo?.followers_count || 0 }}</div>
                </template>
                <div class="follow-item-label">{{ t('account.follower') }}</div>
              </nuxt-link>
              <nuxt-link class="follow-item" :to="`/user/${userInfo.acct}/following`" @click="goTop">
                <template v-if="leftSildeLoading">
                  <a-spin />
                </template>
                <template v-else>
                  <div class="follow-item-value">{{ userInfo?.following_count || 0 }}</div>
                </template>
                <div class="follow-item-label">{{ t('account.following') }}</div>
              </nuxt-link>
            </div>
          </div>
          <div class="mobile-slide-content">
            <template v-for="item in menuList">
              <div class="menu-panel_divid" v-if="item.divid"></div>
              <nuxt-link
                :to="item.path"
                class="menu-panel_link"
                v-if="(item.isShow ? item.isShow() : true) && drawerMenuList.includes(item.name)"
                :class="{
                  'menu-panel_link-active': item.isActive ? item.isActive(1) : route?.name?.includes(item.name),
                }"
                @click="goTop"
              >
                <div class="menu-panel_link-icon">
                  <Icon :name="item.isActive?.() || route.name?.includes(item.name) ? item.icon_active : item.icon" />
                  <a-badge class="menu-panel_link-icon_badge" :max-count="99" :count="item.badge || 0" style="--danger-6: var(--arcoblue-6)"> </a-badge>
                </div>
                <div class="menu-panel_link-name">
                  {{ item.label }}
                </div>
              </nuxt-link>
            </template>
          </div>
          <AboutInstructions :showData="['version']"></AboutInstructions>
        </div>
      </a-drawer>
    </client-only>
  </div>
</template>
<style lang="scss" scoped>
.round {
  border-radius: 50%;
}

.mobile-header {
  display: flex;
  width: 100%;
  border-bottom: 1px solid var(--color-neutral-3);
  display: none;
  position: fixed;
  top: 0;
  z-index: 20;
  background: var(--color-background);
  transition: all 0.2s ease-out;
  .nav-tab {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    .userinfo {
      width: 34px;
      margin-right: 20px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100px;
      font-size: 20px;
      border-radius: 100px;
      overflow: hidden;
    }

    .logo {
      height: 40px;
      img {
        object-fit: contain;
      }
    }

    .btn-handle {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
  .nav-nuxt-link {
    margin-left: 10px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100px;
    &:active {
      background: rgba(var(--gray-6-rgb), 0.1);
    }
  }
}

.layout {
  display: flex;
  height: 100%;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
  align-items: center;

  .layout-container {
    flex: 1;
    max-width: min(100%, 1200px);
    width: min(100%, 1200px);
    display: flex;
    gap: 16px;
    justify-content: center;
  }

  .menu-area {
    display: flex;
    height: 100%;
    justify-content: flex-start;
    min-width: 285px;
    overflow: hidden;
    width: 285px;

    .menu-panel {
      position: fixed;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 10px;
      height: 100%;
      width: 300px;
      padding: 10px;
      .menu-panel_logo {
        display: flex;
        align-items: center;
        height: 60px;
        font-size: 160px;
        padding-left: 16px;
        img {
          width: 80%;
          object-fit: contain;
        }
      }
      .menu-routerlist {
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex-shrink: 1;
        min-height: 0;
        overflow-y: auto;
      }

      .menu-panel-userInfo {
        width: 100%;
        margin-top: auto;
        .menu-panel-login {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .menu-panel-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: 100px;
          cursor: pointer;

          &:hover {
            background-color: var(--color-neutral-3);
          }
        }
      }

      .menu-panel-user-block {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
      }
    }
  }

  .main-area {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    // 文字超出换行
    word-break: break-all;
    border-left: 1px solid var(--color-fill-3);
    border-right: 1px solid var(--color-fill-3);
    flex: 1;
    flex-shrink: 0;
    min-width: 0;
  }

  .panel-area {
    --panel-width: 300px;
    display: flex;
    height: 100%;
    justify-content: flex-end;
    min-width: var(--panel-width);
    overflow: hidden;
    pointer-events: none;

    .panel-container {
      position: fixed;
      width: var(--panel-width);
      pointer-events: all;
      height: 100vh;
    }
  }
}

.mobile-footer {
  display: none;
  width: 100%;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  left: 0;
  flex-direction: column;
  .mobile-footer-top {
    padding: 10px;
    display: flex;
    padding-bottom: 20px;
    justify-content: space-between;
    align-items: flex-end;
    :deep(.arco-back-top) {
      position: inherit;
    }
  }
  .mobile-router-frame {
    width: 100%;
    display: flex;
    padding: 10px;
    border-top: 1px solid var(--color-border-2);
    transition: all 0.2s ease-out;
    background: var(--color-background);
    z-index: 20;
  }
  .mobile-router-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    .menu-router-link {
      --size: 46px;
      width: var(--size);
      height: var(--size);
      @extend %flex-col-center;
      align-items: center;
      border-radius: 100px;
      position: relative;
      // border: 1px solid red;
      // 鼠标点击时的效果
      &:active {
        background: rgba(15, 20, 25, 0.1);
      }
      .menu-panel_link-icon_badge {
        position: absolute;
        top: 0px;
        right: 0px;
      }
    }
  }
}

// 手机端底部- 返回顶部按钮
.mobile-handle-backtop {
  display: none;
  .arco-back-top {
    width: fit-content;
  }
}

// 手机端-底部悬浮按钮--发推等功能
.mobile-handle-btn {
  display: none;
  &.hide {
    opacity: 0.339623;
  }
  .mobile-handle-send {
    width: 50px;
    height: 50px;
    background: rgb(var(--arcoblue-6));
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100px;
    color: #fff;
    font-size: 24px;
    .icon {
      width: 1em;
      height: 1em;
      display: flex;
      @extend %flex-col-center;
    }
  }
}

// 手机端的侧拉窗
.mobile-slide {
  position: fixed;
  left: 0;
  width: 300px;
  height: 100%;
  top: 0;
  z-index: 21;
  padding: 20px;
  .mobile-slide-header {
    padding-bottom: 10px;
    .mobile-slide-header-avatar {
      font-size: 30px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100px;
      background: var(--color-neutral-3);
      font-size: 24px;
      color: var(--color-text-2);
      border-radius: 100px;
      overflow: hidden;
    }
    .mobile-slide-header-name {
      font-weight: bold;
      font-size: 16px;
    }
    .mobile-slide-header-acct {
      color: rgb(var(--gray-6));
    }
    .mobile-slide-header-follow-list {
      display: inline-flex;
      gap: 20px;
      .follow-item {
        display: flex;
        gap: 4px;
        align-items: center;
        --primary-6: var(--gray-6);
        .follow-item-value {
          font-size: 18px;
        }
        .follow-item-label {
          color: rgb(var(--gray-6));
          font-size: 14px;
        }
      }
    }
  }
  .mobile-slide-content {
    .menu-panel_link {
      padding-left: 10px;
      color: var(--color-text-1);
      &-active {
        color: var(--color-text-1);
        background: rgb(var(--gray-3));
      }
    }
    .menu-panel_divid {
      display: none;
    }
  }
}
@include respond('phone') {
  .mobile-handle-backtop {
    display: block;
  }
  .mobile-handle-btn {
    display: block;
  }
  .mobile-header {
    display: flex;
    &.hide {
      top: -60px;
    }
  }

  .layout {
    --header-height: 60px;
    padding-top: var(--header-height);
    padding-bottom: 60px;
    transition: all 0.2s ease-out;
    &.hideHeader {
      --header-height: 0px;
    }
    .layout-container {
      width: 100%;
      gap: 0;
    }

    .menu-area {
      display: none;
    }
    .panel-area {
      display: none;
    }
  }

  .mobile-footer {
    display: flex;
    &.hide {
      opacity: 0.3;
    }
  }
}
</style>

<style lang="scss">
.user-menu-basic {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-medium);
  padding: 4px 0;
  background-color: var(--color-background);

  .user-menu-item {
    padding: 10px;
    cursor: pointer;

    &:hover {
      background-color: var(--color-neutral-3);
    }

    & + .user-menu-item {
      border-top: 1px solid var(--color-fill-3);
    }

    .user-menu-item_text {
      color: var(--color-text-1);
    }

    &.user-menu-header {
      display: flex;
      gap: 10px;
      align-items: center;
    }
  }
}

.menu-area {
  .menu-panel_divid {
    @extend %menu-panel_divid;
  }
  .menu-panel_link {
    @extend %menu-panel_link;
  }
  .menu-panel_link:hover {
    @extend %menu-panel_link_hover;
  }
  .menu-panel_link-active {
    @extend %menu-panel_link-active;
  }
  .menu-panel_link-icon {
    @extend %menu-panel_link-icon;
  }
  .menu-panel_link-icon_badge {
    @extend %menu-panel_link-icon_badge;
  }
}

.silde-drawer {
  .menu-panel_divid {
    @extend %menu-panel_divid;
  }
  .menu-panel_link {
    @extend %menu-panel_link;
  }
  .menu-panel_link:hover {
    @extend %menu-panel_link_hover;
  }
  .menu-panel_link-active {
    @extend %menu-panel_link-active;
  }
  .menu-panel_link-icon {
    @extend %menu-panel_link-icon;
  }
  .menu-panel_link-icon_badge {
    @extend %menu-panel_link-icon_badge;
  }
}
%menu-panel_divid {
  width: 70%;
  height: 1px;
  background: var(--color-neutral-3);
}

%menu-panel_link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 80px;
  cursor: pointer;
  transition: all 0.3s;
  padding-right: 80px;
  padding-left: 14px;
  font-size: 20px;
  color: var(--color-text-1);
}
%menu-panel_link-icon {
  display: flex;
  align-items: center;
  font-size: 22px;
  position: relative;
}
%menu-panel_link-icon_badge {
  position: absolute;
  top: -8px;
  right: -8px;
}
%menu-panel_link_hover {
  background-color: rgb(var(--gray-2));
}

%menu-panel_link-active {
  background-color: rgb(var(--gray-2));
  font-weight: bold;
}
</style>
