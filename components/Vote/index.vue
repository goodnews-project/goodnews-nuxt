<script setup>
const { t } = useI18n();
const options = ref([
  { name: t('editor.option', { num: 1 }), value: '' },
  { name: t('editor.option', { num: 2 }), value: '' },
]);
const addOption = () => {
  options.value.push({ name: t('editor.alternative', { num: options.value.length + 1 }), value: '' });
};
const builderOptions = (type) => {
  let result = [];
  if (type === 0) {
    result = Array.from({ length: 8 }, (v, k) => k).map((item) => {
      return { value: item, label: `${item}${t('vote.day')}` };
    });
  } else if (type === 1) {
    result = Array.from({ length: 25 }, (v, k) => k).map((item) => {
      return { value: item, label: `${item}${t('vote.hour')}` };
    });
  } else if (type === 2) {
    result = Array.from({ length: 61 }, (v, k) => k).map((item) => {
      return { value: item, label: `${item}${t('vote.minute')}` };
    });
  }
  return result;
};
const optionsArgs = {
  days: builderOptions(0),
  hours: builderOptions(1),
  minutes: builderOptions(2),
};
const formValue = ref({
  days: 0,
  hours: 0,
  minutes: 0,
});

const emits = defineEmits(['closeVote', 'submitVote']);
// 重置组件数据
const resetFormData = () => {
  options.value = [
    { name: t('editor.option', { num: 1 }), value: '' },
    { name: t('editor.option', { num: 2 }), value: '' },
  ];
  formValue.value = {
    days: 0,
    hours: 0,
    minutes: 0,
  };
};
const closeVote = () => {
  emits('closeVote');
};
// 获取组件数据
const getFormData = () => {
  const result = options.value.map((item) => item.value);
  if (result.length < 2) {
    return Promise.reject(new Error(t('vote.votingRequiresAtLeastTwoOptions')));
  }
  if (result.length > 4) {
    return Promise.reject(new Error(t('vote.votingCanOnlyHaveFourOptions')));
  }
  if (result.some((item) => item === '')) {
    return Promise.reject(new Error(t('vote.votingOptionCannotBeEmpty')));
  }

  const days = formValue.value.days;
  const hours = formValue.value.hours;
  const minutes = formValue.value.minutes;
  if (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 === 0) {
    return Promise.reject(new Error(t('vote.votingDurationCannotBeZero')));
  }
  const resp = {
    success: true,
    data: {
      options: result,
      multiple: false,
      expires_in: days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60,
    },
  };
  return Promise.resolve(resp);
};
// 将组件数据暴露出去
defineExpose({
  getFormData,
  resetFormData,
});
</script>

<template>
  <div class="vote-frame">
    <a-form class="vote-form" ref="form" :model="form" label-width="80px">
      <div class="vote-options-frame">
        <div class="vote-options-list">
          <div class="vote-options-item" v-for="item in options">
            <div class="flex">
              <a-input v-model="item.value" :placeholder="item.name" maxlength="25" show-word-limit />
            </div>
          </div>
        </div>
        <div class="right-add-btn" v-if="options.length != 4">
          <a-button type="text" @click="addOption">
            <nuxt-icon name="add"></nuxt-icon>
          </a-button>
        </div>
      </div>
      <div class="vote-argument">
        <div class="title">{{ t('vote.votingDuration') }}</div>
        <div class="argument-form-list">
          <div class="argument-form-item">
            <a-select v-model="formValue.days" class="m-2" placeholder="Select" size="small">
              <a-option v-for="item in optionsArgs.days" :key="item.value" :label="item.label" :value="item.value" />
            </a-select>
          </div>
          <div class="argument-form-item">
            <a-select v-model="formValue.hours" class="m-2" placeholder="Select" size="small">
              <a-option v-for="item in optionsArgs.hours" :key="item.value" :label="item.label" :value="item.value" />
            </a-select>
          </div>
          <div class="argument-form-item">
            <a-select v-model="formValue.minutes" class="m-2" placeholder="Select" size="small">
              <a-option v-for="item in optionsArgs.minutes" :key="item.value" :label="item.label" :value="item.value" />
            </a-select>
          </div>
        </div>
      </div>
      <div class="footer-button">
        <a-button text @click="closeVote">{{ t('vote.removeVote') }}</a-button>
      </div>
    </a-form>
  </div>
</template>

<style lang="scss" scoped>
.vote-frame {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  .vote-form {
    border: 1px solid var(--color-neutral-4);
    overflow: hidden;
    border-radius: 10px;
  }
  .vote-options-frame {
    display: flex;
    border-bottom: 1px solid var(--color-neutral-4);
    .right-add-btn {
      padding: 10px;
      display: flex;
      flex-direction: column-reverse;
      padding-left: 0;
      font-size: 20px;
    }
  }
  .vote-options-list {
    width: 100%;
    display: flex;
    gap: 10px;
    padding: 10px;
    flex-direction: column;
    .right-add-btn {
      display: flex;
      justify-content: flex-end;
    }
    .vote-options-item {
      .flex {
        gap: 4px;
      }
    }
  }
  .argument-form-list {
    display: flex;
    padding: 0 10px;
    gap: 10px;
    margin: 6px 0;
    .argument-form-item {
      flex: 1;
    }
  }
  // 投票时长
  .vote-argument {
    .title {
      padding: 10px;
      padding-bottom: 0;
      font-size: 14px;
      color: #0f1419;
    }
  }
  // 移除按钮
  .footer-button {
    height: 50px;
    line-height: 50px;
    display: flex;
    transition: all 0.3s;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--color-neutral-4);
    color: #ff0000;
    cursor: pointer;
    &:hover {
      background: rgba($color: #ff0000, $alpha: 0.1);
    }
    button {
      // 重置样式
      all: unset;
      flex: 1;
      text-align: center;
    }
  }
}
</style>
