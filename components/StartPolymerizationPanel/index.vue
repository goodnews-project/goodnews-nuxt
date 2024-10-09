<script setup>
import defaultAvatar from '@/assets/images/default-avatar.jpg';
import CustomImage from '@/components/CustomImage/index.vue';
import { getInstance } from '@/api/setting';
import { getToken } from '@/utils/auth';

const modalStore = useModalStore();
const changePWD = () => {
  modalStore.openChangePwdModal();
};
import SendTweet from '@/components/Tweet/SendTweet.vue';
const { t } = useI18n();

const renderImg = computed(() => {
  return instanceData.value?.contact?.account.avatar || defaultAvatar;
});

const userStore = useUserStore();

const isLogin = computed(() => {
  const token = getToken();
  return !!token.value;
});
const userInfo = computed(() => {
  return userStore.userInfo || {};
});
const renderAvatar = computed(() => {
  if (userInfo.value?.avatar) {
    return userInfo.value.avatar;
  }
  return defaultAvatar;
});
const router = useRouter();
const btnOptions = [
  { label: `${t('layout.editProfile')}`, value: 'edit' },
  { label: `${t('layout.preferences')}`, value: 'setting' },
  { label: `${t('login.mutedUser')}`, value: 'shielded' },
  { label: `${t('login.blockedUser')}`, value: 'blocks' },
  { label: `${t('login.signOut')}`, value: 'logout' },
  { label: `${t('login.changePassword')}`, value: 'changePassword' },
];

const handleChange = (e) => {
  const map = {
    edit: () => {
      router.push('/settings/profile');
    },
    setting: () => {
      router.push('/settings/profile');
    },
    shielded: () => {
      router.push('/mutes');
    },
    blocks: () => {
      router.push('/blocks');
    },
    logout: () => {
      useUserStore().logout();
    },
    changePassword: () => {
      changePWD();
    },
  };
  map[e] && map[e]();
};

const goRouter = (path) => {
  router.push(path);
};

