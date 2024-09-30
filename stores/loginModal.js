import { defineStore } from 'pinia';

export const useLoginModalStore = defineStore('loginModal', {
  state: () => {
    return {
      isShowLogin: !!useRoute().query.login && !getUser().value,
    };
  },
  actions: {
    openLoginModal() {
      this.isShowLogin = true;
    },
    closeLoginModal() {
      this.isShowLogin = false;
    },
  },
});
