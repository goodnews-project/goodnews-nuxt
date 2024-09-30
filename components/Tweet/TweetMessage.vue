<script setup>
import Avatar from '@/components/Avatar/index.vue';
import MoreHandle from '@/components/MoreHandle/index.vue';
import EmbedTweet from '@/components/EmbedTweet/index.vue';
import { useRouterStore } from '@/stores/router';
const { t } = useI18n();
const props = defineProps({
  // 推文
  status: { type: Object, default: () => ({}) },
  // 索引
  index: { type: Number, default: 0 },
  // 是否隐藏推文
  isHidden: { type: Boolean, default: false },
  // 是否是懒加载
  isLazy: { type: Boolean, default: false },
  // 是否显示更多操作
  showMoreHandle: { type: Boolean, default: true },
});

const emits = defineEmits(['reTweet', 'delete']);
const tweetData = computed({
  get: () => {
    return props.status;
  },
  set: (val) => {
    emits('reTweet', val);
  },
});
const isReTweet = computed(() => {
  return props.status?.origin_status !== null && props.status?.origin_status !== undefined;
});
const deleteTweet = () => {
  emits('delete', props.index);
};

const routerStore = useRouterStore();

const { tweetList, accountInfo } = storeToRefs(routerStore);

// 进入推文详情
const router = useRouter();
const route = useRoute();

const goDetail = () => {
  if (route.name === 'tweet-status' && route.params.id == props.status.id && route.params.acct === props.status.account.acct) {
    console.log('已经在本详情里了');
    return;
  }

  window.deleteTweet = deleteTweet;

  // 缓存推文数据
  if (tweetList.value) {
    tweetList.value[props.status.id] = tweetData.value;
  } else {
    tweetList.value = {
      [tweetData.value.id]: tweetData.value,
    };
  }
  router.push({
    name: 'tweet-status',
    params: {
      acct: props.status.account.acct,
      id: props.status.id,
    },
  });
};

// 嵌入帖子
const embedPath = ref(`embed/${props.status?.account?.acct}/status/${props.status?.id}`);
const showEmbedTweet = ref(false);

// 更新推文
const tweetUpdate = (status) => {
  tweetData.value = status;
};
const isShowPin = inject('isShowPin', false);

// 显示已过滤的推文
const handleFilterTweetShow = () => {
  const item = deepClone(props.status);
  item.filter = null;
  emits('reTweet', item);
};

const goRouter = (account) => {
  setRouter(account);
  gotoAccount(account);
};

const setRouter = (account) => {
  routerStore.updateAccountInfo(account);
};
const gotoAccount = (account) => {
  router.push(`/user/${account.acct}`);
};
</script>
<template>
  <div class="tweet-item" ref="tweetRef" :class="{ status_reTweet: isReTweet, isReply: tweetData.replyLineBottom }" v-if="tweetData" @click="goDetail">
    <template v-if="status.reblog_id && status?.filter?.act !== 1">
      <div class="reblog"><Icon name="zondicons:repost" />{{ $t('tweet.forwarded') }}</div>
    </template>
    <template v-if="tweetData.pinned_at && isShowPin">
      <div class="tweet-item-pin">
        <Icon name="icon-park-solid:pin" />
        <div class="text">{{ t('tweet.pinned') }}</div>
      </div>
    </template>
    <div class="tweet-filter" v-show="status?.filter?.act === 1" @click.stop>
      <span class="text">{{ $t('tweet.filtered') }}: {{ status?.filter?.title }}. </span>
      <a-link type="text" @click.stop="handleFilterTweetShow">{{ $t('tweet.keepShow') }}</a-link>
    </div>
    <div class="tweet-container" v-show="!(status?.filter?.act === 1)">
      <div class="tweet-avatar" :class="{ 'tweet-avatar_retweet': isReTweet }">
        <div v-if="tweetData.replyLineBottom" class="replyBottom"></div>
        <div v-if="tweetData.replyLineTop" class="replyTop"></div>
        <template v-if="isReTweet">
          <div class="tweet-avatar-block">
            <UserCard :account="tweetData.account">
              <Avatar size="40" :account="tweetData.account" @click.stop="goRouter(tweetData.account)" />
            </UserCard>
          </div>
          <div class="retweet-avatar-block">
            <UserCard :account="tweetData.origin_status?.account">
              <Avatar size="24" :account="tweetData.origin_status?.account" @click.stop="goRouter(tweetData.origin_status?.account)" />
            </UserCard>
          </div>
        </template>
        <template v-else>
          <UserCard :account="tweetData.account">
            <Avatar :account="tweetData.account" @click.stop="goRouter(tweetData.account)"></Avatar>
          </UserCard>
        </template>
      </div>
      <div class="tweet-main">
        <div class="tweet-header">
          <UserCard :account="tweetData.account" class="usercard">
            <div class="userinfo" @click.stop="goRouter(tweetData.account)">
              <nuxt-link class="userinfo-name" :to="`/user/${tweetData.account.acct}`" @click.stop="setRouter(tweetData.account)">
                {{ tweetData.account?.display_name }}
              </nuxt-link>
              <div class="userinfo-desc">
                <nuxt-link class="user-info-desc-acct" :to="`/user/${status.account.acct}`" @click.stop="setRouter(tweetData.account)">
                  {{ tweetData.account?.acct }} ·
                </nuxt-link>
                <client-only>
                  {{ $dayjs(tweetData.published_at).fromNow() }}
                </client-only>
              </div>
            </div>
          </UserCard>
          <ClientOnly>
            <MoreHandle
              v-if="showMoreHandle"
              :status="tweetData"
              @delete="deleteTweet"
              :index="props.index"
              @embed="showEmbedTweet = true"
              @reTweet="tweetUpdate"
              @click.stop
            ></MoreHandle>
          </ClientOnly>
        </div>
        <div class="tweet-acct" style="margin-top: -8px">@{{ tweetData.account.acct }}</div>
        <div class="tweet-body">
          <TweetContent :status="tweetData" :showMedia="true" @goDetail="goDetail" @reTweet="tweetUpdate"></TweetContent>
          <ClientOnly>
            <TweetBar v-model="tweetData" @goDetail="goDetail" @click.stop></TweetBar>
          </ClientOnly>
        </div>
        <ClientOnly>
          <EmbedTweet v-if="embedPath" :path="embedPath" v-model:show="showEmbedTweet" />
        </ClientOnly>
      </div>
    </div>
  </div>
  <div class="tweet-item tweet-deleted" v-else>{{ t('tweet.tweetDeleted') }}</div>
