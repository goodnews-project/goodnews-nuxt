<script setup>
import { uploadFile } from '@/api/base.js';
import { deepClone } from '@/utils';
import { updateProfile } from '@/api/setting/index.js';
import { useUserStore } from '@/stores/user';
import { Message } from '@arco-design/web-vue';
import mitt from '@/utils/mitt';
import { useRouterStore } from '@/stores/router';
const routerStore = useRouterStore();
const { t } = useI18n();
useHead({
  title: t('profile.title'),
});

definePageMeta({
  layout: 'settings',
  name: 'settings-profile',
  middleware: ['auth'],
});

const userStore = useUserStore();
await userStore.updateUserInfo();
const userInfo = userStore.userInfo;
const defaultFields = [
  {
    name: '',
    type: 'PropertyValue',
    value: '',
  },
  {
    name: '',
    type: 'PropertyValue',
    value: '',
  },
  {
    name: '',
    type: 'PropertyValue',
    value: '',
  },
  {
    name: '',
    type: 'PropertyValue',
    value: '',
  },
];

if (userInfo.fields) {
  for (const fieldKey in defaultFields) {
    if (fieldKey in userInfo.fields) {
      defaultFields[fieldKey] = userInfo.fields[fieldKey];
    }
  }
}

const sensitiveDisabled = computed(() => {
  return !!userInfo.sensitized_at;
});

const formValue = reactive({
  display_name: userInfo.display_name || userInfo.username,
  note: userInfo.note,
  avatar_attachment_id: '',
  profile_image_attachment_id: '',
  manually_approves_follower: userInfo.manually_approves_follower === 1,
  is_bot: userInfo.is_bot,
  is_sensitive: userInfo.sensitized_at || userInfo.is_sensitive === 1,
  is_display_sensitive: userInfo.is_display_sensitive === 1,
  fields: defaultFields,
});

const submitLoading = ref(false);

const onSubmit = async () => {
  if (submitLoading.value) {
    return;
  }

  try {
    submitLoading.value = true;
    const query = deepClone(formValue);
    if (!query.avatar_attachment_id) {
      delete query.avatar_attachment_id;
    }

    if (!query.profile_image_attachment_id) {
      delete query.profile_image_attachment_id;
    }

    query.is_sensitive = query.is_sensitive ? 1 : 0;
    query.is_display_sensitive = query.is_display_sensitive ? 1 : 0;
    query.fields = query.fields.filter((field) => field.name && field.value);

    console.log('query', query);
    query.manually_approves_follower = query.manually_approves_follower ? 1 : 0;
    await updateProfile(query);
    await userStore.updateUserInfo();
    mitt.emit('editProfileSave');
    Message.success(t('common.modifySuccessfully'));
    submitLoading.value = false;
    routerStore.updateAccountInfo({});
  } catch (err) {
    console.log('err :>> ', err);
    submitLoading.value = false;
    // Message.error(err.response?.data?.msg)
  }
};
const avatar = ref({ url: userInfo.avatar });
const banner = ref({ url: userInfo.profile_image });
const onFileChange = async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('file', file);

  const fileRes = await uploadFile(formData);

  return fileRes;
};

const uploadLoading1 = ref(false);

const avatarChange = async (e) => {
  try {
    uploadLoading1.value = true;
    const res = await onFileChange(e);
    avatar.value = res;
    formValue.avatar_attachment_id = res.id;
  } finally {
    uploadLoading1.value = false;
  }
};
const uploadLoading2 = ref(false);
const bannerChange = async (e) => {
  try {
    uploadLoading2.value = true;
    const res = await onFileChange(e);
    banner.value = res;
    formValue.profile_image_attachment_id = res.id;
  } finally {
    uploadLoading2.value = false;
  }
};
</script>

