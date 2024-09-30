<script setup lang="ts">
import ChatFrame from '@/components/ChatFrame/index.vue';
import { create, getConversations, searchPost } from '@/api/message/index.js';
import { Message } from '@arco-design/web-vue';
const { t } = useI18n();
const keyword = ref('');
const keywordCp = ref('');
const dropdownData = ref<any[]>([]);
const chatting = ref(false);
const route = useRoute();
useHead({
  title: t('message.title'),
});

definePageMeta({
  name: 'message',
  middleware: ['auth'],
});

const searchLoading = ref(false);
const search = async () => {
  try {
    searchLoading.value = true;
    const resp = (await searchPost(keyword.value)) as any;

    dropdownData.value = resp;

    if (resp.length > 0 && resp[0].toId === undefined) {
      conversations.value = resp;
    }
    showTrigger.value = true;
    chatting.value = false;
    keywordCp.value = keyword.value;
    searchLoading.value = false;
  } catch (err) {
    searchLoading.value = false;
  }
};

const startChatWithUser = async (dm: any) => {
  closeTrigger();
  Message.loading('Loading...');
  const conversation = await createConversation(dm.toId);
  await refresh();
  Message.clear();
  activeItem.value = conversations.value.find((item: any) => item.id === conversation.value.id);
  keyword.value = '';
  keywordCp.value = '';
};

const createConversation = async (toId: string) => {
  const { data: resp } = await create({ toId: toId });
  return resp;
};

const toId = route.params.toId;

let conversationId = '';
if (toId) {
  const res = await createConversation(toId as string);
  conversationId = res.value.id;
}

const { data: conversations, refresh } = await getConversations();

const router = useRouter();
const activeItem = ref<any>(null);

const toView = (e: any) => {
  const width = document.body.clientWidth;
  if (width <= 1280) {
    router.push(`/dm/message/${e.id}`);
    return;
  }

  activeItem.value = e;
};

if (conversations.value?.length > 0) {
  if (toId) {
    activeItem.value = conversations.value.find((item: any) => item.id === conversationId);
  } else {
    activeItem.value = conversations.value[0];
  }
}

const showTrigger = ref(false);
const closeTrigger = () => {
  showTrigger.value = false;
  keyword.value = '';
  keywordCp.value = '';
};
</script>

<template>
  <div class="content-frame">
    <div class="conversations-views">
      <PageHeader>{{ $t('message.title') }}</PageHeader>
      <div class="search-box">
        <a-trigger
          v-model:popup-visible="showTrigger"
          :trigger="`focus`"
          auto-fit-popup-width
          :blur-to-close="false"
          scroll-to-close
          content-class="message-container"
        >
          <a-input-search :placeholder="t('common.search')" v-model="keyword" @search="search" @press-enter="search" :loading="searchLoading" />
          <template #content>
            <div class="container" v-if="keywordCp">
              <a-scrollbar style="height: 400px; overflow: auto">
                <div class="user-list">
                  <div class="user-item" v-for="item in dropdownData" :key="item.id" @click="startChatWithUser(item)">
                    <Avatar :account="item" size="40"></Avatar>
                    <div class="user-name">{{ item.displayName }}</div>
                    <div class="user-acct">@{{ item.acct }}</div>
                  </div>
                </div>
              </a-scrollbar>
            </div>
          </template>
        </a-trigger>
      </div>

      <div class="personal-list" v-if="conversations?.length > 0 && activeItem">
        <a-scrollbar style="height: 100%; overflow-y: auto" outer-class="scrollClass">
          <div
            v-for="conversation in conversations || []"
            :key="conversation.id"
            @click="toView(conversation)"
            class="personal-item"
            :class="{ active: activeItem.id === conversation.id }"
          >
            <Avatar :account="conversation" shape="circle" :style="{ flex: '0 0 auto' }"></Avatar>
            <div class="user-info">
              <div class="user-name font-semibold">
                {{ conversation.displayName }}
              </div>
              <div class="user-acct text-sm text-gray-600 text-acct">@{{ conversation.acct }}</div>
            </div>
            <div class="user-extra">
              <div class="content">{{ conversation.content }}</div>
              <div class="timeago">{{ conversation.timeAgo }}</div>
            </div>
          </div>
        </a-scrollbar>
      </div>

      <p class="tips" v-if="conversations?.length === 0 && !showTrigger && !chatting">{{ t('message.searchPeopleOrMessages') }}</p>
    </div>
    <ChatFrame v-if="activeItem" :chatId="activeItem.id"></ChatFrame>
  </div>
</template>

<style scoped lang="scss">
.content-frame {
  display: flex;
  height: 100%;
  max-height: 100vh;
  .search-box {
    padding: 16px;
  }
}
.conversations-views {
  width: 520px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-neutral-3);
  height: 100%;
  .tips {
    text-align: center;
    color: var(--color-neutral-6);
  }
}
// 搜索列表
.message-container {
  .container {
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    .user-list {
      // max-height: 500px;
      padding: 10px 0;
      overflow-y: auto;
      .user-item {
        height: 60px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px;
        padding: 10px;
        cursor: pointer;
        &:hover {
          background: var(--color-neutral-1);
        }
        .user-acct {
          color: var(--color-neutral-6);
        }
      }
    }
  }
}
// 私信用户列表
.personal-list {
  flex: 1;
  height: calc(100% - 140px);
  .scrollClass {
    height: 100%;
  }
  .personal-item {
    display: flex;
    padding: 6px 16px;
    transition: background-color 0.2s;
    gap: 10px;
    @extend %cp;
    .user-info {
      @extend %flex-col-center;
      flex: 0 0 auto;
    }
    .user-extra {
      @extend %flex-col-center;
      margin-left: auto;
      font-size: 12px;
      color: var(--color-neutral-6);
      min-width: 0;

      .content {
        color: var(--color-neutral-10);
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .timeago {
        text-align: right;
      }
    }
    & + .personal-item {
      border-top: 1px solid var(--color-neutral-3);
    }
    &:hover {
      background-color: #f7f9fa;
    }
    &.active {
      position: relative;
      background: #f7f9f9;
      &::before {
        content: ' ';
        display: block;
        width: 2px;
        height: 100%;
        background: #1d9bf0;
        position: absolute;
        right: 0;
        top: 0;
        border-radius: 10px;
      }
    }
  }
}

@include respond('phone') {
  .conversations-views {
    width: 100%;
    border: none;
    .personal-item.active {
      &::before {
        content: '';
        display: none;
      }
    }
  }
  .text-acct {
    display: none;
  }
  .chat-view {
    display: none;
  }
}
</style>
