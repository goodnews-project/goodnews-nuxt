<script setup>
import { ref, onMounted, computed } from 'vue';
const { t } = useI18n();
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const userStore = useUserStore();
const isDisabled = computed(() => {
  // 先判断是否过期
  if (props.data.polls.is_expires) {
    return true;
  }
  // 再判断是否已经投票
  if (props.data.poll_vote) {
    return true;
  }

  // 最后再判断是否是本人发起的投票
  if (props.data.account_id === userStore.user?.id) {
    return true;
  }
  return false;
});
const pollList = computed(() => {
  const polls = props.data?.polls?.poll_options || [];
  const result = polls.map((item, i) => {
    return {
      name: item,
      disabled: isDisabled.value,
      calcVote: calcVote(i),
      pollId: props.data.polls.id,
      index: i,
      voted: props.data.poll_vote ? props.data.poll_vote.choice === i : false,
    };
  });
  return result;
});
const calcVote = (index) => {
  const item = props.data.polls.percent[index];
  return item;
};

import { tweetToVote } from '@/api/tweet';
import { Message } from '@arco-design/web-vue';
const emits = defineEmits(['reTweet']);
const voteLoading = ref(false);
const toVote = async (e) => {
  e._loading = true;
  voteLoading.value = true;
  const id = e.pollId;
  const params = {
    choices: [e.index],
  };
  const data = await tweetToVote(id, params).finally(() => {
    e._loading = false;
    voteLoading.value = false;
  });
  if (data) {
    Message.success(t('tweet.voteSuccess'));
    emits('reTweet', data);
  }
};
</script>

<template>
  <div class="vote">
    <div class="vote-list">
      <div class="vote-item" v-for="item in pollList" :class="{ disabled: item.disabled }">
        <template v-if="item.disabled">
          <div class="disabled-item" :class="{ voted: item.voted }" :style="{ '--barProcess-length': item.calcVote }">
            <div class="line"></div>
            <div class="total">{{ item.name }}</div>
            <div class="voted-icon" v-if="item.voted">
              <nuxt-icon name="selected"></nuxt-icon>
            </div>
            <div class="scale">{{ item.calcVote }}</div>
          </div>
        </template>
        <template v-else>
          <a-button @click.stop="toVote(item)" long type="outline" :loading="item._loading" :disabled="voteLoading" shape="round">{{ item.name }}</a-button>
        </template>
      </div>

      <div class="vote-text text-dark">
        <p>
          {{
            `${t('tweet.voteOfNums', {
              count: props.data.polls.votes_count,
            })} · ${props.data.polls.expires_text}`
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vote-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
  --height: 32px;
  --line-bg-color: #1d9bf0;
  --line-width: 5px;
  .vote-item {
    height: var(--height);
    .disabled-item {
      display: flex;
      height: 100%;
      gap: 4px;
      align-items: center;
      border-radius: var(--line-width);
      padding-right: 10px;
      position: relative;
      &::after {
        content: ' ';
        position: absolute;
        left: 0;
        border-radius: var(--line-width);
        display: block;
        width: var(--barProcess-length);
        height: 100%;
        background: var(--line-bg-color);
      }
      .total {
        position: absolute;
        left: 10px;
        z-index: 2;
        // 一行显示 超出隐藏
        width: calc(100% - 50px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .scale {
        position: absolute;
        right: 10px;
        z-index: 2;
      }
    }
    &.disabled {
      --line-bg-color: #cfd9de;
      // 禁止点击
      pointer-events: none;
    }
    .line {
      width: var(--line-width);
      height: var(--height);
      background: var(--line-bg-color);
      border-radius: var(--line-width);
    }
    .scale {
      margin-left: auto;
    }
    .target-item {
      flex: 1;
      border: 1px solid rgb(29, 155, 240);
      border-radius: 100px;
      color: rgb(29, 155, 240);
      text-align: center;
      height: var(--height);
      line-height: var(--height);
      transition: all 0.3s;
      // 一行显示，超出隐藏
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0 10px;
      &:hover {
        background-color: rgba($color: rgb(29, 155, 240), $alpha: 0.2);
      }
    }
  }
}
</style>
