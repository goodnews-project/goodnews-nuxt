<script setup>
const { t } = useI18n();
import { copyToClipboard } from '@/utils/index';
const value = defineModel();
const isFavor = computed(() => {
  return value.value.statuses_fave;
});
const isReblog = computed(() => {
  return value.value.reblog;
});

const userStore = useUserStore();
const loginModalStore = useLoginModalStore();
import { bookmarkTweet, removeBookmark } from '@/api/bookmarks';
import { tweetToFave, tweetToUnfave, tweetToRepost, tweetToUnrepost } from '@/api/tweet';
const loading = ref({
  bookmark: false,
  fover: false,
  reblog: false,
});
const toggle = (type) => {
  const map = {
    favor: async () => {
      if (loading.value.fover) return;
      if (value.value.statuses_fave) {
        loading.value.fover = true;
        await tweetToUnfave(value.value.id).finally(() => {
          loading.value.fover = false;
        });

        value.value.statuses_fave = false;
        value.value.fave_count -= 1;
      } else {
        loading.value.fover = true;
        await tweetToFave(value.value.id).finally(() => {
          loading.value.fover = false;
        });
        value.value.statuses_fave = true;
        value.value.fave_count += 1;
      }
    },
    reblog: async () => {
      if (loading.value.reblog) return;
      if (value.value.reblog) {
        loading.value.reblog = true;
        await tweetToUnrepost(value.value.id).finally(() => {
          loading.value.reblog = false;
        });
        value.value.reblog = false;
        value.value.reblog_count -= 1;
      } else {
        loading.value.reblog = true;
        await tweetToRepost(value.value.id).finally(() => {
          loading.value.reblog = false;
        });
        value.value.reblog = true;
        value.value.reblog_count += 1;
      }
    },
    bookmarked: async () => {
      if (loading.value.bookmark) return;
      if (value.value.bookmarked) {
        loading.value.bookmark = true;
        await removeBookmark(value.value.id).finally(() => {
          loading.value.bookmark = false;
        });
        value.value.bookmarked = false;
      } else {
        loading.value.bookmark = true;
        await bookmarkTweet(value.value.id).finally(() => {
          loading.value.bookmark = false;
        });
        value.value.bookmarked = true;
      }
    },
  };

  if (userStore.userInfo?.id === undefined) {
    loginModalStore.openLoginModal();
    return;
  }

  map[type] && map[type]();
};
const emit = defineEmits(['goDetail']);
const goDetail = () => {
  emit('goDetail');
};

const share = () => {
  let link = `${window.location.origin}/user/${value.value.account.acct}/status/${value.value.id}`;
  const { VITE_SYS_NAME: systemName } = import.meta.env;
  if (navigator.share) {
    const shareData = {
      title: systemName,
      text: '',
      url: link,
    };
    navigator
      .share(shareData)
      .then(() => console.log('分享成功'))
      .catch((error) => console.error('分享失败', error));
  } else {
    copyToClipboard(link);
    useMessage().success(t('common.copySuccess'));
  }
};
</script>

<template>
  <div class="tweet-bar">
    <div class="bar-item flex1" @click="goDetail">
      <div class="icon-box">
        <Icon name="mingcute:comment-line"></Icon>
      </div>
      <div class="item-text">{{ value.reply_count }}</div>
    </div>
    <div class="bar-item flex1" style="--icon-color: var(--red-6)" :class="{ isFavor, disabled: loading.fover }" @click="toggle('favor')">
      <div class="icon-box">
        <svg v-if="loading.fover" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity=".5"></path>
          <path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
            <animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"></animateTransform>
          </path>
        </svg>
        <template v-else>
          <Icon v-if="isFavor" name="lets-icons:favorite-fill"></Icon>
          <Icon v-else name="lets-icons:favorite"></Icon>
        </template>
      </div>
      <div class="item-text">{{ value.fave_count }}</div>
    </div>
    <div class="bar-item flex1" style="--icon-color: var(--green-6)" :class="{ isReblog, disabled: loading.reblog }" @click="toggle('reblog')">
      <div class="icon-box">
        <svg v-if="loading.reblog" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity=".5"></path>
          <path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
            <animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"></animateTransform>
          </path>
        </svg>
        <template v-else>
          <Icon v-if="isReblog" name="bx:repost"></Icon>
          <Icon v-else name="bx:repost"></Icon>
        </template>
      </div>
      <div class="item-text">{{ value.reblog_count }}</div>
    </div>
    <div class="right">
      <div class="bar-item"></div>
      <div class="bar-item" :class="{ tagged: value.bookmarked, disabled: loading.bookmark }" @click="toggle('bookmarked')">
        <div class="icon-box">
          <svg v-if="loading.bookmark" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity=".5"></path>
            <path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
              <animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"></animateTransform>
            </path>
          </svg>
          <template v-else>
            <Icon v-if="value.bookmarked" name="material-symbols:bookmark-added-rounded"></Icon>
            <Icon v-else name="material-symbols:bookmark-add-outline-rounded"></Icon>
          </template>
        </div>
      </div>
      <div class="bar-item">
        <div class="icon-box" @click="share">
          <Icon name="humbleicons:share"></Icon>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tweet-bar {
  display: flex;
  height: 40px;
  align-items: center;
  .bar-item {
    display: flex;
    align-items: center;
    gap: 4px;
    --icon-color: var(--arcoblue-6);
    --icon-bg-color: rgba(var(--icon-color), 0.1);
    --icon-text-color: rgba(var(--icon-color), 1);
    --color-secondary: transparent;
    @extend %cp;
    .icon-box {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 40px;
      transition: all 0.3s;
      font-size: 18px;
    }
    &.flex1 {
      flex: 1;
    }
    &:hover {
      .icon-box {
        color: var(--icon-text-color);
        background: var(--icon-bg-color);
      }
    }
    &.right {
      display: flex;
      justify-content: flex-end;
      div {
        margin-left: 10px;
      }
    }
  }
  .right {
    display: flex;
    gap: 4px;
  }
}
.bar-item {
  &.disabled {
    cursor: not-allowed;
  }
  &.tagged {
    color: rgb(var(--arcoblue-6));
  }

  &.isFavor {
    color: rgb(var(--red-6));
  }

  &.isReblog {
    color: rgb(var(--green-6));
  }
}
</style>
