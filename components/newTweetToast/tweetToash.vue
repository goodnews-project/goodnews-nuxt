<script setup>
const props = defineProps({
  accounts: {
    type: Array,
    required: true,
  },
  onClick: {
    type: Function,
    required: true,
  },
  isShowNav: {
    type: Boolean,
    default: false,
  },
});

import defaultAvatar from '@/assets/images/default-avatar.jpg';
const renderAvatar = (account) => {
  return account?.avatar || defaultAvatar;
};
import useScroll from '@/hooks/useScroll';
const backTop = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const step = Math.floor(scrollTop / 20);
  const timer = setInterval(() => {
    if (document.documentElement.scrollTop > 0) {
      document.documentElement.scrollTop -= step;
    } else {
      document.documentElement.scrollTop = 0;
      clearInterval(timer);
    }
  }, 10);
  props.onClick();
};

import backTopIcon from '@/assets/images/backTop.png';
</script>

<template>
  <div class="notification" @click="backTop" :style="{ '--top-offset': isShowNav ? '40px' : '0px' }">
    <div class="backTop">
      <img :src="backTopIcon" style="width: 1.25rem" />
    </div>
    <div class="avatar-box flex -space-x-2">
      <img v-for="account in props.accounts" :key="account.id" :src="renderAvatar(account)" alt="avatar" class="avatar" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.notification {
  --theme-color: rgb(var(--arcoblue-6));
  --top-offset: 0px;
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  display: flex;
  align-items: center;
  background-color: var(--theme-color);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease-out;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  .backTop {
    --arrow-size: 1.25rem;
    width: var(--arrow-size);
    height: var(--arrow-size);
  }
  &:hover {
    --theme-color: rgb(var(--arcoblue-5));
  }
  .avatar-box {
    display: flex;
    margin-left: 10px;
    flex-direction: row-reverse;
  }
  .avatar {
    border: 3px solid var(--theme-color);

    --size: 2rem;
    width: var(--size);
    height: var(--size);
    border-radius: 9999px;
    margin-left: -10px;
    &:nth-child(1) {
      z-index: 1;
    }
    &:nth-child(2) {
      z-index: 2;
    }
    &:nth-child(3) {
      z-index: 3;
    }
  }

  .text {
    font-size: 16px;
  }
}

@include respond('phone') {
  .notification {
    top: calc(80px + var(--top-offset));
    padding: 0.35rem 0.75rem;
    gap: 4px;
    .backTop {
      --arrow-size: 1rem;
    }
    .avatar {
      --size: 1.75rem;
    }
  }
}
</style>
