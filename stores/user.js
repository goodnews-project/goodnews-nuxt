import { defineStore } from 'pinia';
import { setToken, removeToken, removeUser, getUser } from '@/utils/auth.js';
import { manualFetch } from '@/api/base.js';
import { useSearchStore } from './searchHistory';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: {},
    };
  },
  getters: {
    userInfo(state) {
      return state.user;
    },
  },
  actions: {
    login(data) {
      this.user = data.account;
      setToken(data.token, data.expire);
      setUser(data.account, data.expire);
    },
    logout() {
      this.user = null;
      removeToken();
      removeUser();
      useSearchStore().removeAll();
      this.$reset();
    },
    async updateUserInfo(name = getUser().value.acct) {
      try {
        const res = await manualFetch(`/_api/v1/account/${name}`);
        this.user = res.account;
        setUser(this.user, 86400);
        return res;
      } catch (error) {
        console.error('Failed to update user info:', error);
      }

    },
  },
  persist: process.client && {
    storage: localStorage,
  },
});
