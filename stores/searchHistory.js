import { defineStore } from 'pinia';

export const useSearchStore = defineStore('searchHistory', {
  state: () => {
    return {
      history: [],
    };
  },
  actions: {
    searchHistory(info) {
      if (this.history.length >= 10) {
        this.history.pop();
      }
      this.history.unshift(info);
    },
    removeHistory(index) {
      this.history.splice(index, 1);
    },
    removeAll() {
      this.history.splice(0, this.history.length);
    },
  },
  persist: process.client && {
    storage: localStorage,
  },
});
