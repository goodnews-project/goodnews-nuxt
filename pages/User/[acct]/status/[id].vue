<script setup lang="ts">
import { getTweetDetail, getTweetContext, replyToTweet } from '@/api/tweet';
import { useUserStore } from '@/stores/user';
import { useLoginModalStore } from '@/stores/loginModal';
import { getTweetReplyList } from '@/api/tweet';

import useScroll from '@/hooks/useScroll.js';
import { manualFetch } from '~/api/base';
import { useRouterStore } from '~/stores/router';
const { t } = useI18n();
definePageMeta({
  name: 'tweet-status',
});

defineOptions({
  name: 'tweet-status',
});

const route = useRoute();

const routerStore = useRouterStore();

const { tweetList: tweetListStore } = storeToRefs(routerStore) as any;

const id = route.params.id;

const params = {
  acct: route.params.acct,
  id: id,
};

const p1 = () => {
  const detail = tweetListStore.value?.[id as string];

  if (!detail) {
    return getTweetDetail(params);
  }

  return { data: ref(detail) };
};

const p2 = getTweetContext(params.id);

const tweetParams = {
  acct: route.params.acct,
  id: id,
};
const [{ data: p1res }, { data: p2res }] = await Promise.all([p1(), p2]);

const description = p1res.value?.content_rendered.replace(/<[^>]+>/g, '').slice(0, 200) || '';

