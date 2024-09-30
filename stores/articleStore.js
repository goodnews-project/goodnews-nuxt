import { defineStore } from 'pinia';

export const useArticleStore = defineStore('articleStore', {
  state: () => ({
    readArticleIds: [],
  }),
  actions: {
    addArticleId(id) {
      if (!this.readArticleIds.includes(id)) {
        this.readArticleIds.push(id);
      }
    },
    clearArticleIds() {
      this.readArticleIds = [];
    },
  },
});
