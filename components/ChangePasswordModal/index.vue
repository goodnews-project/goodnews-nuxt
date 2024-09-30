<script setup>
import { changePwdApi } from '@/api/login';
import { storeToRefs } from 'pinia';
import { useModalStore } from '@/stores/modal';
import { Message } from '@arco-design/web-vue';
const changePwdModalStore = useModalStore();
const { isShowModal } = storeToRefs(changePwdModalStore);

const { t } = useI18n();
// 状态
const loading = ref(false);
const loginForm = reactive({
  oldPassword: '',
  password: '',
  confirmPassword: '',
});

const userStore = useUserStore();
const router = useRouter();
const handleSubmit = async () => {
  loading.value = true;
  try {
    if (loginForm.password !== loginForm.confirmPassword) {
      Message.error(t('password.twoPasswordsNotMatch'));
      return;
    }

    await changePwdApi(loginForm.oldPassword, loginForm.password);
    Message.success(t('password.newPasswordsSetSuccessly'));
    closeModel();

    // 延时1秒后退出登录
    setTimeout(() => {
      userStore.logout();
      router.push('/?login=true');
    }, 1000);
  } catch (error) {
    console.error('Change password failed:', error);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  closeModel();
};

const closeModel = () => {
  // 重置表单
  loginForm.oldPassword = '';
  loginForm.password = '';
  loginForm.confirmPassword = '';
  changePwdModalStore.closeModal();
};
</script>

<template>
  <ClientOnlyAModal
    class="changePasswordModal"
    v-model:visible="isShowModal"
    @cancel="handleCancel"
    :unmount-on-close="true"
    :mask-closable="false"
    :footer="false"
  >
    <template #title></template>
    <div class="modal-content">
      <div class="title">
        {{ t('login.changePassword') }}
      </div>
      <a-form :model="loginForm" @submit="handleSubmit" layout="vertical">
        <a-form-item :label="t('login.currentPassword')" :rules="[{ required: true, message: `${t('login.currentPassword')}${t('common.required')}` }]">
          <a-input-password v-model="loginForm.oldPassword" autocomplete="off" allow-clear />
        </a-form-item>
        <a-form-item :label="t('login.newPassword')" :rules="[{ required: true, message: `${t('login.newPassword')}${t('common.required')}` }]">
          <a-input-password v-model="loginForm.password" autocomplete="off" allow-clear />
        </a-form-item>
        <a-form-item :label="t('login.confirmPassword')" :rules="[{ required: true, message: `${t('login.confirmPassword')}${t('common.required')}` }]">
          <a-input-password v-model="loginForm.confirmPassword" autocomplete="off" allow-clear />
        </a-form-item>

        <a-button html-type="submit" long type="primary" :loading="loading">{{ t('login.changePassword') }}</a-button>
      </a-form>
    </div>
  </ClientOnlyAModal>
</template>

<style scoped lang="scss">
.changePasswordModal {
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

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.title {
  font-size: 24px;
  font-weight: bold;
}
</style>
