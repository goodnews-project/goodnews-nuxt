<script setup lang="ts">
import TweetMessages from '@/components/Tweet/TweetMessages.vue';
import { useUserStore } from '@/stores/user';
import useLoginPipe from '@/hooks/useLoginPipe';
import defaultAvatar from '@/assets/images/default-avatar.jpg';
import mitt from '@/utils/mitt';

import { manualFetch } from '@/api/base.js';
import { followUser, unfollowUser, toggleNewStatusNotification } from '~/api/account';
import { useRouterStore } from '~/stores/router';
import Scroll from '@/components/Account/Scroll.vue';
import dayjs from 'dayjs';

definePageMeta({
  name: 'acct',
});

defineOptions({
  name: 'acct',
});

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const acct = route.params.acct;

const routerStore = useRouterStore();

const { accountInfo: account } = storeToRefs(routerStore);

const userStore = useUserStore();

const userId = computed(() => {
  return userStore.userInfo?.id;
});
const loginPipe = useLoginPipe();

const handleCommand = async (key) => {
  // 打开原始页面的操作不需要验证是否登录
  if (key === 'origin') {
    window.open(account.value.url, '_blank');
    return;
  }
  // 是否登录
  if (!userId.value) {
    alert(t('login.login'));
    return;
  }
};

// 用户头像
const userAvatar = computed(() => {
  return account.value?.avatar || defaultAvatar;
});
// 背景图片
const userBanner = computed(() => {
  let style = {};
  if (account.value?.profile_image) {
    style = {
      backgroundImage: `url(${account.value?.profile_image})`,
    };
  }
  return style;
});

// 是否是本人的信息页面
const isSelf = computed(() => {
  return userStore.userInfo?.acct == acct;
});

// 是否打开编辑资料的弹窗
const editInformation = () => {
  router.push(`/settings/profile`);
};

const followLoading = ref(false);
async function follow() {
  try {
    followLoading.value = true;

    await followUser(account.value.id);

    account.value.follower = {
      notify: 0,
    };
    account.value.followers_count++;
    followLoading.value = false;
  } catch (err) {
    followLoading.value = false;
  }
}

async function unFollow() {
  followLoading.value = true;

  await unfollowUser(account.value.id);

  followLoading.value = false;
  account.value.follower = false;
  account.value.followers_count--;
}

const message = (toId: string) => {
  const isLoginFlag = loginPipe();
  if (isLoginFlag) {
    router.push(`/message/${toId}`);
  }
};

const currentTab = computed(() => route.query?.tab || 'tweets');

const getUser = useAsyncData(`user-info-${acct}`, async () => {
  if (account.value.acct !== acct) {
    const res = await manualFetch(`/_api/v1/account/${acct}`);
    return res;
  }

  return { account: unref(account) };
});

let controller = new AbortController();
const [{ data: userInfo }, { data, loading: tweetLoading, clear, maxId, refresh: refreshTweetList }] = await Promise.all([
  getUser,
  useList(
    `user-list-${acct}`,
    async ({ max_id }: { max_id: string }) => {
      controller.abort();
      controller = new AbortController();
      const res = await manualFetch(`/_api/v1/statuses/${acct}`, {
        params: !!max_id ? { max_id, type: currentTab.value } : { type: currentTab.value },
        signal: controller.signal,
      });

      return res;
    },
    {
      watch: [currentTab],
    }
  ),
]);

router.beforeEach((to, from, next) => {
  if (to.query.tab !== from.query.tab) {
    controller.abort();
  }
  next();
});

const pageType = computed(() => {
  const typeMap = {
    tweets: t('public.tweet'),
    with_replies: t('public.tweetAndReplies'),
    media: t('public.media'),
    likes: t('public.like'),
  };
  return typeMap[currentTab.value];
});
useHead({
  title: `${userInfo.value.account?.display_name || acct} ${t('common.of')}${pageType.value} - ${acct}`,
  meta: [
    {
      name: 'description',
      content: account.value?.note_rendered?.replace(/<[^>]+>/g, ''),
    },
  ],
});

watchEffect(() => {
  // 刷新页面title
  useHead({
    title: `${userInfo.value.account?.display_name || acct} ${t('common.of')}${pageType.value} - ${acct}`,
  });
});

// 是否允许加载更多
const tweetFinished = computed(() => {
  let flag = false;
  if (data.value?.currentLength < 30) {
    flag = true;
  }
  return flag;
});

// 重新渲染用户头像和背景图片
const editProfileSaveCb = async () => {
  const isSelf = userStore.userInfo?.acct === acct;
  if (isSelf) {
    account.value = userStore.userInfo;
  }
};
onMounted(async () => {
  mitt.on('editProfileSave', editProfileSaveCb);
  const userInfo = await manualFetch(`/_api/v1/account/${acct}`);
  account.value = userInfo.account;
});
onUnmounted(() => {
  mitt.off('editProfileSave', editProfileSaveCb);
});

watchEffect(() => {
  account.value = userInfo.value.account;
});

