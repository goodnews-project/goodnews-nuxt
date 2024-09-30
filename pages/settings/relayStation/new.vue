<script setup>
import { addAndEnable } from '~/api/admin/relay';
import { Message } from '@arco-design/web-vue';
const { t } = useI18n();
definePageMeta({
  layout: 'settings',
  name: 'settings-relayStation-new',
  middleware: ['auth'],
});

const formValue = ref({
  inbox_url: '',
});

const rules = ref({
  inbox_url: [{ required: true, message: t('admin.relay.pleaseEnterRelayDomain'), trigger: ['blur', 'change'] }],
});

const loading = ref(false);
const submitForm = async ({ inbox_url }) => {
  loading.value = true;
  await addAndEnable({ inbox_url }).finally(() => {
    loading.value = false;
  });
  Message.success(t('common.add') + t('common.success'));
  formValue.value = { inbox_url: '' };
};
</script>

<template>
  <div class="pages">
    <PageHeader>{{ t('admin.relay.subscribeNewRelay') }}</PageHeader>
    <a-form ref="ruleFormRef" :model="formValue" :rules="rules" layout="vertical" @submit-success="submitForm">
      <a-form-item :label="t('admin.relay.relayInboxUrl')" field="inbox_url">
        <a-input v-model="formValue.inbox_url" :placeholder="t('admin.relay.pleaseEnterRelayUrl')" />
        <template #extra>
          <div class="desc">{{ t('admin.relay.copyUrlFromRelay') }}</div>
        </template>
      </a-form-item>
      <a-button type="primary" html-type="submit" :disabled="loading" :loading="loading">{{ t('common.save') }}</a-button>
    </a-form>
  </div>
</template>

<style scoped lang="scss">
.pages {
  padding: 55px 25px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  .header {
    padding: 0;
  }
  .arco-form {
    margin-top: 20px;
    .desc {
      margin-top: 8px;
    }
  }
}
</style>
