<template>
  <div class="follow-button">
    <a-button
      v-if="!modelValue"
      @click.stop="follow"
      type="primary"
      shape="round"
      :loading="loading"
    >
      {{ t('account.following') }}
    </a-button>
    <a-button v-else @click.stop="unFollow" shape="round" :loading="loading">
      {{ t('account.unFollow') }}
    </a-button>
  </div>
</template>
<script setup>
import { manualFetch } from '~/api/base';

const { t } = useI18n();
const props = defineProps({
  accountId: {
    type: [String, Number],
    default: '',
  },
});
const loading = ref(false);
const modelValue = defineModel();

async function follow() {
  loading.value = true;

  await manualFetch('/_api/v1/follow', {
    method: 'put',
    body: { account_id: props.accountId },
  }).finally(() => {
    loading.value = false;
  });

  modelValue.value = true;
}

async function unFollow() {
  loading.value = true;
  await manualFetch('/_api/v1/un-follow', {
    method: 'put',
    body: { account_id: props.accountId },
  }).finally(() => {
    loading.value = false;
  });

  modelValue.value = false;
}
</script>