<template>
  <div class="content">
    <div class="content__heading">
      <h2>{{ $t('profile.title') }}</h2>
      <h4 class="desc">
        <strong> {{ $t('profile.customizeProfileDesc') }}</strong>
        {{ $t('profile.completeProfileDesc') }}
      </h4>
    </div>

    <a-form :model="formValue" class="a-form" layout="vertical">
      <a-form-item>
        <div class="form-item">
          <div class="item-name">{{ $t('profile.displayName') }}</div>
          <div class="item-desc">{{ $t('profile.fullName') }}</div>
          <a-input v-model="formValue.display_name" />
        </div>
      </a-form-item>
      <a-form-item>
        <div class="form-item">
          <div class="item-name">{{ $t('profile.introduction') }}</div>
          <div class="item-desc">{{ $t('profile.mentionAndHashtags') }}</div>
          <!-- <a-input v-model="formValue.note" /> -->
          <SendTweetEditor v-model="formValue.note" class="tweetEditor" maxLength="255" />
        </div>
      </a-form-item>

      <a-form-item>
        <a-spin class="form-item-file" :loading="uploadLoading1">
          <div class="form-item">
            <div class="item-name">{{ $t('profile.profileIamge') }}</div>
            <div class="item-desc">{{ $t('profile.imageSize400') }}</div>
            <input class="form-item-file input-file" type="file" accept="image/jpeg,image/png,image/gif,image/webp" @input="avatarChange" />
          </div>
          <div class="file-view" v-if="avatar?.url">
            <div class="file-photo">
              <img :src="avatar.url" alt="" />
            </div>
          </div>
        </a-spin>
      </a-form-item>
      <a-form-item>
        <a-spin class="form-item-file" :loading="uploadLoading2">
          <div class="form-item">
            <div class="item-name">{{ $t('profile.titleImage') }}</div>
            <div class="item-desc">{{ $t('profile.imageSize1500') }}</div>
            <input class="form-item-file input-file" type="file" accept="image/jpeg,image/png,image/gif,image/webp" @input="bannerChange" />
          </div>
          <div class="file-view" v-if="banner?.url">
            <div class="file-photo">
              <img :src="banner.url" alt="" />
            </div>
          </div>
        </a-spin>
      </a-form-item>
      <a-form-item>
        <div class="form-item">
          <a-checkbox v-model="formValue.manually_approves_follower">{{ t('profile.protectAccount') }}</a-checkbox>
          <div class="item-desc-min">{{ t('profile.youNeedToManuallyReviewAllFollowRequests') }}</div>
        </div>
      </a-form-item>
      <a-form-item>
        <div class="form-item">
          <a-checkbox v-model="formValue.is_bot">{{ t('profile.thisIsARobotAccount') }}</a-checkbox>
          <div class="item-desc-min">{{ t('profile.mostOperationsFromThisAccountAreAutomatedAndMayNotBeMonitored') }}</div>
        </div>
      </a-form-item>

      <a-form-item>
        <div class="form-item">
          <a-checkbox
            v-model="formValue.is_sensitive"
            :disabled="sensitiveDisabled"
            :title="sensitiveDisabled && t('profile.yourAccountHasBeenSetAsSensitiveByTheAdministrator')"
          >
            {{ t('profile.markYourMediaContentAsPotentiallyContainingSensitiveContent') }}
          </a-checkbox>
          <div class="item-desc-min">{{ t('profile.ifEnabledImagesAndVideosYouPostWillBeMarkedAsSensitiveForPeopleWhoDoNotWantToSeeSensitiveContent') }}</div>
        </div>
      </a-form-item>

      <a-form-item>
        <div class="form-item">
          <a-checkbox v-model="formValue.is_display_sensitive">{{ t('profile.displayMediaContentThatMayContainSensitiveContent') }}</a-checkbox>
        </div>
      </a-form-item>

      <a-form-item>
        <div class="form-item">
          <div class="addition">
            <h4>{{ t('profile.additionalProfileInformation') }}</h4>
            <div class="item-desc-min">{{ t('profile.thisWillBeDisplayedOnYourProfilePageInTableFormUpToItems', { count: 4 }) }}</div>

            <div class="form-item-addition">
              <a-space v-for="item in formValue.fields" class="a-space">
                <a-input class="a-input" :placeholder="t('public.tag')" v-model="item.name" allow-clear />
                <a-input class="a-input" :placeholder="t('public.content')" v-model="item.value" allow-clear />
              </a-space>
            </div>
          </div>
        </div>
      </a-form-item>

      <a-form-item>
        <a-button :disabled="uploadLoading1 || uploadLoading2" type="primary" @click="onSubmit" block :loading="submitLoading">{{
          $t('profile.save')
        }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style lang="scss" scoped>
:deep(.arco-input-wrapper) {
  background: #fff;
  border: 1px solid var(--color-neutral-4);
}
.tweetEditor {
  width: 100%;
  border: 1px solid var(--color-neutral-4);
  border-bottom: none;
}
.wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  @include respond('phone') {
    .sidebar-wrapper {
      display: none;
    }
  }
  .sidebar-wrapper {
    border-right: 1px solid #ebeef5;
    .sidebar-wrapper__inner {
      padding-left: 200px;
      overflow-y: auto;
      display: flex;
      height: 100%;
      justify-content: flex-end;
      .sidebar {
        padding: 0;
        pointer-events: auto;
        width: 240px;
        .logo {
          display: block;
          height: 100px;
          margin: 40px auto;
          width: 100px;
          border-radius: 10px;
        }
        .handle {
          cursor: pointer;
          --height: 50px;
          height: var(--height);
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s;
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
          padding: 0 20px;
          position: relative;
          background: #f7f9f9;
          &::after {
            content: ' ';
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            width: 2px;
            height: 100%;
            background: #409eff;
          }
          .text {
            font-size: 16px;
          }
        }
      }
    }
  }
  .content-wrapper {
    flex: 1 1 auto;
    width: 100%;
    max-width: 860px;
    .content {
      padding: 20px;
      .content__heading {
        margin-bottom: 45px;
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
  }
}

.form-item-file {
  --file-size: 60px;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  .file-view {
    // position: absolute;
    // right: 0;
    // top: 50%;
    // transform: translateY(-50%);
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

  .item-desc-min {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
    line-height: 12px;
  }
  .input-file {
    --height: 28px;
    height: var(--height);
    line-height: var(--height);
    line-height: normal;
    width: 400px;
  }
  .a-input {
    width: min(400px, calc(100% - 40px));
  }
  .addition {
    margin-top: 50px;
  }
}

.form-item-addition {
  display: flex;
  flex-flow: wrap;
  margin-top: 10px;
  flex: 1;
  .a-space {
    margin-top: 10px;
    margin-right: 10px;
    .a-input {
      width: 300px;
      box-sizing: border-box;
      padding: 5px;
    }
  }
}
.a-button {
  flex: 1;
  padding: 20px;
}
@include respond('phone') {
  .form-item {
    .input-file {
      width: 100%;
    }
  }
  .form-item-file {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    .file-view {
      margin-top: 20px;
    }
  }
  .form-item-addition {
    .a-space {
      .a-input {
        width: 100%;
      }
    }
  }
}
</style>
