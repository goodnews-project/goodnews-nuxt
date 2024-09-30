<script setup>
// import { Message } from '@arco-design/web-vue'
import { getRuleList, addRule, deleteRule } from '@/api/setting/rule';
const { t } = useI18n();
definePageMeta({
  layout: 'settings',
  name: 'settings-rule',
  middleware: ['auth'],
});

useHead({
  title: t('admin.rule.rules'),
});

const formValue = reactive({
  text: '',
});

const clearInput = () => {
  formValue.text = '';
};
const ruleList = ref([]);
const pageLoading = ref(false);

const getRule = async () => {
  try {
    pageLoading.value = true;
    const res = await getRuleList();
    console.log('res', res);
    ruleList.value = res || [];
    return Promise.resolve();
  } finally {
    pageLoading.value = false;
  }
};
getRule();
const onSubmit = async () => {
  try {
    pageLoading.value = true;
    const params = {
      text: formValue.text,
    };
    const res = await addRule(params);
    await getRule();
    clearInput();
  } finally {
    pageLoading.value = false;
  }
};
const removeId = ref('');
const removeRule = (item) => {
  console.log('item', item);
  visible.value = true;
  removeId.value = item.id;
  console.log('removeId.value', removeId.value);
};
const visible = ref(false);
const handleOk = async () => {
  try {
    pageLoading.value = true;
    await deleteRule(removeId.value);
    await getRule();
    removeId.value = '';
    visible.value = false;
  } finally {
    pageLoading.value = false;
  }
};
const handleCancel = async () => {
  visible.value = false;
};
</script>

<template>
  <a-spin :loading="pageLoading">
    <div class="pages">
      <PageHeader :showArrow="false">
        {{ $t('admin.rule.title') }}
      </PageHeader>
      <div class="desc">
        {{ $t('admin.rule.descOne') }}
        <strong> {{ $t('admin.rule.descTwo') }}</strong>
        {{ $t('admin.rule.descThree') }}
      </div>
      <a-form :model="formValue" auto-label-width>
        <a-form-item>
          <div class="form-item">
            <div class="item-name">{{ $t('admin.rule.rules') }}</div>
            <div class="item-desc">{{ $t('admin.rule.descEazy') }}</div>
            <a-textarea
              v-model="formValue.text"
              :auto-size="{
                minRows: 5,
                maxRows: 99,
              }"
              allow-clear
            ></a-textarea>
          </div>
        </a-form-item>
        <a-form-item>
          <a-button @click="onSubmit" type="primary" long :disabled="!formValue.text">{{ $t('common.add') }} {{ $t('admin.rule.rules') }}</a-button>
        </a-form-item>
      </a-form>
      <div class="rule-list">
        <div class="rule-item" v-for="(item, index) in ruleList" :key="item.id">
          <div class="rule-item-title">{{ `${index + 1}. ${item.text}` }}</div>
          <div class="rule-item-content">
            <div class="rule-text">{{ item.text }}</div>
            <a-link class="remove-icon" @click="removeRule(item)">
              <Icon name="solar:trash-bin-minimalistic-bold"></Icon>
              <span>{{ $t('common.delete') }}</span>
            </a-link>
          </div>
        </div>
      </div>
      <ClientOnlyAModal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" simple>
        <template #title> {{ t('admin.rule.deleteRule') }}</template>
      </ClientOnlyAModal>
    </div>
  </a-spin>
</template>

<style lang="scss" scoped>
:deep(.arco-textarea) {
  background: #fff;
}
:deep(.arco-form-item-label-col) {
  padding-right: 0;
}
.pages {
  padding: 55px 25px;
  .header {
    padding: 0;
  }
  .desc {
    font-size: 17px;
    line-height: 22px;
  }
  .arco-form {
    margin-top: 20px;
  }
}

.form-item {
  display: flex;
  flex-direction: column;
  flex: 1;
  .item-name {
    height: 20px;
    font-size: 16px;
    color: #303133;
  }
  .item-desc {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }
  .input-file {
    --height: 28px;
    height: var(--height);
    line-height: var(--height);
    line-height: normal;
    width: 400px;
  }
}
.rule-list {
  margin-top: 20px;
  .rule-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 20px;
    background: var(--color-neutral-1);
    border-radius: 4px;
    padding: 10px;
    .rule-item-title {
      font-size: 18px;
    }
    .rule-item-content {
      display: flex;
      justify-content: space-between;
      .rule-text {
        flex: 1;
        font-size: 14px;
        color: var(--color-neutral-6);
      }
      .remove-icon {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: var(--color-neutral-8);
        cursor: pointer;
        svg {
          width: 16px;
          height: 16px;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
