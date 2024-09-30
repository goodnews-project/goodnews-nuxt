<script setup>
import TweetMessage from '@/components/Tweet/TweetMessage.vue';
import loadingIcon from '~/components/loadingIcon/index.vue';
const { t } = useI18n();
const props = defineProps({
  // 是否隐藏推文
  isHidden: { type: Boolean, default: false },
  // 推文列表
  tweetList: { type: Array, default: () => [] },
  // 是否在加载状态
  loading: { type: Boolean, default: false },
  // 数据是否加载完毕 默认false  如果为true则不会触发加载更多
  finished: { type: Boolean, default: false },
});

const slots = defineSlots();
const hasNullTextSlot = computed(() => Object.keys(slots).includes('nullText'));

const tweets = ref([]);

// 初始化推文的上下文回复关系
function initTweetList() {
  tweets.value = props.tweetList.reduce((acc, cur) => {
    if (acc.length > 0) {
      acc[acc.length - 1].replyLineBottom = false;
      cur.replyLineTop = false;
      if (acc[acc.length - 1].reply_to_id === cur.id) {
        acc[acc.length - 1].replyLineBottom = true;
        cur.replyLineTop = true;
      }
    }
    acc.push(cur);
    return acc;
  }, []);
}

watchEffect(() => {
  initTweetList();
});

onActivated(() => {
  console.log(`output->回来了`);
  initTweetList();
});

const tweetUpdate = (e) => {
  const item = tweets.value.find((item) => item.id === e.id);
  if (item) {
    Object.assign(item, e);
  }
};

const hideTweet = (index) => {
  if (index > -1) {
    tweets.value.splice(index, 1);
  }
};

const emit = defineEmits(['load']);

const current = ref(0);

const observerButton = ref(null);
const { stop } = useIntersectionObserver(
  observerButton,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      if (props.finished) return;

      current.value++;

      mitt.emit('tweetListLoading', true);
      emit('load', {
        page: current.value,
      });
    }
  },
  {
    rootMargin: '500px',
  }
);

onUnmounted(() => {
  stop();
});

const resetData = () => {
  current.value = 0;
  tweets.value = [];
};
defineExpose({
  resetData,
});
</script>

<template>
  <div class="tweet-messages">
    <div class="tweet-message-list">
      <TweetMessage
        v-for="(tweet, i) in tweets"
        :status="tweet"
        :index="i"
        :key="tweet.id"
        :isHidden="props.isHidden"
        @reTweet="tweetUpdate"
        @delete="hideTweet"
        isLazy
      >
      </TweetMessage>

      <div class="bottom-out" ref="observerButton">
        <template v-if="!finished">{{ t('tweet.loading') }}</template>
        <template v-else>
          <div v-if="tweets.length === 0" class="accounts-null-list">
            <div class="title">
              <template v-if="hasNullTextSlot">
                <slot name="nullText"></slot>
              </template>
              <template v-else> {{ t('tweet.noContentHere') }} </template>
            </div>
          </div>
          <div v-else-if="!loading">
            <div class="">{{ t('tweet.noMoreData') }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tweet-messages {
  .tweet-message-list {
    display: flex;
    flex-direction: column;
  }
}

.bottom-out {
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .loading-icon {
    font-size: 30px;
    text-align: center;
    margin: 0 auto;
    color: #1890ff;
  }
  .accounts-null-list {
    display: flex;
    justify-content: start;
    align-items: center;
    .title {
      font-size: 24px;
    }
  }
}
</style>
