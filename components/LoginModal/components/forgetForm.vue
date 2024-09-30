<script setup>
import { Message } from '@arco-design/web-vue';
const { t } = useI18n();
const formValue = reactive({
  email: '',
});
const model = defineModel();
const goLogin = () => {
  model.value = 'login';
};
const rules = {
  email: [
    { required: true, message: t('forget.pleaseInput'), trigger: 'blur' },
    { type: 'email', message: t('forget.emailFormatError'), trigger: 'blur' },
  ],
};
import { forgetPwdApi } from '@/api/login';
const submitLoading = ref(false);
const sendEmail = async (validate) => {
  if (validate.errors) {
    return;
  }
  submitLoading.value = true;
  const { email } = formValue;
  const emailRes = await forgetPwdApi(email).finally(() => {
    submitLoading.value = false;
  });
  if (emailRes) {
    Message.success(emailRes.msg);
    startCountDown();
  }
};

const countDown = ref(0);
const countDownTimer = ref(null);
const startCountDown = () => {
  countDown.value = 60;
  countDownTimer.value = setInterval(() => {
    countDown.value -= 1;
    if (countDown.value === 0) {
      clearInterval(countDownTimer.value);
    }
  }, 1000);
};
</script>

<template>
  <div class="title">
    {{ t('login.forgetPassword') }}
  </div>
  <a-form :model="formValue" @submit="sendEmail" layout="vertical" :rules="rules">
    <a-form-item field="email" :label="t('login.email')">
      <a-input v-model="formValue.email" :placeholder="`${t('common.pleaseInput')}${t('login.email')}`" />
    </a-form-item>
    <template v-if="!countDown">
      <a-button html-type="submit" long type="primary" :loading="submitLoading" :disabled="!formValue.email">{{ t('forget.sendEmail') }}</a-button>
    </template>
    <template v-else>
      <a-button long type="primary" disabled>{{ t('forget.resendAfterSeconds', { seconds: countDown }) }}</a-button>
    </template>
  </a-form>
  <div class="noAccount">
    {{ t('forget.haveAccount') }}
    <a-link @click="goLogin">
      {{ t('forget.clickToLogin') }}
    </a-link>
  </div>
</template>

<style lang="scss" scoped>
.title {
  font-size: 24px;
  margin-top: 20px;
  font-weight: bold;
}
</style>
