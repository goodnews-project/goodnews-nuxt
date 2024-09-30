<script setup>
import { useUserStore } from '@/stores/user';
import api from '@/utils/request';
import TweetMessages from './TweetMessages.vue';
import mitt from '~/utils/mitt';
const { t } = useI18n();

const userStore = useUserStore();
const userId = computed(() => {
  return userStore.userInfo?.id;
});
const loading = ref(false);
const content = ref('');
const forbidReply = ref(false);
const props = defineProps({
  id: String,
  acct: String,
  status: Object,
});
const emits = defineEmits(['comment']);
watch(
  () => props.status,
  (newValue) => {
    if (newValue.who_can_reply === 1) {
      const temp = newValue.account.follows.map((item) => item.target_account_id);
      if (!temp.includes(userId.value)) forbidReply.value = true;
    } else if (newValue.who_can_reply === 2) {
      const temp = newValue.mentions.map((item) => item.id);
      if (!temp.includes(userId.value)) forbidReply.value = true;
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
async function addNewReply() {
  if (!userStore.userInfo?.username) {
    mitt.emit('login-pop');
    return;
  }
  loading.value = true;
  try {
    const statusData = {
      content: content.value,
      reply_to_id: props.id,
      is_sensitive: false,
      attachments: [],
    };
    const statusResp = await api.post('/_api/v1/statuses', statusData);
    tweetList.value.unshift({ ...statusResp.data });
    emits('comment');
    content.value = '';
  } finally {
    loading.value = false;
  }
}

import queryString from '@/utils/function/queryString';
const tweetList = ref([]);
const tweetLoading = ref(false);
const tweetFinished = ref(false);
const getTimeLine = async (params) => {
  tweetLoading.value = true;
  const qs = queryString(params);
  const res = await api.get(`/_api/v1/statuses/${props.acct}/status/${props.id}/replies${qs}`);
  tweetLoading.value = false;
  tweetList.value.push(...res.data);
  if (tweetList.value.length >= res.total) {
    tweetFinished.value = true;
  }
};

const getList = (params) => {
  getTimeLine(params);
};
</script>

<template>
  <div>
    <div class="px-5 mt-2 py-3 border-b-8 border-lighter flex">
      <div class="flex-none">
        <div class="avatar-hover-container">
          <img src="@/assets/images/default-avatar.jpg" class="flex-none w-12 h-12 rounded-full border border-lighter" />
        </div>
      </div>
      <form v-on:submit.prevent="addNewReply" class="w-full px-4">
        <textarea v-model="content" :placeholder="t('tweet.writeYourComment')" class="mt-3 pb-2 w-full focus:outline-none resize-none" />
        <hr class="py-2" />
        <div class="flex items-center justify-between">
          <button
            :disabled="loading || forbidReply"
            type="submit"
            class="h-10 px-4 text-white font-semibold ml-auto bg-blue hover:bg-darkblue focus:outline-none rounded-full disabled:cursor-not-allowed flex justify-center items-center"
          >
            <span>{{ t('tweet.comment') }}</span>
          </button>
        </div>
      </form>
    </div>
    <TweetMessages
      viewKey="local"
      :tweetList="tweetList"
      :loading="tweetLoading"
      @load="getList"
      :finished="tweetFinished"
      class="replyTweetsList"
    ></TweetMessages>
  </div>
</template>

<style lang="scss" scoped>
.replyTweetsList {
  min-height: 800px;
}
</style>
