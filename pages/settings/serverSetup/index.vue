<script setup lang="ts">
import { ref, toRaw, provide } from 'vue';
import { Message } from '@arco-design/web-vue';
import * as asyncFunctions from '@/api/setting/serverSetup.js';
const { t } = useI18n();

definePageMeta({
  layout: 'settings',
  name: 'settings-serverSetup',
  middleware: ['auth'],
});

useHead({
  title: t('admin.serverSetup.title'),
});

// 域名屏蔽列表
const disableDomainList = [
  { value: '1', text: t('common.toNoOne') },
  { value: '2', text: t('common.toLocalLoggedInUsers') },
  { value: '3', text: t('common.toEveryone') },
];

// 域名屏蔽原因
const disableReasonList = [
  { value: '1', text: t('common.toNoOne') },
  { value: '2', text: t('common.toLocalLoggedInUsers') },
  { value: '3', text: t('common.toEveryone') },
];

const router = useRouter();
const goRouter = (path: string) => {
  router.push(path);
};

const uploadLoading = ref(false);
const loadingSubmit = ref(false);
const loadingPage = ref(false);
const tabsValue = ref('Branding');
const formValue = ref<any>({
  formBranding: {
    site_title: '',
    site_contact_username: '',
    site_contact_email: '',
    site_short_description: '',
    thumbnail_url: '',
    thumbnail_id: '',
  },
  formAbout: {
    site_extended_description: '',
    show_domain_blocks: '',
    show_domain_blocks_rationale: '',
    status_page_url: '',
    site_terms: '',
  },
  formSitive: {
    receive_remote_sensitive: false,
    push_local_sensitive: false,
  },
});
const clearInput = () => {
  formValue.value.formBranding = {
    site_title: '',
    site_contact_username: '',
    site_contact_email: '',
    site_short_description: '',
    thumbnail_url: '',
    thumbnail_id: '',
  };

  formValue.value.formAbout = {
    site_extended_description: '',
    show_domain_blocks: '',
    show_domain_blocks_rationale: '',
    status_page_url: '',
    site_terms: '',
  };

  formValue.value.formSitive = {
    receive_remote_sensitive: false,
    push_local_sensitive: false,
  };
};

const fileList = ref<any[]>([]);
provide('fileList', fileList);
provide('formValue', formValue);
provide('uploadLoading', uploadLoading);

const getSettingAsync = async () => {
  try {
    loadingPage.value = true;
    const fnName = 'getSetting' + tabsValue.value;
    const res = await (asyncFunctions as any)[fnName]();
    for (const key in formValue.value['form' + tabsValue.value]) {
      if (key in res) {
        formValue.value['form' + tabsValue.value][key] = res[key];
      }
    }
    if (tabsValue.value === 'Branding') {
      fileList.value = [
        {
          id: res.thumbnail_id,
          url: res.thumbnail_url,
          status: 'finished',
        },
      ];
    }
  } catch (err) {
    console.log(err);
  } finally {
    loadingPage.value = false;
  }
};
getSettingAsync();

const onSubmit = async () => {
  try {
    // let tabName = tabsValue.value;
    // if (tabName === 'sitive') {
    //   tabName = 'Branding';
    // }
    const fnName = 'setSetting' + tabsValue.value;
    const params = toRaw(formValue.value[`form${tabsValue.value}`]);
    if ('thumbnail_url' in params) delete params.thumbnail_url;
    loadingSubmit.value = true;
    console.log('params', formValue.value, params);
    await (asyncFunctions as any)[fnName](params);
    Message.success(t('common.save') + t('common.success'));
    getSettingAsync();
  } catch (err) {
    console.log(err);
    Message.error(t('common.pleaseUploadImage'));
  } finally {
    loadingSubmit.value = false;
  }
};

const handleChange = (key: string | number) => {
  tabsValue.value = key as string;
  clearInput();
  getSettingAsync();
};
</script>

