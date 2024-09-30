import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    isShowModal: false,
    showModalType: ''
  }),
  actions: {
    openChangePwdModal() {
      this.isShowModal = true
      this.showModalType = 'changePwd'
    },

    closeModal() {
      this.isShowModal = false
      this.showModalType = ''
    }
  }
})

