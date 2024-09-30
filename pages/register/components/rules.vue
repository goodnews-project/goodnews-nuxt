<script setup>
import { useRouter } from 'vue-router';
import { getRules } from '@/api/register';
const { t } = useI18n();
const router = useRouter();
const emits = defineEmits(['login', 'stepChange']);

const rules = ref([]);
const rulesLoading = ref(true);
onMounted(async () => {
  await nextTick();
  const { data } = await getRules().finally(() => {
    rulesLoading.value = false;
  });
  rules.value = data.value;
  if (!rules.value.length) {
    goReg();
  }
});
const goReg = () => {
  emits('stepChange');
};

const goBack = () => {
  router.go(-1);
};
const { VITE_SYS_NAME: systemName } = import.meta.env;
</script>
<template>
  <div class="main">
    <h2 class="title">{{ t('register.basicRule') }}</h2>
    <h4 class="desc">{{ t('register.ruleDesc', { systemName: systemName }) }}</h4>
    <a-spin class="content-container" :loading="rulesLoading" :size="28">
      <div class="rule-list" v-if="rules?.length">
        <div class="rule-item" v-for="(rule, index) in rules" :key="rule.id">
          <div class="right">{{ index + 1 }}</div>
          <div class="left">
            {{ rule.text }}
          </div>
        </div>
      </div>
      <div class="btn-block">
        <a-button @click="goReg" type="primary" long size="large">
          <span>{{ t('common.accept') }}</span>
        </a-button>

        <a-button @click="goBack" long size="large">
          <span>{{ t('common.back') }}</span>
        </a-button>
      </div>
    </a-spin>
  </div>
</template>

<style lang="scss" scoped>
.main {
  text-align: center;
  margin-top: 20px;
  .title {
    font-size: 24px;
  }
  .desc {
    font-weight: normal;
  }

  // 内容区容器
  .content-container {
    width: 100%;
    min-height: 300px;
    .rule-list {
      .rule-item {
        border-bottom: 1px solid #ccc;
        padding: 16px 16px 16px 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        text-align: left;
        .right {
          --size: 30px;
          width: var(--size);
          height: var(--size);
          margin-right: 0.75rem;
          background-color: rgb(var(--arcoblue-6));
          border-radius: 50%;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        &:last-child {
          border-bottom: none;
        }
      }
    }
    .btn-block {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 0 60px;
      --border-radius-small: 6px;
    }
  }
}
</style>
