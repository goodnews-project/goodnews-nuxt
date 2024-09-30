<script setup>
import { ref, reactive } from 'vue';
import { sendEmail } from '@/api/register';
import { Message } from '@arco-design/web-vue';
const { t } = useI18n();
const email = defineModel();
let loading = ref(false);
async function loginSubmit() {
  loading.value = true;
  const params = {
    email: email.value,
  };
  try {
    await sendEmail(params);
    arrowSubmit.value = false;
    Message.success(t('register.emailSuccess'));
  } finally {
    loading.value = false;
  }
}
const emits = defineEmits(['stepChange']);
const goBack = () => {
  emits('stepChange', false);
};
const arrowSubmit = ref(false);
</script>
<template>
  <div class="main">
    <h2 class="title">{{ t('register.checkEmail') }}</h2>
    <div class="content-container">
      <a-input v-model="email" name="email" type="email" autocomplete="email" />
      <template v-if="arrowSubmit">
        <a-button @click="loginSubmit" type="primary" :loading="loading">
          <span>{{ t('register.resendEmail') }}</span>
        </a-button>
      </template>
      <template v-else>
        <a-button disabled type="primary" class="countdown">
          <div style="display: flex; gap: 4px; align-items: center">
            <a-countdown :value="Date.now() + 60 * 1000" format="ss " @finish="arrowSubmit = true" />
            {{ t('register.resendAfterSeconds') }}
          </div>
        </a-button>
      </template>
      <a-button @click="goBack" :disabled="loading">
        <span>{{ t('common.back') }}</span>
      </a-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  text-align: center;
  margin-top: 20px;
  width: 400px;
  .title {
    font-size: 24px;
  }
  .content-container {
    width: 100%;
    padding: 0 40px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
    .countdown {
    }
    :deep(.arco-statistic-content .arco-statistic-value) {
      --color-text-1: #fff;
      font-size: 14px;
    }
    .btn-block {
      display: flex;
      flex-direction: column;
      gap: 10px;
      --border-radius-small: 6px;
    }
  }
}
</style>
