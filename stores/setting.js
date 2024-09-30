import { defineStore } from 'pinia';
import { getInstance } from '@/api/setting';

export const useSettingStore = defineStore('setting', {
  state: () => ({
    data: {},
  }),
  getters: {
    setting: (state) => {
      return state.data;
    },
  },
  actions: {
    async getData() {
      if (Object.keys(this.data).length) {
        return this.data;
      }

      const data = await this.refresh();
      return data;
    },
    async refresh() {
      const { data: res } = await getInstance();
      this.data = res.value || {};
      return this.data;
    },
    reset() {
      this.data = {};
    },
  },
});
