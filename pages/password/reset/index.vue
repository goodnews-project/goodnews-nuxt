<script setup>
import { resetPwdApi } from '@/api/login';
import { Message } from '@arco-design/web-vue';
const { t } = useI18n();
definePageMeta({
  layout: false,
  ssr: false,
});

const form = reactive({
  password: '',
  confirmPassword: '',
});

const resetBtnLoading = ref(false);
const route = useRoute();
const router = useRouter();
const handleSubmit = async ({ errors, values }) => {
  if (errors) {
    return;
  }
  const params = {
    password: values.password,
    token: route.query.token,
  };
  resetBtnLoading.value = true;
  const { msg } = await resetPwdApi(params).finally(() => {
    resetBtnLoading.value = false;
  });
  Message.success(msg);
  setTimeout(() => {
    router.push('/?login=true');
  }, 1000);
};

const formRules = {
  password: [
    { required: true, message: t('login.pleaseEnterPassword') },
    { minLength: 6, message: t('login.passwordLengthCannotBeLessThan', { length: 6 }) },
  ],
  confirmPassword: [
    { required: true, message: t('login.pleaseEnterConfirmPassword') },
    {
      validator: (value, cb) => {
        if (value !== form.password) {
          cb(t('login.twoPasswordsAreInconsistent'));
        } else {
          cb();
        }
      },
    },
  ],
};
const openApp = () => {
  if (route.query.token) {
    window.location.href = `mastodondapp://reset_pwd?token=${route.query.token}`;
  }
};
onMounted(async () => {
  await nextTick();
  openApp();
});
</script>

<template>
  <div class="pages">
    <div class="frame">
      <div class="logo">
        <img src="/images/logo.png" alt="" />
      </div>
      <div class="frame-title">{{ t('login.changeYourPassword') }}</div>
      <div class="content">
        <a-form :model="form" :style="{ width: '100%' }" @submit="handleSubmit" layout="vertical" :rules="formRules" size="large">
          <a-form-item field="password" :label="t('login.newPassword')">
            <a-input v-model="form.password" />
          </a-form-item>
          <a-form-item field="confirmPassword" :label="`${t('common.confirm')}${t('login.newPassword')}`">
            <a-input v-model="form.confirmPassword" />
          </a-form-item>
          <a-form-item>
            <a-button html-type="submit" long type="primary" :loading="resetBtnLoading">
              {{ `${t('common.setting')}${t('login.newPassword')}` }}
            </a-button>
          </a-form-item>
          <div class="tips">
            {{ t('login.noAccount') }}
            <nuxt-link class="blue" to="/register">
              {{ t('login.registerNow') }}
            </nuxt-link>
          </div>
        </a-form>
      </div>
      <template v-if="route.query.token">
        <iframe :src="`mastodondapp://reset_pwd?token=${route.query.token}`" style="display: none"></iframe>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pages {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  .frame {
    width: min(100vw, 800px);
    height: min(100vh, 800px);
    display: flex;
    align-items: center;
    flex-direction: column;
    .logo {
      width: 200px;
      height: 200px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .frame-title {
      font-size: 32px;
      font-weight: bold;
    }
    .content {
      width: 100%;
      padding: 2rem;
    }
    .tips {
      text-align: center;
      .blue {
        color: rgb(var(--arcoblue-6));
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
