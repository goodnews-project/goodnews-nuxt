<script setup>
import ImageUpload from '@/components/Tool/ImageUpload.vue';
import ImageList from '@/components/Tool/ImageList.vue';
import VisibleChange from '../Tool/VisibleChange.vue';
import { getUserInfo } from '@/api/base';
import { tweetToPost, editTweetData } from '@/api/tweet';
import { getTweetEditor } from '@/utils/editor.js';
import mitt from '~/utils/mitt';
const { t } = useI18n();
const userInfo = getUser();

// 是否是敏感用户
const isSensitiveUser = computed(() => {
  return !!userInfo.value?.sensitized_at || userInfo.value?.is_sensitive === 1;
});

const sensitiveBtnTitle = computed(() => {
  let str = '';
  if (!!userInfo.value?.sensitized_at) {
    str = t('tweet.yourAccountIsSensitive');
  } else if (userInfo.value?.is_sensitive === 1) {
    str = t('tweet.youSetSensitiveContent');
  } else if (sensitiveness.value) {
    str = t('tweet.unmarkSensitiveContent');
  } else if (!sensitiveness.value) {
    str = t('tweet.markSensitiveContent');
  }
  return str;
});
// 敏感内容
const sensitiveness = ref(isSensitiveUser.value);
const toggleSensitiveness = () => {
  sensitiveness.value = !sensitiveness.value;
};

// 评分模块
import vote from '@/components/Vote/index.vue';
const vodeDom = ref(null);
const showVote = ref(false);
const openVote = () => {
  showVote.value = true;
};
const closeVote = () => {
  if (showVote.value) showVote.value = false;
};

const content = ref('');
const loading = ref(false);
const current = ref({ id: 0, label: t('tweet.everyone') });
const pushSite = ref(1);
const pushSiteOptions = [
  { value: 1, label: t('tweet.push'), icon: 'mdi:share' },
  { value: 0, label: t('tweet.notPush'), icon: 'mdi:share-off' },
];
const uploaderComponent = ref(null);
const fileList = ref([]);

// 发推按钮是否禁用-依赖于编辑器的内容
const tweetContentText = ref('');

const isSendTweetDisabled = computed(() => {
  return sendTweetDisabledReason.value !== '';
});
// 发推按钮禁用的原因
const sendTweetDisabledReason = computed(() => {
  let reason = '';
  if (tweetContentText.value.length > 500) reason = t('tweet.wordLimitExceeded');
  if (loading.value) reason = t('tweet.sendingTweet');
  const isUploading = fileList.value.some((file) => file.status === 'pending');
  if (isUploading) reason = t('tweet.fileUploading');
  // 有效字符--过滤空格/换行/空字符&nbsp;
  const validContent = tweetContentText.value
    .replace(/&nbsp;/g, '')
    .replace(/<br>/g, '')
    .replace(/<p>/g, '')
    .replace(/ /g, '')
    .replace(/<\/p>/g, '');
  if (!validContent.length && !fileList.value.length) reason = t('tweet.noContent');
  return reason;
});

// 编辑器的内容
async function addNewTweet() {
  let voteData = null;
  if (showVote.value) {
    const voteDataRes = await vodeDom.value.getFormData().catch((err) => {
      useMessage().error(err + '');
      return;
    });
    voteData = voteDataRes.data;
  }
  const attachments = fileList.value.map((file) => file.response);
  let tweetFileListCache = fileList.value.map((file) => {
    const { thumbnail_url, ...rest } = file.response;
    return {
      ...rest,
      url: file.base64,
    };
  });

  const editorText = getTweetEditor().getHtml();
  loading.value = true;
  const params = {
    content: editorText,
    reply_to_id: null,
    is_sensitive: sensitiveness.value === true ? 1 : 0,
    attachments: attachments,
    comments_disabled: 0,
    scope: 1,
    who_can_reply: current.value.id,
    enable_activitypub: pushSite.value,
    poll: voteData || [],
  };
  let sendTweetApi = null;
  if (tweetEditData.value) {
    params.id = tweetEditData.value.id;
    sendTweetApi = editTweetData;
  } else {
    sendTweetApi = tweetToPost;
  }
  let statusResp;
  try {
    statusResp = await sendTweetApi(params).finally(() => {
      loading.value = false;
    });
  } catch (error) {
    if (error._data.code === 6001) {
      // 刷新用户信息
      const { data } = await getUserInfo(userInfo.value.acct);
      const resultObj = {};
      for (const key in data.value.account) {
        if (Object.prototype.hasOwnProperty.call(userInfo.value, key)) {
          resultObj[key] = data.value.account[key];
        }
      }
      userInfo.value = resultObj;
      if (resultObj.is_sensitive === 1 || resultObj.sensitized_at) {
        sensitiveness.value = true;
      }
    }
    return;
  }

  // 插入的推文数据
  const tweetData = {
    ...statusResp,
    attachments: tweetFileListCache,
  };
  if (tweetEditData.value) {
    mitt.emit('edit-tweet', tweetData);
  } else {
    mitt.emit('submit-tweet', tweetData);
  }
  useMessage().success(tweetEditData.value ? t('common.modifySuccessfully') : t('tweet.sendTweet') + t('common.success'));
  content.value = '';
  fileList.value = [];
  closeVote();
  tweetEditData.value = null;
}

