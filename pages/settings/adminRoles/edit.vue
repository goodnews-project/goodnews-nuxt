<script setup lang="ts">
import { ref } from 'vue';
import { editRole, getEditRoles } from '@/api/admin/index.js';
import { useTransferStore } from '@/stores/transfer';
const { t } = useI18n();
definePageMeta({
  layout: 'settings',
  name: 'settings-adminRoles-edit',
  middleware: ['auth'],
});

useHead({
  title: `${t('common.edit')}${t('admin.role.title')}`,
});

const route = useRoute();
const router = useRouter();
const transferStore = useTransferStore() as any;

const loading = ref(false);
const pageLoading = ref(false);
const ruleFormRef = ref(null);
const ruleForm = ref<any>({
  name: transferStore.roleName || '',
  ids: [],
});
const rules = ref({
  name: [
    { required: true, message: t('admin.role.pleaseEnterRoleName'), trigger: ['blur', 'change'] },
    {
      min: 3,
      max: 15,
      message: t('admin.role.roleNameLength', { lengthRange: '3-15' }),
      trigger: ['blur', 'change'],
    },
  ],
});

const editRoles = ref<any>({});
const getEditRolesAsync = async () => {
  try {
    pageLoading.value = true;
    const res = await getEditRoles(route.query.id || '');
    editRoles.value = res || {};
  } catch (err) {
    console.log(err);
  } finally {
    pageLoading.value = false;
  }
};
getEditRolesAsync();

watch(
  () => editRoles.value,
  (newValue, oldValue) => {
    const tempArr = [];
    for (const key in newValue) {
      if (Object.hasOwnProperty.call(newValue, key)) {
        const element = newValue[key];
        console.log(element);
        for (const item of element) {
          if (item.is_check) {
            tempArr.push(item.id);
          }
        }
      }
    }
    ruleForm.value.ids = tempArr;
  },
  {
    deep: true,
  }
);

const handleEditRole = async () => {
  if (loading.value) return;
  try {
    loading.value = true;

    const params = {
      id: route.query.id || '',
      role: { name: ruleForm.value.name },
      permission: { ids: ruleForm.value.ids },
    };

    const res = await editRole(params);
    router.replace('/settings/adminRoles');
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const submitForm = () => {
  handleEditRole();
};
</script>

<template>
  <div class="admin-roles-new">
    <PageHeader>{{ t('common.edit') }}{{ t('admin.role.title') }}</PageHeader>
    <a-spin :loading="pageLoading">
      <a-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" class="demo-ruleForm" auto-label-width>
        <a-form-item :label="t('admin.role.name')" prop="name">
          <a-input v-model="ruleForm.name" />
          <div style="font-size: 12px">{{ t('admin.role.nameDesc') }}</div>
        </a-form-item>

        <div v-for="(value, key) in editRoles" :key="key">
          <div style="font-size: 14px; font-weight: bold">
            {{ $t(`admin.role.${key}`) }}
          </div>
          <a-divider />
          <div v-for="item in value" :key="item.id">
            <a-form-item label="">
              <a-checkbox v-model="item.is_check">{{ $t(`admin.role.${item.name}`) }}</a-checkbox>
            </a-form-item>
          </div>
        </div>
      </a-form>
    </a-spin>
    <a-button type="primary" :disabled="loading" :loading="loading" @click="submitForm"> {{ t('common.edit') }}{{ t('admin.role.title') }} </a-button>
  </div>
</template>

<style lang="scss" scoped>
:deep(.arco-row) {
  display: flex;
  flex-flow: column nowrap;
}

:deep(.arco-form-item-content-flex) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

:deep(.arco-divider-horizontal) {
  margin: 10px 0 !important;
}

:deep(.arco-form-item-label-col) {
  display: none;
}

:deep(.header) {
  padding: 4px 0;
}

.admin-roles-new {
  padding: 55px 25px 50px 25px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}
</style>
