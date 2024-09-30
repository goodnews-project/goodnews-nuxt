<script setup>
import TweetMessage from '@/components/Tweet/TweetMessage.vue';
import UserItem from '@/components/User/UserItem.vue';
import UserCard from '@/components/UserCard/index.vue';
const { t } = useI18n();
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const tweetData = computed(() => props.data);
const router = useRouter();
const goRouter = (path) => {
  router.push(path);
};
if (!tweetData.value.status) {
}

const openUrl = (data) => {
  const { url } = data;
  if (url) {
    window.open(url, '_blank');
  }
};
const user = getUser();
</script>

<template>
  <div>
    <template v-if="tweetData.notify_type === 1">
      <div class="notification-item">
        <div class="header-item">
          <Icon class="header-item-icon" name="iconamoon:profile-fill" style="color: rgb(var(--arcoblue-6))" />
          <UserCard :account="tweetData.account">
            <span class="text-under text-bold user-acct" @click="goRouter(`/user/${tweetData.account.acct}`)"> {{ tweetData.account.display_name }} </span>
            <span>{{ $t('notification.followed') }}</span>
            {{ tweetData.account.display_name }}
            {{ $t('notification.startedFollowing') }}
          </UserCard>
        </div>
        <UserItem :data="tweetData.account" :isShowFollow="false"></UserItem>
      </div>
    </template>

    <!-- 提及 -->
    <template v-else-if="tweetData.notify_type === 2">
      <div class="notification-item">
        <div class="header-item">
          <Icon class="header-item-icon" name="ci:mention" style="color: rgb(var(--arcoblue-6)); font-size: 20px" />
          <span>{{ $dayjs(tweetData.created_at).format('MM-DD') }}</span>
        </div>
        <TweetMessage :status="tweetData?.status" :showMoreHandle="false"></TweetMessage>
      </div>
    </template>

    <!-- 转发 -->
    <template v-else-if="tweetData.notify_type === 3">
      <div class="notification-item">
        <div class="header-item">
          <Icon class="header-item-icon" name="basil:forward-solid" style="color: rgb(var(--green-6))" />
          <UserCard :account="tweetData.account">
            <span class="text-under text-bold user-acct" @click="goRouter(`/user/${tweetData.account.acct}`)"> {{ tweetData.account.display_name }} </span>
          </UserCard>
          <span>{{
            tweetData?.status?.reply_to_id ? t('notification.retweeted') + t('notification.reply') : t('notification.retweeted') + t('notification.tweet')
          }}</span>
        </div>
        <TweetMessage :status="tweetData?.status" :showMoreHandle="false"></TweetMessage>
      </div>
    </template>

    <!-- 喜欢 -->
    <template v-else-if="tweetData.notify_type === 4">
      <div class="notification-item">
        <div class="header-item">
          <Icon class="header-item-icon" name="lets-icons:favorite-fill" style="color: rgb(var(--red-6))" />
          <UserCard :account="tweetData.account">
            <span class="text-under text-bold user-acct" @click="goRouter(`/user/${tweetData.account.acct}`)"> {{ tweetData.account.display_name }} </span>
          </UserCard>
          <span>
            {{ tweetData?.status?.reply_to_id ? t('notification.liked') + t('notification.reply') : t('notification.liked') + t('notification.tweet') }}
          </span>
        </div>
        <TweetMessage :status="tweetData?.status" :showMoreHandle="false"></TweetMessage>
      </div>
    </template>

    <!-- 新动态 -->
    <template v-else-if="tweetData.notify_type === 5">
      <div class="notification-item">
        <div class="header-item">
          <Icon class="header-item-icon" name="lets-icons:order-fill" style="color: var(--color-neutral-8)" />
          <UserCard :account="tweetData.account">
            <span>{{ $t('notification.followed') }}</span>
            <span class="text-under text-bold user-acct" @click="goRouter(`/user/${tweetData.account.acct}`)"> {{ tweetData.account.display_name }} </span>
            {{ $t('notification.postedANewTweet') }}
          </UserCard>
        </div>
        <TweetMessage :status="tweetData?.status" :showMoreHandle="false"></TweetMessage>
      </div>
    </template>

    <!-- 投票通知 -->
    <template v-else-if="tweetData.notify_type === 9">
      <div class="notification-item">
        <div class="header-item">
          <nuxt-icon class="header-item-icon" name="vote"></nuxt-icon>
          <template v-if="tweetData.account.acct === user.acct">
            {{ $t('notification.yourVoteHasEnded') }}
          </template>
          <template v-else>
            {{ $t('notification.yourParticipatedInTheVote') }}
          </template>
        </div>
        <TweetMessage :status="tweetData?.status" :showMoreHandle="false"></TweetMessage>
      </div>
    </template>

    <!-- 新注册用户 -->
    <template v-else-if="tweetData.notify_type === 11">
      <div class="notification-item">
        <div class="header-item">
          <Icon class="header-item-icon" name="heroicons:user-plus-20-solid" style="color: rgb(var(--arcoblue-6))" />
          <UserCard :account="tweetData.account">
            <span class="text-under text-bold user-acct" @click="goRouter(`/user/${tweetData.account.acct}`)"> {{ tweetData.account.display_name }} </span>
            <span>{{ $t('notification.registered') }}</span>
            <span class="mla">{{ $dayjs(tweetData.created_at).format('MM-DD') }}</span>
          </UserCard>
        </div>
        <UserItem :data="tweetData.account" :isShowFollow="false"></UserItem>
      </div>
    </template>

    <!-- 通知机器人 -->
    <template v-else-if="tweetData.notify_type === 20">
      <div class="notification-item">
        <div class="header-item">
          <nuxt-icon name="arrow-up-circle" style="color: #ff9500"></nuxt-icon>
          <span class="text-bold">{{ $t('notification.newVersionNotify') }}</span>
        </div>
        <div class="content">
          <div class="desc" @click="openUrl(tweetData.status)" v-html="tweetData.status.content"></div>
        </div>
      </div>
    </template>

    <!-- 其他 -->
    <template v-else> {{ t('public.notDeveloped') }} </template>
  </div>
</template>

<style scoped lang="scss">
.header-item {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  .user-acct {
    flex-shrink: 0;
    max-width: 100%;
  }
  .header-item-icon {
    font-size: 18px;
  }
  .mla {
    margin-left: auto;
    font-size: 13px;
  }
}
.content {
  padding: 10px;
  .desc {
    font-size: 14px;
    color: var(--color-neutral-10);
    padding-left: 10px;
  }
}
</style>