const tweetContentCb = (e) => {
  tweetContentText.value = e;
};
const editTweetCb = async (params) => {
  setTweetForm(params);
};
// 编辑器的模式(发推/编辑)
const tweetEditData = ref(null);
onMounted(() => {
  mitt.on('tweetContent', tweetContentCb);
  mitt.on('editTweet', editTweetCb);
});
onUnmounted(() => {
  mitt.off('tweetContent', tweetContentCb);
  mitt.off('editTweet', editTweetCb);
});
// 设置推文表单 推文内容/附件/投票信息
const setTweetForm = async (params) => {
  tweetEditData.value = params || null;
  if (params) {
    content.value = params.content_rendered;
    fileList.value = params.attachments.map((item) => {
      return {
        ...item,
        fileType: item.file_type,
        response: item,
        status: 'success',
      };
    });
    if (params.polls) {
      showVote.value = true;
      await nextTick();
      vodeDom.value.setFormData(params.polls);
    }
  } else {
    content.value = '';
    fileList.value = [];
    showVote.value = false;
  }
  Promise.resolve();
};
const tweetEditorBtnText = computed(() => {
  return tweetEditData.value === null ? t('tweet.sendTweet') : t('common.save');
});
const submitForm = () => {
  if (tweetEditData.value === null) {
    addNewTweet();
    return;
  } else {
    editTweetSave();
  }
};
// 编辑推文
const editTweetSave = async () => {
  let voteData = null;
  if (showVote.value) {
    const voteDataRes = await vodeDom.value.getFormData().catch((err) => {
      useMessage.error(err);
    });
    voteData = voteDataRes.data;
  }
  const attachments = fileList.value.map((file) => file.response);
  let tweetFileListCache = fileList.value.map((file) => {
    const { thumbnail_url, ...rest } = file.response;
    return {
      rest,
      url: file.base64,
    };
  });
  const editorText = getTweetEditor().getHtml();
  loading.value = true;
  try {
    const params = {
      id: tweetEditData.value.id,
      content: editorText,
      reply_to_id: null,
      is_sensitive: sensitiveness.value === true ? 1 : 0,
      attachments: attachments,
      comments_disabled: 0,
      scope: 1,
      who_can_reply: current.value.id,
      enable_activitypub: pushSite.value,
      poll: voteData || [],
    };
    const statusResp = await editTweetData(params).finally(() => {
      loading.value = false;
    });
    content.value = '';
    fileList.value = [];
    closeVote();
    tweetEditData.value = null;

    // 插入的推文数据
    const tweetData = {
      ...statusResp,
      attachments: tweetFileListCache,
    };
    mitt.emit('submit-tweet', tweetData);
  } catch (err) {}
};
</script>

<template>
  <form v-on:submit.prevent="submitForm" class="editor-form">
    <div class="tweetModeEdit">
      <a-tag closable v-if="tweetEditData" @close="setTweetForm"> {{ t('common.edit') }} </a-tag>
    </div>
    <SendTweetEditor v-model="content" />
    <div style="padding: 10px" v-if="fileList.length">
      <ImageList class="imageList" v-model="fileList"></ImageList>
    </div>

    <vote v-if="showVote" ref="vodeDom" @closeVote="closeVote"></vote>
    <div class="btn-frame" style="--btn-font-size: 18px">
      <ImageUpload v-model="fileList" ref="uploaderComponent"></ImageUpload>
      <VisibleChange v-model:current="current" />
      <a-tooltip :content="t('tweet.addVote')" mini position="top">
        <a-button type="text" @click="openVote" style="font-size: var(--btn-font-size)">
          <nuxt-icon name="vote"></nuxt-icon>
        </a-button>
      </a-tooltip>
      <SelectByBtn v-model="pushSite" :options="pushSiteOptions" :title="t('tweet.isPush')" :tips="t('tweet.choosePush')">
        <Icon name="material-symbols:webhook-rounded" />
      </SelectByBtn>

      <a-tooltip :content="sensitiveBtnTitle" mini position="top">
        <template v-if="!sensitiveness">
          <a-button type="text" @click="toggleSensitiveness" style="font-size: var(--btn-font-size)" :title="sensitiveBtnTitle">
            <Icon name="ion:warning-outline" />
          </a-button>
        </template>
        <template v-else>
          <a-button
            type="text"
            @click="toggleSensitiveness"
            :disabled="isSensitiveUser"
            :title="sensitiveBtnTitle"
            style="font-size: var(--btn-font-size); color: #ff9f0a"
          >
            <Icon name="ion:warning" />
          </a-button>
        </template>
      </a-tooltip>

      <a-button
        style="margin-left: auto; --primary-6: var(--arcoblue-6)"
        :disabled="isSendTweetDisabled"
        type="primary"
        html-type="submit"
        :loading="loading"
        :title="sendTweetDisabledReason"
      >
        {{ tweetEditorBtnText }}
      </a-button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.editor-form {
  display: flex;
  flex-direction: column;
  flex: 1;
  .tweetModeEdit {
    text-align: right;
  }
}
.btn-frame {
  --primary-6: 78, 89, 105;
  display: flex;
  gap: 4px;
  padding: 10px;
  :deep(.arco-btn) {
    padding: 0 10px;
  }
}
.sendTweet-button-frame {
  gap: 10px;
  display: flex;
}
.ql-editor {
  padding-left: 5px;
  height: 100px;
}

@include respond('phone') {
  .aaa {
    min-width: 48px;
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
