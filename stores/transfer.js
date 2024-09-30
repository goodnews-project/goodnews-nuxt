import { defineStore } from 'pinia';

export const useTransferStore = defineStore({
  id: 'transfer',
  state: () => ({
    roleId: '',
    roleName: '',
    notificationsNum: 0,
    followRequestsNum: 0,
    manuallyApprovesFollower: 0,
  }),

  getters: {},
  actions: {
    setRoleId(roleId) {
      this.roleId = roleId;
    },
    setRoleName(roleName) {
      this.roleName = roleName;
    },
    setNotificationsNum(notificationsNum) {
      this.notificationsNum = notificationsNum;
    },
    setFollowRequestsNum(followRequestsNum) {
      this.followRequestsNum = followRequestsNum;
    },
    setManuallyApprovesFollower(num) {
      this.manuallyApprovesFollower = num;
    },
  },
  persist: process.client && {
    enabled: true,
    strategies: [
      {
        key: 'transfer',
        storage: localStorage,
      },
    ],
  },
});
