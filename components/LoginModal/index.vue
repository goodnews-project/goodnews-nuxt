<script setup>
import { storeToRefs } from 'pinia';
import { useLoginModalStore } from '@/stores/loginModal';
const loginModalStore = useLoginModalStore();
const { isShowLogin } = storeToRefs(loginModalStore);
const handleOk = () => {
  console.log('ok');
  closeModel();
};
const handleCancel = () => {
  console.log('cancel');
  closeModel();
};

const route = useRoute();
const router = useRouter();

const closeModel = () => {
  loginModalStore.closeLoginModal();
  modalType.value = 'login';

  const query = route.query;
  if (query.login === 'true') {
    router.replace({
      query: {
        ...query,
        login: undefined,
      },
    });
  }
};
import loginForm from './components/loginForm.vue';
import forgetForm from './components/forgetForm.vue';
const modalType = ref('login');

watchEffect(() => {
  const query = route.query;
  if (query.login === 'true') {
    loginModalStore.openLoginModal();
  }
});
</script>

<template>
  <ClientOnlyAModal
    class="loginModal"
    v-model:visible="isShowLogin"
    @ok="handleOk"
    @cancel="handleCancel"
    :unmount-on-close="true"
    :mask-closable="false"
    :footer="false"
  >
    <template #title></template>
    <div class="modal-content">
      <div class="logo">
        <img src="/images/logo.png" alt="" />
      </div>
      <loginForm v-model="modalType" v-if="modalType === 'login'"></loginForm>
      <forgetForm v-model="modalType" v-if="modalType === 'forget'"></forgetForm>
    </div>
  </ClientOnlyAModal>
</template>

<style lang="scss" scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  .logo {
    width: 50%;
    height: 100px;
    img {
      object-fit: contain;
    }
  }
}
</style>
<style lang="scss">
.loginModal {
  .arco-modal {
    width: min(calc(100% - 20px), 520px);
  }
  .arco-modal-header {
    border-bottom: none;
  }
  .arco-modal-body {
    padding-top: 0;
  }
}
</style>