// 返回meta的og协议
const getHeadMetaOg = (): any => {
  // 公共协议
  const commonOg = [
    { name: 'og:description', content: description },
    { name: 'og:title', content: `${route.params.acct} ${t('common.of')}${t('public.tweet')}${t('common.detail')}` },
    { name: 'og:type', content: 'website' },
    { name: 'twitter:creator', content: route.params.acct },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image:alt', content: description },
    { name: 'twitter:site', content: route.params.acct },
    { name: 'twitter:title', content: description },
  ];

  if (p1res.value?.attachments.length > 0) {
    const fileList = p1res.value.attachments;
    // 如果是视频,返回视频的 meta
    if (fileList.some((item: { file_type: number }) => item.file_type === 4)) {
      const videoOg = [
        {
          name: 'og:video',
          content:
            fileList.find((item: { file_type: number }) => item.file_type === 4).url ||
            fileList.find((item: { file_type: number }) => item.file_type === 4).remote_url ||
            '',
        },
        {
          name: 'og:video:secure_url',
          content:
            fileList.find((item: { file_type: number }) => item.file_type === 4).url ||
            fileList.find((item: { file_type: number }) => item.file_type === 4).remote_url ||
            '',
        },
        {
          name: 'og:video:type',
          content: 'video/mp4',
        },
      ];
      return [...commonOg, ...videoOg];
    }
    // 否则就是图片
    const imageUrl =
      fileList.find((item: { file_type: number }) => item.file_type === 1)?.thumbnail_url ||
      fileList.find((item: { file_type: number }) => item.file_type === 1)?.remote_url ||
      fileList.find((item: { file_type: number }) => item.file_type === 1)?.url ||
      '';
    const imageOg = [
      {
        name: 'og:image',
        content: imageUrl,
      },
      {
        name: 'og:image:alt',
        content: 'content',
      },
      {
        name: 'og:image:type',
        content: `image/jpeg`,
      },
      {
        name: 'twitter:image:src',
        content: imageUrl,
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ];
    return [...commonOg, ...imageOg];
  }
  return [...commonOg];
};

const a = getHeadMetaOg();

useHead({
  title: description,
  meta: [
    {
      name: 'description',
      content: description,
    },
    ...getHeadMetaOg(),
  ],
});

const tweetList = computed(() => {
  const tweet = tweetListStore.value?.[id as string];

  const result = [...(p2res.value?.ancestors || [])];

  if (tweet) {
    result.push(tweet);
  }

  result.forEach((item, index) => {
    item.replyLineBottom = index !== result.length - 1;
    item.replyLineTop = index !== 0;
  });

  return result;
});

watchEffect(() => {
  if (!p2res.value) {
    return;
  }
  if (!tweetListStore.value[id as string]) {
    tweetListStore.value = {
      ...tweetListStore.value,
      [id as string]: p1res.value,
    };
  }
});

const tweetDomList = ref<any>({});

const mainDom = ref<any>(null);

const isInit = ref(false);
watchEffect(async () => {
  if (p2res.value?.ancestors.length > 0) {
    await nextTick();
    try {
      // 自动滚动至当前推文
      const mainTop = mainDom.value?.offsetTop;
      const currentTweet = tweetDomList.value[id as string];
      const top = currentTweet?.offsetTop - mainTop;

      useScroll().toScroll(top);
    } catch (error) {
      console.log(`拦截报错`, error);
      // console.log(error);
    }
  }
});
onMounted(async () => {
  await nextTick();
  console.log('加载评论');
  getList();
  const res = await manualFetch(`/_api/v1/statuses/${route.params.acct}/status/${id}`);
  tweetListStore.value = {
    ...tweetListStore.value,
    [id as string]: res,
  };
});

const replyEditorMaxLength = computed(() => {
  const max = 500;
  const acct = `@${route.params.acct} `;
  const acctLength = acct.length;
  return max - acctLength;
});

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const loginModalStore = useLoginModalStore();
const replyTweet = ref('');
const tweetByReplyLoading = ref(false);

const sendTweetByReply = async () => {
  console.log(userInfo);
  if (!userInfo.value) {
    loginModalStore.openLoginModal();
    return;
  }

  tweetByReplyLoading.value = true;
  const content = `@${route.params.acct} ${replyTweet.value}`;

  const params = {
    content: content,
    reply_to_id: id,
    is_sensitive: false,
    attachments: [],
  };

  const newReplyTweet = await replyToTweet(params).finally(() => {
    tweetByReplyLoading.value = false;
  });

  replyTweetList.value.unshift(newReplyTweet);

  replyTweet.value = '';
};

const replyTweetList = ref<any>([]);

const tweetFinished = ref(false);
const tweetLoading = ref(false);
const maxId = ref('');

const getList = async (max_id?: number | string) => {
  const res = await useMyFetch(`/_api/v1/statuses/${tweetParams.acct}/status/${tweetParams.id}/replies`, {
    params: !!max_id ? { max_id } : {},
  });
  tweetLoading.value = res.pending.value;
  if (res.data.value?.data.length < 30) {
    tweetFinished.value = true;
  }
  replyTweetList.value.push(...res.data.value.data);
};

const getReplyTweetListData = () => {
  if (replyTweetList.value?.length > 0) {
    maxId.value = replyTweetList.value[replyTweetList.value.length - 1]?.id || '';
    // 刷新数据
    getList(maxId.value);
  }
};

provide('tweetMode', ref('detail'));

const tweetUpdate = (e: any) => {
  const item = tweetList.value.find((item: any) => item.id === e.id);
  if (item) {
    Object.assign(item, e);
  }
};
</script>

<template>
  <div class="status-view">
    <PageHeader>{{ t('public.tweet') }}{{ t('common.detail') }}</PageHeader>
    <div class="main" ref="mainDom">
      <template v-for="(item, i) in tweetList" :key="item.id">
        <div class="tweet-item" :ref="(el) => (tweetDomList[item.id] = el)">
          <tweetMessage :status="item" :index="i" @reTweet="tweetUpdate" />
        </div>
      </template>

      <div class="reply-handle">
        <div class="mention">
          <a-tag color="arcoblue">@{{ route.params.acct }}</a-tag>
        </div>
        <a-textarea
          v-model="replyTweet"
          :placeholder="t('tweet.writeYourComment')"
          allow-clear
          :max-length="replyEditorMaxLength"
          show-word-limit
          :auto-size="{
            minRows: 3,
          }"
        />
        <div style="text-align: right">
          <a-button type="primary" :loading="tweetByReplyLoading" @click="sendTweetByReply">{{ t('tweet.comment') }}</a-button>
        </div>
      </div>
    </div>
    <div class="replyList">
      <TweetMessages
        viewKey="local"
        :tweetList="replyTweetList"
        :loading="tweetLoading"
        @load="getReplyTweetListData"
        :finished="tweetFinished"
        class="replyTweetsList"
      ></TweetMessages>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.replyList {
  min-height: 800px;
}
.reply-handle {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