const goProfile = () => {
  const path = `/user/${userInfo.value.acct}`;
  goRouter(path);
};
const { data: instanceData } = await getInstance();
const activeMonth = computed(() => {
  const num = instanceData.value?.usage?.users?.active_month || 0;
  if (num > 10000) {
    return `${(num / 10000).toFixed(1)} K`;
  }
  return num;
});
</script>
<template>
  <div class="startFeature-frame">
    <template v-if="isLogin">
      <div class="header">
        <div class="user-info">
          <div class="user-photo">
            <ClientOnly>
              <img :src="renderAvatar" @click="goProfile" />
            </ClientOnly>
          </div>
          <div class="user-text">
            <div class="user-name" @click="goProfile">
              {{ userInfo?.display_name || userInfo?.username }}
            </div>
            <div class="user-desc" @click="goRouter('/settings/profile')">
              {{ $t('layout.editProfile') }}
            </div>
          </div>
        </div>
        <div class="menu">
          <client-only>
            <a-dropdown @select="handleChange" scroll-to-close :popup-max-height="false">
              <a-button>
                <Icon name="mingcute:menu-line"></Icon>
              </a-button>
              <template #content>
                <div class="menu-content">
                  <a-doption v-for="item in btnOptions" :key="item.value" :value="item.value">{{ item.label }}</a-doption>
                </div>
              </template>
            </a-dropdown>
          </client-only>
        </div>
      </div>
      <div class="editor-content">
        <SendTweet></SendTweet>
      </div>
    </template>
    <template v-else>
      <div class="noLogin-box">
        <div class="startFeature-content container">
          <div class="title">{{ instanceData?.title }}</div>
          <div class="img-box">
            <CustomImage v-if="instanceData?.thumbnail?.url" :src="instanceData?.thumbnail?.url"></CustomImage>
          </div>
          <div class="desc">{{ instanceData?.description }}</div>
        </div>
        <client-only>
          <div class="statistics-form">
            <div class="form-item">
              <div class="form-item-label">{{ $t('layout.siteAdmin') }}</div>
              <div class="form-item-value" v-if="instanceData?.contact?.account">
                <UserCard :account="instanceData?.contact?.account">
                  <div class="user">
                    <div class="user-photo">
                      <img :src="renderImg" />
                    </div>
                    <div class="user-text">
                      <div class="user-name">
                        {{ instanceData?.contact?.account.display_name || instanceData?.contact?.account.username }}
                      </div>
                      <div class="user-desc">{{ $t('layout.admin') }}</div>
                    </div>
                  </div>
                </UserCard>
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-label">{{ $t('layout.siteStatistics') }}</div>
              <div class="form-item-value">
                <div class="text-value">{{ activeMonth }}</div>
                <div class="text-desc">{{ $t('layout.activeUser') }}</div>
              </div>
            </div>
          </div>
        </client-only>
        <a-button class="noLogin-btn_knowMore" long @click="goRouter('/about')">
          <nuxt-link to="/about">{{ $t('layout.knowMore') }}</nuxt-link>
        </a-button>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  .img-box {
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .title {
    font-size: 20px;
    font-weight: bold;
    color: var(--color-text-1);
    margin-bottom: 20px;
  }

  .statistics-form {
    --line-color: var(--color-neutral-3);
    display: flex;
    width: 100%;
    gap: 10px;
    border-radius: 5px;
    margin-top: 10px;
    border: 1px solid var(--line-color);
    .form-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      padding: 20px;
      gap: 10px;
      &:last-child {
        position: relative;
        &::before {
          content: ' ';
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          height: 80%;
          width: 1px;
          background: var(--line-color);
        }
      }

      .form-item-label {
        font-size: 14px;
        color: var(--el-text-color-primary);
      }
      .form-item-value {
        display: flex;
        flex-direction: column;
        .user {
          display: flex;
          gap: 10px;
          align-items: center;
          .user-photo {
            width: 36px;
            height: 36px;
            border-radius: 4px;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .user-text {
            .user-name {
              font-weight: bold;
              font-size: 14px;
              color: var(--color-text-1);
            }
            .user-desc {
              font-size: 12px;
              color: var(--color-text-2);
            }
          }
        }
        .text-value {
          color: var(--color-text-1);
          font-weight: bold;
        }
      }
    }
  }
  .custom-collapse {
    width: 100%;
    margin-top: 20px;
    .collapse-content {
      width: 100%;
      padding: 10px 20px;
    }
    .wrap {
      border-bottom: 1px solid var(--color-border-1);
      padding: 16px 16px 16px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .right {
        width: 2.5rem;
        height: 2.5rem;
        margin-right: 0.75rem;
        background-color: var(--arcoblue-6);
        border-radius: 50%;

        display: flex;
        justify-content: center;
        align-items: center;
      }

      .left {
        flex: 1;
      }
    }
  }
}
.startFeature-frame {
  width: 100%;
  background-color: var(--color-background);
  border-radius: 10px;
  box-sizing: border-box;
  .header {
    display: flex;
    align-items: center;
    .user-info {
      flex: 1;
      display: flex;
      gap: 10px;
      .user-photo {
        cursor: pointer;
        width: 50px;
        height: 50px;
        border-radius: 4px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .user-text {
        cursor: pointer;
      }
    }
    .menu {
      width: 50px;
      height: 50px;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 36px;
    }
  }
  .editor-content {
    width: 100%;
    border: 1px solid var(--color-neutral-4);
    border-radius: 4px;
    margin-top: 20px;
  }
  .startFeature-title {
    font-size: 20px;
    font-weight: bold;
    color: var(--color-text-1);
    margin-bottom: 20px;
  }
  .startFeature-content {
    font-size: 14px;
    color: var(--color-text-3);
    line-height: 1.5;
    a {
      text-decoration: underline;
      &:hover {
        text-decoration: none;
      }
    }
  }
  .statistics-form {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    .form-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      width: 50%;
      flex-shrink: 0;
      .form-item-label {
        font-size: 14px;
        color: var(--el-text-color-primary);
      }
      .form-item-value {
        display: flex;
        flex-direction: column;
        .user {
          display: flex;
          gap: 10px;
          align-items: center;
          .user-photo {
            cursor: pointer;
            width: 36px;
            height: 36px;
            border-radius: 4px;
            overflow: hidden;
            flex-shrink: 0;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .user-text {
            cursor: pointer;
            overflow: hidden;
            white-space: nowrap;
            .user-name {
              font-size: 14px;
              color: var(--color-text-1);
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .user-desc {
              font-size: 12px;
              color: var(--color-text-2);
            }
          }
        }
        .text-value {
          font-size: 14px;
          color: var(--color-text-1);
        }
        .text-desc {
          font-size: 12px;
          color: var(--color-text-2);
        }
      }
    }
  }
  .noLogin-btn_knowMore {
    margin-top: 20px;
  }
}
</style>
