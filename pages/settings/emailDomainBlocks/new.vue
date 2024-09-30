<script setup>
const { t } = useI18n();
definePageMeta({
  layout: 'settings',
  name: 'settings-emailDomainBlocks-new',
  middleware: ['auth'],
});
import { createEmailDomainBlocks } from '@/api/admin/emailDomainBlocks';

const router = useRouter();

const loading = ref(false);
const ruleFormRef = ref(null);
const ruleForm = ref({
  domain: '',
});
const rules = ref({
  domain: [{ required: true, message: t('admin.emailDomain.pleaseEnterBlocked'), trigger: ['blur', 'change'] }],
});

const createEmailDomainBlocksAsync = async () => {
  if (loading.value) return;
  try {
    loading.value = true;

    const params = {
      domain: ruleForm.value.domain,
    };

    await createEmailDomainBlocks(params);
    router.go(-1);
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
const submitForm = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.validate((errors) => {
    if (!errors) {
      createEmailDomainBlocksAsync();
    }
  });
};
</script>
<template>
  <div class="email-bomain-blocks-new">
    <PageHeader>{{ t('admin.emailDomain.add') }}</PageHeader>
    <a-form ref="ruleFormRef" :model="ruleForm" :rules="rules" layout="vertical">
      <a-form-item :label="t('public.domain')" field="domain">
        <a-input v-model="ruleForm.domain" />
        <template #extra>
          <div class="desc">{{ t('admin.emailDomain.desc') }}</div>
        </template>
      </a-form-item>
    </a-form>
    <a-button type="primary" :disabled="loading" :loading="loading" @click="submitForm">{{ t('common.save') }}</a-button>
  </div>
</template>

<style lang="scss" scoped>
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
