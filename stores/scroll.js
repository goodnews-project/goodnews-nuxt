import { defineStore } from 'pinia';

export const useScrollStore = defineStore('scrollCache', {
  state: () => ({
    scrollCache: {},
  }),
  actions: {
    setScrollCache(key, data) {
      this.scrollCache[key] = data;
    },
    getScrollCache(key) {
      return this.scrollCache[key] || 0;
    },
  },
});
