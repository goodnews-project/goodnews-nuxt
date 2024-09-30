import { defineStore } from 'pinia';

export const useRouterStore = defineStore('router', {
  state: () => {
    return {
      accountInfo: {},
      tweetList: {},
    };
  },
  actions: {
    updateAccountInfo(accountInfo) {
      this.accountInfo = accountInfo;
    },
    updateTweetList(tweetList) {
      this.tweetList = tweetList;
    },
  },
  persist: process.client && {
    storage: sessionStorage,
  },
});
