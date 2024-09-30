<script setup>
import { computed } from 'vue';
import defaultAvatar from '@/assets/images/default-avatar.jpg';
import { useUserStore } from '@/stores/user';
import FollowButton from '../Account/FollowButton.vue';

const props = defineProps({
  account: { type: Object, default: () => ({}) },
});
const renderImg = computed(() => {
  const accountAvatar = props.account?.avatar || props.account?.avatar_remote_url;
  return accountAvatar || defaultAvatar;
});
const goRouter = () => {
  navigateTo(`/user/${props.account['acct']}`);
};
const goUserSocial = (path) => {
  navigateTo(`/user/${props.account['acct']}/${path}`);
};
const goPath = (path) => {
  navigateTo(path);
};
const userStore = useUserStore();

const isSelf = computed(() => {
  return props.account?.id === userStore.userInfo?.id;
});

const is_following = ref(props.account?.follower ? true : false);
</script>
<template>
  <div class="container">
    <div class="top">
      <a-avatar class="cursor-pointer" :imageUrl="renderImg" :size="48" @click.stop="goRouter" shape="square"></a-avatar>
      <FollowButton v-if="!isSelf" v-model="is_following" :accountId="props.account.id"></FollowButton>
    </div>
    <div class="body">
      <div class="acct" @click.stop="goRouter">
        <div class="username" v-account-name="props.account">
          {{ props.account.display_name || props.account.username }}
        </div>
        <div class="user-domain">{{ props.account.domain }}</div>
      </div>
      <div class="follow-block">
        <div class="follow-item" @click.stop="goPath(`/user/${props.account.acct}?tab=tweets`)">
          <div class="item-count">{{ props.account.status_count || 0 }} {{ $t('public.tweet') }}</div>
        </div>
        <div class="follow-item" @click.stop="goUserSocial('following')">
          <div class="item-count">{{ props.account.following_count || 0 }} {{ $t('account.following') }}</div>
        </div>
        <div class="follow-item" @click.stop="goUserSocial('follower')">
          <div class="item-count">{{ props.account.followers_count || 0 }} {{ $t('account.follower') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 260px;

  .top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .body {
    margin-top: 20px;

    .acct {
      font-size: 20px;
      color: var(--color-neutral-10);
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    .follow-block {
      display: flex;
      gap: 10px;

      .item-count {
        font-size: 14px;
        color: var(--color-neutral-8);
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
