<script setup lang="ts">
import { ref } from 'vue';
import { createFilters, getFiltersDetails } from '@/api/filters/index.js';

definePageMeta({
  layout: 'settings',
  name: 'settings-adminFilters-edit',
  middleware: ['auth'],
});

useHead({
  title: `${t('common.edit')}${t('filter.title')}`,
});

const router = useRouter();
const route = useRoute();
const id = ref(route.query.id);

const options = [
  {
    value: 0,
    label: t('filter.addFilter.neverExpires'),
  },
  {
    value: 1800,
    label: t('filter.addFilter.after30Minutes'),
  },
  {
    value: 3600,
    label: t('filter.addFilter.afterHour', { count: 1 }),
  },
  {
    value: 21600,
    label: t('filter.addFilter.afterHour', { count: 6 }),
  },
  {
    value: 43200,
    label: t('filter.addFilter.afterHour', { count: 12 }),
  },
  {
    value: 86400,
    label: t('admin.ipRules.theDay', { count: 1 }),
  },
  {
    value: 604800,
    label: t('admin.ipRules.theWeeks', { count: 1 }),
  },
];

const submitLoading = ref(false);
const ruleFormRef = ref(null);
const ruleForm = ref({
  title: '',
  expires_in: 0,
  expires_in_label: '',
  context: [],
  act: 1,
  kw_attr: [{ key: 1, kw: '', whole_word: true, destroy: false }],
});

const rules = ref<any>({
  title: [
    {
      required: true,
      message: t('filter.addFilter.pleaseEnterFilterTitle'),
      trigger: ['blur', 'change'],
    },
  ],
  context: [
    {
      required: true,
      message: t('filter.addFilter.pleaseSelectFilterEnvironment'),
      trigger: ['blur', 'change'],
    },
  ],
});

const addRules = () => {
  ruleForm.value.kw_attr.forEach((item, index) => {
    rules.value[`kw_attr.${index}.kw`] = [{ required: true, message: t('public.pleaseEnterKeywords'), trigger: ['blur', 'change'] }];
  });
};
addRules();

const addKeyList = () => {
  if (ruleForm.value.kw_attr && ruleForm.value.kw_attr.length) {
    const key = ruleForm.value.kw_attr[ruleForm.value.kw_attr.length - 1].key + 1;
    ruleForm.value.kw_attr.push({
      key,
      kw: '',
      whole_word: true,
      destroy: false,
    });
  } else {
    ruleForm.value.kw_attr = [{ key: 1, kw: '', whole_word: true, destroy: false }];
  }

  addRules();
};

const handleDelete = (index: number) => {
  ruleForm.value.kw_attr.splice(index, 1);
};

const handleAddFilters = async () => {
  if (submitLoading.value) return;
  try {
    submitLoading.value = true;
    const res = await createFilters(ruleForm.value);
    router.replace('/settings/adminFilters');
  } catch (err) {
    console.log(err);
  } finally {
    submitLoading.value = false;
  }
};
const submitForm = () => {
  handleAddFilters();
};
const detailsLoading = ref(false);
const getFiltersDetailsAsync = async (id: string) => {
  try {
    detailsLoading.value = true;
    const data = await getFiltersDetails(id);
    ruleForm.value = JSON.parse(data);
    addRules();
  } catch (err) {
    console.log(err);
  } finally {
    detailsLoading.value = false;
  }
};

watch(
  () => id.value,
  async (newValue) => {
    if (newValue) {
      getFiltersDetailsAsync(newValue as string);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="admin-roles-new">
    <PageHeader>{{ $t('filter.editFilter.editFilter') }}                                                        <template #extra></template>
                                                        </PageHeader>
    <a-spin :loading="detailsLoading">
      <a-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" class="demo-ruleForm">
        <a-form-item :label="$t('filter.editFilter.title')" prop="title">
          <a-input v-model="ruleForm.title" />
        </a-form-item>
        <a-form-item :label="$t('filter.editFilter.expiresIn')" prop="expires_in">
          <a-select v-model="ruleForm.expires_in" placeholder="Select" style="width: 100%">
            <a-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </a-select>
        </a-form-item>

        <a-form-item :label="$t('filter.editFilter.context') + ' (' + $t('filter.editFilter.filterAppEnv') + ')'" prop="context">
          <a-checkbox-group v-model="ruleForm.context">
            <a-checkbox :value="1">{{ t('filter.home') }}</a-checkbox>
            <a-checkbox :value="2">{{ t('layout.notification') }}</a-checkbox>
            <a-checkbox :value="3">{{ t('filter.public') }}</a-checkbox>
            <a-checkbox :value="4">{{ t('filter.conversation') }}</a-checkbox>
            <a-checkbox :value="5">{{ t('profile.title') }}</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item :label="$t('filter.editFilter.act') + ' (' + $t('filter.editFilter.filterAction') + ')'" prop="radioList">
          <a-radio-group v-model="ruleForm.act">
            <a-radio :value="1">
              <div>{{ t('filter.hideWarning') }}</div>
              <div>{{ t('filter.hideFilterContent') }}</div>
            </a-radio>
            <a-radio :value="2">
              <div>{{ t('filter.fullyHide') }}</div>
              <div>{{ t('filter.fullyHideDesc') }}</div>
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <div style="position: relative">
          <div class="" style="margin-bottom: 16px">
            <span class="font-bold">{{ $t('filter.editFilter.keyword') }}</span>
            <span class="font-bold" style="margin-left: calc(100% - 98px)">{{ $t('filter.editFilter.wholeWord') }}</span>
          </div>
          <span style="position: absolute; top: 6px; left: 750px" class="text-[13px] font-bold"></span>
          <a-form-item v-for="(item, index) in ruleForm.kw_attr" :key="index" label="" :prop="'kw_attr.' + index + '.kw'">
            <div class="form-wrapper">
              <a-input v-model="item.kw" />
              <a-checkbox v-model="item.whole_word"></a-checkbox>
              <!-- <PencilIcon class="w-5 h-3 ml-8" /> -->
              <span class="" style="min-width: 30px; margin-left: 4px" @click="handleDelete(index)">{{ $t('common.delete') }}</span>
            </div>
          </a-form-item>
          <a-button style="margin-bottom: 16px" @click="addKeyList" size="small">
            <Icon name="ic:baseline-plus" width="16" height="16" style="color: #666" />{{ $t('filter.editFilter.addkeyword') }}
          </a-button>
        </div>
      </a-form>
    </a-spin>

    <a-button type="primary" :disabled="submitLoading" :loading="submitLoading" color="#626aef" @click="submitForm">
      {{ $t('filter.editFilter.saveEdit') }}
    </a-button>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-form-item) {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}

:deep(.el-form-item__content) {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}

:deep(.el-divider--horizontal) {
  margin: 10px 0;
}

:deep(.el-checkbox) {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

:deep(.el-form-item__label) {
  font-size: 14px;
  font-weight: bold;
}

:deep(.el-form-item__label-wrap) {
  margin-left: 0 !important;
}

:deep(.el-checkbox) {
  margin-left: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center !important;
}

:deep(.el-radio) {
  height: auto;
  margin-left: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  div {
    line-height: 22px;
  }
}

:deep(.el-radio__input) {
  margin-top: 4px;
}

:deep(.arco-row) {
  display: flex;
  flex-flow: column nowrap;
}

:deep(.arco-form-item-label-col) {
  width: auto;
}

:deep(.arco-form-item) {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

:deep(.arco-form-item-content-flex) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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

  .header {
    margin-bottom: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .form-wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
