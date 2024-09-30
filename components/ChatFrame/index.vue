<template>
  <div class="chat-view">
    <div class="user-info">
      <div class="user-header">
        <div class="left-icon" @click="onClickLeft">
          <Icon name="material-symbols:arrow-back-rounded"></Icon>
        </div>
        <div class="user-title">{{ chatUserInfo?.displayName }}</div>
        <div class="user-right"></div>
      </div>
    </div>
    <a-spin class="chat-frame" :loading="pending">
      <div class="chat-box">
        <div class="history">
          <div class="history-item" v-for="item in chatLog" :key="item.id" :class="{ author: item.isAuthor }">
            <div class="text">
              {{ item.text }}
            </div>
            <div class="time">
              {{ item.timeAgo }}
            </div>
          </div>
        </div>
      </div>
    </a-spin>

    <a-spin class="input-frame" :loading="sendLoading">
      <a-input class="message-input" v-model.trim="messageInput" :placeholder="$t('message.createMessage')" @keyup.enter="sendMessage">
        <template #suffix>
          <div class="icon-btn" @click="sendMessage">
            <Icon name="carbon:send-alt-filled" />
          </div>
        </template>
      </a-input>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
const { t } = useI18n();
import { getInfo, send, readDm } from '@/api/message/index.js';
import { getNum } from '@/api/nav/index.js';
const props = defineProps({
  chatId: { type: Number, required: true },
});

const chatId = ref(props.chatId);

watch(
  () => props.chatId,
  (val) => {
    chatId.value = val;
  }
);

const { data: chatUserInfo, pending } = await getInfo(chatId);

const chatLog = computed(() => chatUserInfo.value.messages);

const num = useNotificationsNum();
if (chatLog.value?.length) {
  const params = {
    sid: chatLog.value[0]?.id,
    account_id: chatUserInfo.value.id,
  };
  await readDm(params);
  const notificationsRes = await getNum();
  num.value = notificationsRes;
}

const messageInput = ref('');
const sendLoading = ref(false);
const sendMessage = async () => {
  if (!messageInput.value) {
    return;
  }

  const params = {
    to_id: chatUserInfo.value.id,
    message: messageInput.value,
    type: '1',
    url: '',
  };
  messageInput.value = '';
  sendLoading.value = true;
  await send(params).finally(() => {
    sendLoading.value = false;
  });

  chatLog.value.unshift({
    text: params.message,
    isAuthor: true,
    timeAgo: t('message.justNow'),
  });
};
const router = useRouter();

const onClickLeft = () => router.back();
</script>

<style scoped lang="scss">
.chat-view {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .user-info {
    padding: 0 20px;
    border-bottom: 1px solid #e1e8ed;
    height: 60px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    .user-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 20px;
      flex: 1;
      .left-icon {
        display: flex;
        align-items: center;
        cursor: pointer;
      }
    }
  }

  .chat-frame {
    flex: 1;
    width: 100%;
    flex-shrink: 1;
    overflow-y: auto;
    .chat-box {
      padding: 10px;
      height: 100%;
      overflow-y: auto;
    }
    .history {
      display: flex;
      flex-direction: column-reverse;
      gap: 20px;
      .history-item {
        .text {
          display: inline-block;
          padding: 10px;
          border-radius: 50px;
          border-bottom-left-radius: 10px;
          background-color: #e6e6e6;
        }
        .time {
          color: inherit;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
        &.author {
          text-align: right;
          .text {
            background-color: rgb(var(--arcoblue-6));
            border-radius: 50px;
            border-bottom-right-radius: 10px;
            color: #fff;
          }
        }
      }
    }
  }
  .input-frame {
    border-top: 1px solid #e1e8ed;
    height: 60px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 10px;
    flex-shrink: 0;
    .message-input {
      padding: 6px 10px;
      --border-radius-small: 6px;
      .icon-btn {
        width: 32px;
        height: 32px;
        border-radius: 40px;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        &:hover {
          background: rgb(var(--arcoblue-1));
          color: rgb(var(--arcoblue-6));
        }
      }
    }
  }
}
@include respond('phone') {
  .chat-view {
    .user-header {
      .left-icon {
        display: flex;
      }
    }
  }
}
</style>
