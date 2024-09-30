<script setup>
definePageMeta({
  layout: false,
});
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import RulesDom from './components/rules';
import RegisterDom from './components/register';
import VerifyEmail from './components/verifyEmail';
import defaultAvatar from '@/assets/images/default-avatar.jpg';
const { t } = useI18n();
const stepIndex = ref(1);
const stepBack = () => {
  stepIndex.value = Math.max(1, stepIndex.value - 1);
};
const stepNext = () => {
  stepIndex.value = Math.min(3, stepIndex.value + 1);
};
const stepChange = (boolean = true) => {
  if (boolean) {
    stepNext();
  } else {
    stepBack();
  }
};
const email = ref('');
const saveEmail = (val) => {
  email.value = val;
};
const router = useRouter();
import { useLoginModalStore } from '@/stores/loginModal';
const loginPopStore = useLoginModalStore();
const goLogin = () => {
  router.push('/');
  loginPopStore.openLoginModal();
};
</script>

<template>
  <div class="pages">
    <div class="headers">
      <div class="image-box">
        <a-image :src="defaultAvatar" />
      </div>
      <a-steps :current="stepIndex" label-placement="vertical">
        <a-step :title="t('register.acceptRule')" />
        <a-step :title="t('register.yourDetails')" />
        <a-step :title="t('register.confirmEmail')" />
      </a-steps>
    </div>
    <div class="content">
      <template v-if="stepIndex === 1">
        <RulesDom @stepChange="stepNext"></RulesDom>
      </template>
      <template v-else-if="stepIndex === 2">
        <RegisterDom @stepChange="stepChange" @saveEmail="saveEmail"></RegisterDom>
      </template>
      <template v-else-if="stepIndex === 3">
        <VerifyEmail @stepChange="stepBack" v-model="email"></VerifyEmail>
      </template>
      <div style="margin-top: 10px">
        {{ t('register.haveAccount') }}
        <a-link @click="goLogin">{{ t('register.clickToLogin') }}</a-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pages {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  // overflow: hidden;
  .headers {
    width: min(600px, 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    .image-box {
      border-radius: 100px;
      overflow: hidden;
      width: 100px;
      height: 100px;
    }
  }
}
.content {
  flex: 1;
  width: min(600px, 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
}
@include respond('phone') {
  :deep(.arco-steps) {
    .arco-steps-item {
      width: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .arco-steps-item-tail {
        left: calc(50% + 26px);
      }
      .arco-steps-item-node {
        margin-left: 0;
        margin-right: 0;
      }
      .arco-steps-item-content {
        width: 100%;
      }
    }
  }
}
</style>
