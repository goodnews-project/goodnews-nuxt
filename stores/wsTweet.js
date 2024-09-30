export const useWsTweetStore = defineStore('wsTweet', {
  state: () => ({
    home: [],
    local: [],
    common: [],
  }),
  actions: {
    addData(data, type) {
      this[type].unshift(data);
    },
    // 丢出数据，同时清空
    popData(type) {
      const data = this[type];
      this[type] = [];
      return data;
    },
    getData(type) {
      return this[type];
    },
    // 全部清空
    clearAll() {
      this.home = [];
      this.local = [];
      this.common = [];
    },
  },
});
