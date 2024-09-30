<script setup>
import { register } from '@/api/register';
import { Message } from '@arco-design/web-vue';
import { getLanguage } from '@/utils';
let loading = ref(false);
const { t } = useI18n();
const rules = {
  username: [
    { required: true, message: t('register.onlyInput'), trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]+$/, message: t('register.onlyInput'), trigger: 'blur' },
  ],
  display_name: [{ required: true, trigger: 'blur', message: t('register.required') }],
  email: [
    { required: true, trigger: 'blur', message: t('register.required') },
    { type: 'email', trigger: 'blur', message: t('register.emailRule') },
  ],
  password: [{ required: true, trigger: 'blur', message: t('register.required') }],
};
let loginForm = ref({
  username: '',
  display_name: '',
  email: '',
  password: '',
  locale: '',
});
async function registerSubmit(data) {
  if (data.errors && Object.keys(data.errors).length) {
    return;
  }
  const lang = getLanguage();
  loginForm.value.locale = lang;
  loading.value = true;
  try {
    await register(loginForm.value);
    Message.success(t('register.registerSuccess'));
    emits('saveEmail', loginForm.value.email);
    emits('stepChange', true);
  } finally {
    loading.value = false;
  }
}
const emits = defineEmits(['stepChange', 'saveEmail']);
const goBack = () => {
  emits('stepChange', false);
};

const domain = computed(() => {
  const host = import.meta.env.VITE_BASE_API;
  const domain = host.replace(/(https:\/\/|http:\/\/)/, '');
  return domain;
});
</script>

<template>
  <div class="main">
    <h2 class="title">{{ t('register.registerNewAccount') }}</h2>
    <div class="content-container">
      <a-form layout="vertical" :rules="rules" :model="loginForm" @submit="registerSubmit">
        <a-form-item field="username" :label="t('public.account')" :tooltip="t('register.onlyInput')">
          <a-input v-model.trim="loginForm.username" :title="t('register.onlyInput')">
            <template #append> @{{ domain }} </template>
          </a-input>
        </a-form-item>
        <a-form-item field="display_name" :label="t('public.nickname')">
          <a-input v-model.trim="loginForm.display_name" />
        </a-form-item>
        <a-form-item field="email" :label="t('login.email')">
          <a-input v-model.trim="loginForm.email" />
        </a-form-item>
        <a-form-item field="password" :label="t('login.password')">
          <a-input-password v-model.trim="loginForm.password" />
        </a-form-item>
        <div class="btn-block">
          <a-button long type="primary" :loading="loading" html-type="submit">{{ t('register.register') }}</a-button>
          <a-button
            long
            @click="goBack"
            :disabled="loading"
            class="border text-gray-700 flex items-center w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed mt-4"
          >
            <span>{{ t('common.back') }}</span>
          </a-button>
        </div>
      </a-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  text-align: center;
  margin-top: 20px;
  width: min(400px, 100%);
  // width: 400px;
  .title {
    font-size: 24px;
  }
  .content-container {
    width: 100%;
    padding: 0 20px;
    .btn-block {
      display: flex;
      flex-direction: column;
      gap: 10px;
      --border-radius-small: 6px;
    }
  }
}
</style>