<template>
  <div class="pages">
    <PageHeader :showArrow="false">{{ $t('admin.serverSetup.title') }}</PageHeader>
    <a-spin :loading="loadingPage">
      <a-tabs v-model="tabsValue" @change="handleChange">
        <a-tab-pane key="Branding" :title="$t('admin.serverSetup.branding')">
          <div class="pane-content">
            <h4 class="page-desc">
              {{ $t('admin.serverSetup.brandingDesc') }}
            </h4>
            <a-form :model="formValue" layout="vertical">
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-item :label="$t('admin.serverSetup.siteTitle')">
                    <a-input v-model="formValue.formBranding.site_title" />
                    <span class="formitem-tips">{{ $t('admin.serverSetup.siteTitleDesc') }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24" class="user-email">
                <a-col ::span="12">
                  <a-form-item :label="$t('admin.serverSetup.siteContactUsername')">
                    <a-input v-model="formValue.formBranding.site_contact_username" />
                    <span class="formitem-tips">{{ $t('admin.serverSetup.siteContactUsernameDesc') }}</span>
                  </a-form-item>
                </a-col>
                <a-col ::span="12">
                  <a-form-item :label="$t('admin.serverSetup.siteContactEmail')">
                    <a-input v-model="formValue.formBranding.site_contact_email" />
                    <span class="formitem-tips">{{ $t('admin.serverSetup.siteContactEmailDesc') }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-item :label="$t('admin.serverSetup.siteShortDescription')">
                    <a-textarea
                      v-model="formValue.formBranding.site_short_description"
                      :auto-size="{
                        minRows: 3,
                        maxRows: 50,
                      }"
                      allow-clear
                    />
                    <span class="formitem-tips">{{ $t('admin.serverSetup.siteShortDescriptionDesc') }}</span>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-spin :loading="uploadLoading">
                <a-row class="form-item-online" justify="center" align="center">
                  <a-col :span="12">
                    <a-form-item :label="$t('admin.serverSetup.thumbnail')">
                      <UploadImage />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12" class="flex">
                    <div class="file-view" v-if="formValue.formBranding?.thumbnail_url">
                      <div class="file-photo">
                        <img :src="formValue.formBranding?.thumbnail_url" alt="" />
                      </div>
                    </div>
                  </a-col>
                </a-row>
              </a-spin>

              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-item>
                    <a-button :disabled="uploadLoading" class="submit-btn" :loading="loadingSubmit || uploadLoading" @click="onSubmit" long type="primary">{{
                      $t('admin.serverSetup.save')
                    }}</a-button>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </a-tab-pane>
        <a-tab-pane key="About" :title="$t('admin.serverSetup.about')">
          <div class="pane-content">
            <h4 class="page-desc">{{ $t('admin.serverSetup.aboutDesc') }}</h4>
            <a-form :model="formValue" layout="vertical">
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-item :label="$t('admin.serverSetup.wholeDesc')">
                    <span class="formitem-tips">{{ $t('admin.serverSetup.wholeDesc') }}</span>
                    <a-textarea v-model="formValue.formAbout.site_extended_description" :auto-size="true" />
                    <div class="formitem-tips">
                      {{ $t('admin.serverSetup.ruleDesc') }}
                      <a class="routerLink" @click="goRouter('/settings/rule')">{{ $t('admin.serverSetup.serverRules') }}</a>
                    </div>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col ::span="12">
                  <a-form-item :label="$t('admin.serverSetup.domainBlocks')">
                    <a-select class="form-select" v-model="formValue.formAbout.show_domain_blocks" placeholder="Select">
                      <a-option v-for="item in disableDomainList" :key="item.value" :label="item.text" :value="item.value" />
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col ::span="12">
                  <a-form-item :label="$t('admin.serverSetup.domainBlocksRationale')">
                    <a-select class="form-select" v-model="formValue.formAbout.show_domain_blocks_rationale" placeholder="Select">
                      <a-option v-for="item in disableReasonList" :key="item.value" :label="item.text" :value="item.value" />
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-item :label="$t('admin.serverSetup.statusPageUrl')">
                    <span class="formitem-tips">{{ $t('admin.serverSetup.statusPageUrlDesc') }}。</span>
                    <a-input v-model="formValue.formAbout.status_page_url" />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-item :label="$t('admin.serverSetup.privacyPolicy')">
                    <span class="formitem-tips">{{ $t('admin.serverSetup.useDefault') }} </span>
                    <a-textarea v-model="formValue.formAbout.site_terms" :auto-size="true" />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-item>
                    <a-button class="submit-btn" type="primary" long :loading="loadingSubmit" @click="onSubmit" block>{{
                      $t('admin.serverSetup.save')
                    }}</a-button>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </a-tab-pane>

        <a-tab-pane key="Sitive" :title="$t('admin.serverSetup.sensitiveContentSetting')">
          <div class="pane-content">
            <a-form :model="formValue" layout="vertical">
              <div class="checkbox-item">
                <a-checkbox v-model="formValue.formSitive.receive_remote_sensitive">
                  {{ $t('admin.serverSetup.receiveSensitiveContentBroadcast') }}
                </a-checkbox>
              </div>
              <div class="checkbox-item">
                <a-checkbox v-model="formValue.formSitive.push_local_sensitive">
                  {{ $t('admin.serverSetup.broadcastSensitiveContent') }}
                </a-checkbox>
              </div>
              <a-form-item>
                <a-button :disabled="uploadLoading" class="submit-btn" :loading="loadingSubmit" @click="onSubmit" long type="primary">{{
                  $t('admin.serverSetup.save')
                }}</a-button>
              </a-form-item>
            </a-form>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </div>
</template>

<style lang="scss" scoped>
:deep(.arco-form-item-content-flex) {
  flex-direction: column;
  align-items: flex-start;
}
:deep(.arco-input-wrapper) {
  background: #fff;
  border: 1px solid #dcdfe6;
}
:deep(.arco-textarea) {
  background: #fff;
}

.pages {
  padding: 55px 25px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  .header {
    margin-bottom: 40px;
  }
  .content__heading {
    h2 {
      font-size: 24px;
      font-weight: 700;
      line-height: 36px;
    }
    .desc {
      margin-top: 30px;
      font-size: 17px;
      line-height: 22px;
    }
  }
}

.pane-content {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;

  :deep(.arco-form) {
    .el-form-item__label {
      color: var(--el-text-color-primary);
    }
    .el-input,
    .el-textarea {
      margin-top: 8px;
    }
    .el-form--default.el-form--label-top .el-form-item .el-form-item__label {
      margin-bottom: 0;
    }
    .form-select {
      width: 100%;
    }
    .formitem-tips {
      color: var(--el-text-color-regular);
      font-size: 12px;
      line-height: 2;
    }
    .routerLink {
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        color: #1890ff;
        text-decoration: underline;
      }
    }

    .form-item-online {
      --file-size: 60px;

      .flex {
        display: flex;
        justify-content: flex-end;
        .file-view {
          width: var(--file-size);
          height: var(--file-size);
          .file-photo {
            width: 100%;
            height: 100%;
            border-radius: 5px;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
      }
    }
  }
  .checkbox-item {
    margin-bottom: 10px;
  }
}

@include respond('phone') {
  :deep(.arco-row.user-email) {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    .arco-col-12 {
      width: 100%;
    }
  }
}
</style>