const tweetList = computed(() => {
  return data.value?.list || [];
});

const getList = () => {
  if (tweetList.value.length > 0) {
    maxId.value = tweetList.value[tweetList.value.length - 1]?.id || '';
  }
};

provide('isShowPin', true);

const tweetUpdate = (e: any) => {
  const item = tweetList.value.find((item: any) => item.id === e.id);
  if (item) {
    Object.assign(item, e);
  }
};
// 隐藏当前推文
const hideTweet = (index: number) => {
  if (index > -1) {
    tweetList.value.splice(index, 1);
  }
};
const tabList = [
  { key: 'tweets', name: t('public.tweet') },
  { key: 'with_replies', name: t('public.tweetAndReplies') },
  { key: 'media', name: t('public.media') },
  { key: 'likes', name: t('public.like') },
];
const TweetMessagesRef = ref<any>(null);

const toToggleNav = () => {
  clear();

  maxId.value = '';
};

onActivated(() => {
  const { data: userInfo } = useNuxtData(`user-info-${acct}`);

  account.value = userInfo.value?.account;
});

const toggleNotify = async (notify: number) => {
  await toggleNewStatusNotification(acct, notify);
  account.value.follower.notify = notify;
};
</script>

<template>
  <div class="pages">
    <PageHeader>{{ account.display_name || account.username }}</PageHeader>
    <section>
      <div class="bannerImage" :style="userBanner"></div>
      <div class="userinfo-block">
        <div class="userinfo-line" style="position: relative; align-items: flex-end">
          <div style="height: 0">
            <div class="avatar-img">
              <a-image :src="userAvatar" :preview="false" width="100%" height="100%" />
            </div>
          </div>
          <div class="right">
            <a-button shape="circle" v-if="!isSelf" @click="message(account.id)">
              <Icon name="mingcute:message-4-fill" />
            </a-button>
            <template v-if="account.follower">
              <a-tooltip :content="t('account.notifyWhenPost', { notifyWhenPost: account.display_name })" v-if="account.follower?.notify === 0">
                <a-button shape="circle" @click="toggleNotify(1)">
                  <Icon name="ion:notifications-outline" />
                </a-button>
              </a-tooltip>
              <a-tooltip :content="t('account.cancelNotifyWhenPost', { cancelNotifyWhenPost: account.display_name })" v-if="account.follower?.notify === 1">
                <a-button shape="circle" @click="toggleNotify(0)">
                  <Icon name="ion:notifications-sharp" />
                </a-button>
              </a-tooltip>
            </template>
            <a-button shape="round" v-if="isSelf" @click="editInformation">{{ t('account.editProfile') }} </a-button>
            <a-button @click="follow" v-else-if="!account.follower" :loading="followLoading" type="primary">{{ t('account.following') }} </a-button>
            <a-button @click="unFollow" v-else :loading="followLoading">{{ t('account.unFollow') }} </a-button>

            <a-dropdown trigger="click" @select="handleCommand" position="br" v-if="account.url">
              <a-button type="text" shape="circle">
                <Icon name="mingcute:more-2-fill" />
              </a-button>
              <template #content>
                <a-doption value="origin">
                  <div style="display: flex; align-items: center; gap: 10px">
                    <Icon name="ph:link-simple-bold" />
                    {{ t('tweet.openOriginPage') }}
                  </div>
                </a-doption>
              </template>
            </a-dropdown>
          </div>
        </div>
        <div class="userinfo-line">
          <div class="username">
            <p v-account-name="account">
              {{ account.display_name || account.username }}
            </p>
            <span v-show="account.actor_type === 5 || account.actor_type === '5'" class="boot-btn">{{ t('account.robot') }}</span>
            <span v-show="account.is_sensitive === 1" class="boot-btn">
              <Icon name="ion:warning-outline" />
              {{ t('account.sensitiveContent') }}
            </span>
          </div>
          <div class="account-acct-area">
            <p>@{{ acct }}</p>
          </div>
          <ClientOnly>
            <div class="account-acct-area">
              <p v-html="account.note_rendered"></p>
            </div>
          </ClientOnly>
        </div>
        <div class="userinfo-line">
          <div class="calendar">
            <Icon class="icon" name="material-symbols:calendar-month" />
            <div class="text">
              {{
                t('account.joinIn', {
                  time: $dayjs(account.created_at).format('YYYY-MM-DD HH:mm:ss'),
                })
              }}
            </div>
          </div>
          <div class="account-fields" v-if="account.fields && account?.fields.length">
            <div v-for="item in account?.fields" :key="item.name" class="account-fields-list">
              <div>{{ item.name }}</div>
              <div v-html="item.value"></div>
            </div>
          </div>
        </div>
        <div class="userinfo-line">
          <div class="follow-block">
            <NuxtLink class="router-item" :to="`/user/${acct}?tab=tweets`">
              <strong> {{ account.status_count }}&nbsp;</strong>
              {{ t('public.tweet') }}
            </NuxtLink>
            <NuxtLink class="router-item" :to="`/user/${acct}/follower`">
              <strong> {{ account.followers_count }}&nbsp;</strong>
              {{ t('account.follower') }}
            </NuxtLink>
            <NuxtLink class="router-item" :to="`/user/${acct}/following`">
              <strong> {{ account.following_count }}&nbsp;</strong>
              {{ t('account.following') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
    <nav class="tab-nav">
      <NuxtLink
        class="nav-item"
        v-for="item in tabList"
        :key="item.key"
        :class="{ active: item.key === currentTab }"
        @click="toToggleNav"
        :to="`/user/${acct}?tab=${item.key}`"
      >
        <div class="item-text">
          {{ item.name }}
        </div>
      </NuxtLink>
    </nav>
    <section>
      <TweetMessages
        :key="currentTab"
        ref="TweetMessagesRef"
        v-if="account.id"
        :tweetList="tweetList"
        :loading="tweetLoading"
        @load="getList"
        :finished="tweetFinished"
        @reTweet="tweetUpdate"
        @delete="hideTweet"
      ></TweetMessages>
    </section>
  </div>
</template>

<style scoped lang="scss">
.pages {
  max-width: 581px;

  section {
    // 背景图片
    .bannerImage {
      height: 200px;
      background-color: var(--color-neutral-4);
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    // 用户信息区域
    .userinfo-block {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 20px 20px 10px;
      // 头像
      .avatar-img {
        overflow: hidden;
        position: absolute;
        left: 0;
        top: -92px;
        border: 4px solid #fff;
        border-radius: 50%;
        width: 144px;
        height: 144px;

        .img-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;

          img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }

      .userinfo-line {
        display: flex;
        flex-direction: column;

        .right {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .username {
          display: flex;
          align-items: center;
          margin-top: 20px;
          font-size: 20px;
          font-weight: bold;
          gap: 6px;

          .boot-btn {
            height: 22px;
            line-height: 12px;
            display: inline-block;
            padding: 4px 6px;
            cursor: default;
            border-radius: 3px;
            font-size: 12px;
            font-weight: 500;
            color: var(--user-role-accent, #282c37);
            border: 1px solid rgb(var(--gray-6));
            color: rgb(var(--gray-6));
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }

        .account-acct-area {
          display: flex;
          word-break: break-all;
          align-items: center;
          gap: 10px;
        }

        .calendar {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }

          .icon {
            font-size: 16px;
          }

          .text {
            height: 24px;
            line-height: 24px;
          }
        }

        .account-fields {
          background-color: var(--color-neutral-2);
          display: flex;
          flex-direction: column;
          margin-top: 10px;

          .account-fields-list {
            padding: 10px 16px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            border-bottom: 1px solid #ccc;

            .text-acct {
              color: rgb(var(--arcoblue-6));
            }

            &:last-child {
              border-bottom: none;
            }
          }
        }

        .follow-block {
          display: flex;
          gap: 20px;
          font-size: 15px;

          .router-item {
            display: flex;
            color: var(--color-neutral-8);
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
}

.tab-nav {
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
  line-height: 36px;
  display: flex;

  .nav-item {
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    padding: 8px 0;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease-out;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

    .item-text {
      color: #536471;
      width: 100%;
      text-align: center;
      height: 40px;
      line-height: 40px;
      font-weight: 700;
      font-size: 15px;
    }

    &:hover {
      background-color: var(--color-neutral-3);
    }

    &.active {
      &::before {
        content: ' ';
        display: block;
        background: rgb(var(--arcoblue-6));
        width: 56px;
        height: 4px;
        border-radius: 2px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }

      .item-text {
        color: #0f1419;
      }
    }
  }
}

// 打赏弹窗
.reward-basic {
  padding: 10px;
  background-color: var(--color-bg-popup);
  margin-top: 10px;
  gap: 12px;
  border-radius: 10px;
  border: 0.5px solid var(--Border, #00000029);
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0px 8px 40px 0px #00000014;
  .nav {
    display: flex;
    gap: 10px;
    .nav-item {
      --border-colore: #00000029;
      --back-color: #fff;
      --font-color: #000000;
      padding: 4px 12px;
      text-align: center;
      border-radius: 5px;
      border: 1px solid var(--border-colore, #00000029);
      background: var(--back-color, #fff);
      color: var(--font-color, #000000);
      cursor: pointer;
      transition: all 0.3s ease-out;
      &:hover {
        --back-color: rgb(var(--arcoblue-1));
      }
      &.active {
        --border-colore: rgb(var(--arcoblue-6));
        --back-color: rgb(var(--arcoblue-1));
        --font-color: rgb(var(--arcoblue-6));
      }
    }
  }
  .input-wrap {
    flex: 1;
    flex-shrink: 0;
    width: 100%;
    overflow: hidden;
  }
}

@include respond('phone') {
  .avatar-img {
    width: 80px;
    height: 80px;
  }
}
</style>
