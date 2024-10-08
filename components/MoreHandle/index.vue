<script setup>
import { followUser, unfollowUser, blockUser, muteUser, hideReply } from '@/api/account/index.js';
import { tweetToPin, tweetToUnpin, tweetToDelete } from '@/api/tweet';
import { putInstanceSetting } from '@/api/admin/instance';
import { setAccountSensitiveUser, setAccountUnSensitiveUser } from '@/api/admin/account';
import { reportUser } from '@/api/account/index';
import { deepClone } from '@/utils/index.js';
import { getTweetEditor } from '@/utils/editor.js';
import { Message } from '@arco-design/web-vue';
import { defaultConfig } from './config';
import mitt from '@/utils/mitt';
import deleteTweetPop from '../Tweet/components/deleteTweetPop.vue';
const dayjs = useDayjs();
const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const proxy = getCurrentInstance()?.proxy;
// const $dayjs = proxy?.$dayjs
const props = defineProps({
  status: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: Number,
    default: 0,
  },
  options: {
    type: Object,
    default: () => defaultConfig,
  },
});

const emits = defineEmits(['reTweet', 'delete', 'hide', 'embed']);
const myUserId = computed(() => {
  return userStore.userInfo?.id;
});
const isMyTweet = computed(() => {
  return props.status.account?.id === myUserId.value;
});

const isEdit = computed(() => {
  const createTime = props.status.published_at;
  const nowTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const diffTime = dayjs(nowTime).diff(createTime, 'hour');
  return isMyTweet.value && diffTime > 1;
});

const isTweetStatus = computed(() => {
  return route.name === 'tweet-status';
});

const isShowDeletePop = ref(false);

const loginModalStore = useLoginModalStore();
const handleCommand = async (key) => {
  if (key === 'openOriginal') {
    window.open(props.status.url);
    return;
  }
  if (key === 'embed') {
    emits('embed');
    return;
  }
  const userId = props.status.account.id;
  if (!userStore.userInfo?.id) {
    loginModalStore.openLoginModal();
    return;
  }
  if (key === 'delete') {
    isShowDeletePop.value = true;
    return;
  }
  if (key === 'openOriginal') {
    window.open(props.status.url);
    return;
  }
  if (key === 'embed') {
    emits('embed');
    return;
  }
  if (key === 'mention') {
    const editor = getTweetEditor();
    const customNode = {
      type: 'mention',
      color: '#1d9bf0',
      id: props.status.account.id,
      text: `@${props.status.account.username}`,
    };
    editor.insertNode(customNode);
    editor.insertText(' ');
    await nextTick();
    editor.focus();
    return;
  }
  if (key === 'edit') {
    const editor = getTweetEditor();
    editor.clear();
    const content = props.status.content_rendered;
    editor.setHtml(content);
    editor.focus();
    mitt.emit('editTweet', props.status);
    return;
  }
  if (key === 'message') {
    await router.push(`/message/${props.status.account.id}`);
    return;
  }
  if (key === 'hide') {
    await hideReply(props.status.id, props.isHidden ? 0 : 1);
    emits('hide', props.status.id);
    return;
  }
  // 关注
  if (key === 'follow') {
    await followUser(props.status.account.id);
    let item = deepClone(props.status);
    item.account.follower = true;
    emits('reTweet', item);
    return;
  }
  // 取消关注
  if (key === 'unfollow') {
    await unfollowUser(props.status.account.id);
    let item = deepClone(props.status);
    item.account.follower = null;
    emits('reTweet', item);
    return;
  }
  // 屏蔽
  if (key === 'mute') {
    const params = {
      target_account_id: userId,
      duration: 0,
    };
    await muteUser(params);
    emits('delete', props.index);
    deleteTweetByRoute();
    return;
  }
  // 拉黑
  if (key === 'blocked') {
    await blockUser(userId);
    return;
  }
  // 置顶
  if (key === 'pin') {
    await tweetToPin(props.status.id);
    let item = deepClone(props.status);
    item.pinned_at = dayjs().format('YYYY-MM-DD hh:mm:ss');
    emits('reTweet', item);
    return;
  }
  // 取消置顶
  if (key === 'unpin') {
    await tweetToUnpin(props.status.id);
    let item = deepClone(props.status);
    item.pinned_at = null;
    emits('reTweet', item);
    return;
  }

  // 过滤推文
  if (key === 'filterPost') {
    showFilterModal.value = true;
    return;
  }
  // 举报该用户
  if (key === 'report') {
    const params = {
      account_id: props.status.account.id,
    };
    await reportUser(params);
    Message.success(t('report.name') + t('common.success'));
  }
  // 屏蔽站点实例
  if (key === 'muteDomain') {
    const parmas = {
      is_disable_sync: 0,
    };
    await putInstanceSetting(domain.value, parmas);
    Message.success(t('common.operationSuccess'));
  }
  //  打开该用户的管理页面
  if (key === 'openUserByAdmin') {
    router.push(`/settings/adminAccounts/detail/${props.status.account.id}`);
  }
  // 打开此贴的管理界面
  if (key === 'openTweetByAdmin') {
    console.log(`output-> openTweetByAdmin`);
  }
  // 打开该站点的管理界面
  if (key === 'openSiteByAdmin') {
    router.push(`/settings/adminInstances/detail/${domain.value}`);
  }
  // 将该用户标记为敏感账号
  if (key === 'markSensitiveAccount') {
    const res = await setAccountSensitiveUser(userId);
    useMessage().success(t('common.operationSuccess'));
    let item = deepClone(props.status);
    item.account.sensitized_at = 1;
    emits('reTweet', item);
  }
  if (key === 'unMmarkSensitiveAccount') {
    const res = await setAccountUnSensitiveUser(userId);
    useMessage().success(t('common.operationSuccess'));
    let item = deepClone(props.status);
    item.account.sensitized_at = null;
    emits('reTweet', item);
  }
};

