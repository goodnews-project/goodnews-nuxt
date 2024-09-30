<script setup>
import { computed } from 'vue';
import FollowButton from '../Account/FollowButton.vue';
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  isShowFollow: {
    type: Boolean,
    default: true,
  },
  isShowUserCard: {
    type: Boolean,
    default: true,
  },
  isShowNote: {
    type: Boolean,
    default: false,
  },
});
const account = computed(() => props.data);
const router = useRouter();
const goRouter = (path) => {
  router.push(path);
};
</script>

<template>
  <div class="user-item">
    <template v-if="isShowUserCard">
      <UserCard :account="account">
        <avatar :account="account" @click="goRouter(`/user/${account.acct}`)"></avatar>
      </UserCard>
      <UserCard :account="account">
        <div class="userinfo" @click="goRouter(`/user/${account.acct}`)">
          <div class="user-name">{{ account.display_name }}</div>
          <div class="user-acct">@{{ account.acct }}</div>
        </div>
      </UserCard>
    </template>
    <template v-else>
      <div class="avatar">
        <avatar :account="account" @click="goRouter(`/user/${account.acct}`)"></avatar>
      </div>
      <div class="userinfo" @click="goRouter(`/user/${account.acct}`)">
        <div class="user-name">{{ account.display_name }}</div>
        <div class="user-acct">@{{ account.acct }}</div>
      </div>
    </template>

    <div class="btn-block" v-if="isShowFollow">
      <FollowButton v-model="account.follower" :accountId="account.id"></FollowButton>
    </div>
    <div class="rights">
      <slot name="right"></slot>
    </div>
  </div>
  <div class="user-note" v-if="isShowNote">
    <div v-html="account.note_rendered"></div>
  </div>
</template>

<style lang="scss" scoped>
.user-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  .userinfo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    min-width: 0;
    flex-shrink: 0;
    .user-name {
      font-size: 16px;
      font-weight: bold;
      color: var(--color-neutral-10);
    }
    .user-acct {
      font-size: 14px;
      color: var(--color-neutral-6);

      // 超出隐藏
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .btn-block {
    margin-left: auto;
  }
  .rights {
    margin-left: auto;
  }
}
.user-note {
  padding: 10px;
  padding-top: 0;
  color: var(--color-neutral-8);
  padding-left: 68px;
}
</style>
