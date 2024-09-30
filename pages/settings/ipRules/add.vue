<script setup>
definePageMeta({
  layout: 'settings',
  name: 'settings-ipRules-add',
  middleware: ['auth'],
});
import { createIpRules } from '@/api/admin/ipRules';

const router = useRouter();

const loading = ref(false);
const ruleFormRef = ref(null);
const ruleForm = ref({
  ip: '',
  expires_in: '31536000',
  severity: '1',
});
const rules = ref({
  ip: [{ required: true, message: t('admin.ipRules.pleaseEnterIpAddress'), trigger: ['blur', 'change'] }],
  severity: [{ required: true, message: t('admin.ipRules.pleaseSelectRule'), trigger: ['blur', 'change'] }],
});

const submitForm = async (validate) => {
  if (loading.value) return;
  if (validate.errors) return;
  loading.value = true;
  await createIpRules(ruleForm.value).finally(() => {
    loading.value = false;
  });
  router.go(-1);
};
</script>
<template>
  <div class="email-bomain-blocks-new">
    <PageHeader>{{ t('admin.ipRules.createNewIpRule') }}</PageHeader>
    <a-form ref="ruleFormRef" :model="ruleForm" :rules="rules" layout="vertical" @submit="submitForm">
      <a-form-item :label="t('admin.ipRules.ip')" field="ip">
        <a-input v-model="ruleForm.ip" placeholder="192.0.2.0/24" />
        <template #extra>
          <div class="desc">{{ t('admin.ipRules.inputIpv4OrIpv6') }}</div>
        </template>
      </a-form-item>
      <a-form-item :label="t('admin.ipRules.expirationTime')" field="expires_in">
        <a-select v-model="ruleForm.expires_in">
          <a-option value="86400">{{ t('admin.ipRules.theDay', { count: 1 }) }}</a-option>
          <a-option value="1209600">{{ t('admin.ipRules.theWeeks', { count: 2 }) }}</a-option>
          <a-option value="2592000">{{ t('admin.ipRules.theMonth', { count: 1 }) }}</a-option>
          <a-option value="15552000">{{ t('admin.ipRules.theMonth', { count: 6 }) }}</a-option>
          <a-option value="31536000">{{ t('admin.ipRules.theYear', { count: 1 }) }}</a-option>
          <a-option value="94608000">{{ t('admin.ipRules.theYear', { count: 3 }) }}</a-option>
        </a-select>
        <template #extra>
          <div class="desc">{{ t('admin.ipRules.ipDescTwo') }}</div>
        </template>
      </a-form-item>
      <a-form-item :label="t('admin.ipRules.rule')" field="severity">
        <a-radio-group v-model="ruleForm.severity">
          <a-radio value="1">
            <div class="severity-name">{{ t('admin.ipRules.limitRegistration') }}</div>
            <div class="severity-desc">{{ t('admin.ipRules.newRegistrationRequiresYourApproval') }}</div>
          </a-radio>
          <a-radio value="2">
            <div class="severity-name">{{ t('admin.ipRules.blockAccountRegistration') }}</div>
            <div class="severity-desc">{{ t('admin.ipRules.unableToRegisterNewAccount') }}</div>
          </a-radio>
          <a-radio value="3">
            <div class="severity-name">{{ t('admin.ipRules.blockAccess') }}</div>
            <div class="severity-desc">{{ t('admin.ipRules.blockAccessToAllResources') }}</div>
          </a-radio>
        </a-radio-group>
        <template #extra>
          <div class="desc">{{ t('admin.ipRules.chooseHowToHandleRequestsFromThisIp') }}</div>
        </template>
      </a-form-item>
      <a-form-item :label="t('admin.ipRules.note')" field="comment">
        <a-input v-model="ruleForm.comment" />
        <template #extra>
          <div class="desc">{{ t('admin.ipRules.optional') }}</div>
        </template>
      </a-form-item>
      <a-button type="primary" html-type="submit" :disabled="loading" :loading="loading">{{ t('common.save') }}</a-button>
    </a-form>
  </div>
</template>

<style lang="scss" scoped>
.severity-desc {
  font-size: 12px;
  color: var(--color-neutral-6);
}
.email-bomain-blocks-new {
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