// 删除推文的操作
const deteleLoading = ref(false);
const deleteTweet = async () => {
  deteleLoading.value = true;
  await tweetToDelete(props.status.id).finally(() => {
    deteleLoading.value = false;
  });
  Message.success(t('common.deleteSuccess'));
  emits('delete', props.index);
  isShowDeletePop.value = false;
  deleteTweetByRoute();
};

// 跨路由删除推文 - 当推文详情的推文被删除时，返回上一页，同时删除推文列表中的推文
const deleteTweetByRoute = () => {
  if (isTweetStatus.value) {
    router.go(-1);
    window.deleteTweet(props.status.messageIndex);
  }
};

// 页面销毁的回调函数
onBeforeUnmount(() => {
  if (isTweetStatus.value && window.deleteTweet) {
    delete window.deleteTweet;
  }
});

// 过滤推文弹窗逻辑
const showFilterModal = ref(false);
provide('showFilterModal', showFilterModal);
const handleFilterSuccess = (filterObj) => {
  const item = deepClone(props.status);
  if (filterObj.act === 1) {
    item.filter = filterObj;
    emits('reTweet', item);
  } else if (filterObj.act === 2) {
    emits('delete', props.index);
  }
};

const user = getUser();
const isAdminUser = computed(() => {
  return user.value?.is_admin;
});
const domain = computed(() => {
  console.log(props.status);
  return props.status.account.domain || document.domain;
});
</script>