</template>
<style scoped lang="scss">
.tweet-item {
  cursor: pointer;
  transition: all 0.3s ease-out;
  border-bottom: 1px solid var(--color-neutral-3);
  padding: 10px;
  &.tweet-deleted {
    font-size: 20px;
    font-weight: bold;
    color: var(--color-text-3);
    text-align: center;
    background: #fff;
    padding: 50px;
  }
  .reblog {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--color-text-2);
    font-size: 12px;
    font-weight: bold;
  }
  .tweet-item-pin {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--color-text-2);
  }
  .tweet-filter {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0;
    cursor: default;
    .text {
      margin-right: 10px;
    }
    .text-btn {
      color: rgb(var(--arcoblue-6));
      cursor: pointer;
    }
  }
  .tweet-container {
    display: flex;
  }
  &:hover {
    background: var(--color-neutral-1);
  }
  &.isReply {
    border: 0;
  }
  .tweet-avatar {
    padding-top: 4px;
    position: relative;
    .replyTop {
      position: absolute;
      left: 50%;
      top: -10px;
      width: 1px;
      height: 14px;
      background: var(--color-neutral-3);
    }
    .replyBottom {
      position: absolute;
      top: 10px;
      left: 50%;
      width: 1px;
      height: 100%;
      background: var(--color-neutral-3);
    }
    // 转发的推文头像样式
    &.tweet-avatar_retweet {
      position: relative;
      width: 48px;
      .tweet-avatar-block {
        position: absolute;
        left: 0;
        top: 0;
        // z-index: 1;
      }
      .retweet-avatar-block {
        position: absolute;
        top: 20px;
        left: 20px;
        // z-index: 1;
      }
    }
  }
}
.tweet-main {
  min-width: 0;
  flex: 1;
  .tweet-header {
    display: flex;
    padding-left: 10px;
    align-items: center;
    justify-content: space-between;
    .userinfo {
      display: flex;
      align-items: baseline;
      gap: 10px;
      .userinfo-name {
        font-size: 16px;
        font-weight: 600;
        color: var(--color-text-1);
        flex-shrink: 1;
        // 文本超出3行隐藏
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .userinfo-desc {
        font-size: 14px;
        color: var(--color-text-3);
        flex-shrink: 0;
      }
    }
  }
  .tweet-body {
    --avatar: 48px;
    padding: 0 10px;
    font-size: 15px;
  }
}
.nuxt-link-r {
  all: unset;
  pointer-events: none;
}

.tweet-acct {
  display: none;
  padding-left: 10px;
  color: var(--color-neutral-6);
}
@include respond('phone') {
  .user-info-desc-acct {
    display: none;
  }
  .tweet-acct {
    display: block;
  }
}
</style>
