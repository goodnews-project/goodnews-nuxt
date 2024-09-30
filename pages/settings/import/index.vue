<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import { importData } from '@/api/setting/import';
const { t } = useI18n();

definePageMeta({
  layout: 'settings',
  name: 'settings-import',
  middleware: ['auth'],
});

useHead({
  title: t('admin.importExport.importData'),
});

const form = reactive({
  type: '1',
  file: '',
  mode: '1',
});

const uploadInput = ref<any>(null);
const handleSubmit = async (data: any) => {
  console.log('fsafsa', form.file);
  if (data.errors) {
    return;
  }

  const file = uploadInput.value.files[0];
  const formData = new FormData();
  formData.append('type', form.type);
  formData.append('file', file);
  formData.append('mode', form.mode);
  await importData(formData);
  Message.success(t('admin.importExport.import') + t('common.success'));
};

const formOptions = ref([
  {
    label: t('admin.importExport.followingList'),
    value: '1',
  },
  {
    label: t('admin.importExport.bookmark'),
    value: '2',
  },
  {
    label: t('admin.importExport.list'),
    value: '3',
  },
  {
    label: t('admin.importExport.hideList'),
    value: '4',
  },
  {
    label: t('admin.importExport.muteList'),
    value: '5',
  },
  {
    label: t('admin.importExport.domainBlockList'),
    value: '6',
  },
]);

const plainOptions = ref([
  { label: t('admin.importExport.merge'), value: '1' },
  { label: t('admin.importExport.override'), value: '2' },
]);

const validatorFile = (value: any, cb: any) => {
  console.log('value', value, cb);
  return new Promise((resolve, reject) => {
    const value = uploadInput.value.files[0];
    if (!value) {
      cb('Please enter match');
    }
    resolve(true);
  });
};
const rules = {
  file: [
    {
      validator: validatorFile,
      message: t('admin.importExport.pleaseSelectDataFile'),
      trigger: 'change',
    },
  ],
};
</script>

<template>
  <div class="pages">
    <PageHeader :showArrow="false">{{ t('admin.importExport.import') }}</PageHeader>
    <div class="main">
      <a-form :model="form" @submit="handleSubmit" layout="vertical" :rules="rules">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item field="type" :label="t('admin.importExport.importType')" :extra="t('admin.importExport.importDesc')">
              <a-select v-model="form.type" placeholder="">
                <a-option v-for="item in formOptions" :key="item.value" :value="item.value">{{ item.label }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="16">
            <a-form-item field="file" :label="t('admin.importExport.dataFile')" :extra="t('admin.importExport.dataFileDesc')">
              <input :value="form.file" type="file" ref="uploadInput" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="mode">
              <a-radio-group v-model="form.mode" :options="plainOptions" direction="vertical" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item>
          <a-button html-type="submit" long type="primary">{{ t('common.upload') }}</a-button>
        </a-form-item>
      </a-form>
    </div>
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
    margin-bottom: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