<template>
  <div class="icon-more">
    <a-dropdown @select="handleCommand" :popup-max-height="false" position="br">
      <a-button shape="circle" type="text">
        <Icon name="akar-icons:more-horizontal-fill"></Icon>
      </a-button>
      <template #content>
        <a-doption value="delete" v-if="props.options.showDelete">
          <div class="dropdown-item red" v-if="isMyTweet">
            <Icon class="icon-box" name="material-symbols:delete"></Icon>
            {{ t('common.delete') }}
          </div>
        </a-doption>
        <a-doption value="openOriginal" v-if="props.options.openOriginUrl && props.status.url">
          <div class="dropdown-item">
            <Icon class="icon-box" name="wpf:connected"></Icon>
            {{ t('tweet.openOriginPage') }}
          </div>
        </a-doption>
        <a-doption value="embed" v-if="props.options.embed">
          <div class="dropdown-item">
            <Icon class="icon-box" name="mingcute:code-line"></Icon>
            {{ t('tweet.embedPost') }}
          </div>
        </a-doption>
        <a-doption value="mention" v-if="props.options.mention">
          <div class="dropdown-item">
            <Icon class="icon-box" name="fluent:mention-16-filled"></Icon>
            {{ t('tweet.mention') }}
          </div>
        </a-doption>

        <a-doption value="message" v-if="props.options.message && !isMyTweet">
          <div class="dropdown-item">
            <Icon class="icon-box" name="uil:envelope-alt"></Icon>
            {{ t('tweet.directMessage') }}
          </div>
        </a-doption>

        <template v-if="props.options.follow">
          <a-doption value="follow" v-if="!props.status.account.follower && !isMyTweet">
            <div class="dropdown-item">
              <nuxt-icon class="icon-box" name="guanzhu"></nuxt-icon>
              {{ `${t('account.following')} ${props.status.account.acct}` }}
            </div>
          </a-doption>
          <a-doption value="unfollow" v-else-if="props.status.account.follower">
            <div class="dropdown-item">
              <nuxt-icon class="icon-box" name="guanzhu-2"></nuxt-icon>
              {{ `${t('account.unFollow')} ${props.status.account.acct}` }}
            </div>
          </a-doption>
        </template>

        <template v-if="props.options.top && isMyTweet">
          <a-doption value="pin" v-if="!props.status.pinned_at">
            <div class="dropdown-item">
              <Icon class="icon-box" name="fluent:stack-star-16-filled"></Icon>
              {{ t('tweet.pin') }}
            </div>
          </a-doption>

          <a-doption value="unpin" v-else>
            <div class="dropdown-item">
              <Icon class="icon-box" name="fluent:set-top-stack-16-regular"></Icon>
              {{ t('tweet.unpin') }}
            </div>
          </a-doption>
        </template>

        <a-doption value="mute" v-if="props.options.mute && !isMyTweet">
          <div class="dropdown-item">
            <nuxt-icon class="icon-box" name="hide"></nuxt-icon>
            {{ `${t('tweet.mute')} ${props.status.account.acct}` }}
          </div>
        </a-doption>
        <a-doption value="blocked" v-if="props.options.block && !isMyTweet">
          <div class="dropdown-item">
            <nuxt-icon class="icon-box" name="blocked"></nuxt-icon>
            {{ `${t('tweet.block')} ${props.status.account.acct}` }}
          </div>
        </a-doption>
        <a-doption value="hide" v-if="props.options.hide && !isMyTweet && props.status.reply_to_account_id === myUserId">
          <div class="dropdown-item">
            <nuxt-icon class="icon-box" name="hide"></nuxt-icon>
            {{ `${props.isHidden ? t('tweet.show') : t('tweet.hide')}${t('tweet.thisConversation')}` }}
          </div>
        </a-doption>
        <a-doption value="filterPost" v-if="props.options.filterPost && props.status.filter === null">
          <div class="dropdown-item">
            <nuxt-icon class="icon-box" name="hide"></nuxt-icon>
            {{ `${t('tweet.filterPost')}` }}
          </div>
        </a-doption>

        <a-doption value="report" v-if="!isMyTweet">
          <div class="dropdown-item">
            <Icon class="icon-box" name="ic:outline-report" />
            {{ `${t('report.name')} ${props.status.account.acct}` }}
          </div>
        </a-doption>
        <template v-if="isAdminUser">
          <a-doption value="muteDomain" v-if="props.status.account?.domain">
            <div class="dropdown-item">
              <nuxt-icon class="icon-box" name="hide"></nuxt-icon>
              {{ `${t('tweet.mute')} ${props.status.account?.domain} ${t('admin.instances.menuTitle')}` }}
            </div>
          </a-doption>
          <a-doption value="openUserByAdmin">
            <div class="dropdown-item">
              <Icon class="icon-box" name="clarity:administrator-line" />
              {{ `${t('tweet.openPersonalAdmin', { acct: props.status.account.acct })} ` }}
            </div>
          </a-doption>
          <a-doption value="openSiteByAdmin" v-if="props.status.account?.domain">
            <div class="dropdown-item">
              <Icon class="icon-box" name="mingcute:sitemap-line" />
              {{ `${t('tweet.openInstanceAdmin', { domain: domain })} ` }}
            </div>
          </a-doption>
          <template v-if="!props.status.account.sensitized_at">
            <a-doption value="markSensitiveAccount">
              <div class="dropdown-item">
                <Icon class="icon-box" name="ion:warning-outline" />
                {{ `${t('tweet.markSensitiveAccount', { acct: props.status.account.acct })} ` }}
              </div>
            </a-doption>
          </template>
          <template v-else>
            <a-doption value="unMmarkSensitiveAccount">
              <div class="dropdown-item">
                <Icon class="icon-box" name="ion:warning-outline" />
                {{ `${t('tweet.unmarkSensitiveAccount')} ` }}
              </div>
            </a-doption>
          </template>
        </template>
      </template>
    </a-dropdown>
    <delete-tweet-pop v-model:visible="isShowDeletePop" @confirm="deleteTweet" :loading="deteleLoading"></delete-tweet-pop>

    <FilterModal v-if="props.status.id && showFilterModal" :status="props.status" @success="handleFilterSuccess" />
  </div>
</template>

<style lang="scss" scoped>
.icon-more {
  --icon-size: 34px;
  width: var(--icon-size);
  height: var(--icon-size);
  border-radius: var(--icon-size);
  margin-left: auto;
  --primary-6: var(--gray-8);
}

.dropdown-item {
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 15px;
  &.red {
    color: var(--color-danger-6);
  }
  .icon-box {
    font-size: 20px;
    margin-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
