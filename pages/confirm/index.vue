<script setup>
import { registerApi } from '@/api/login';
import { Message } from '@arco-design/web-vue';
const { t } = useI18n();
const loginModalStore = useLoginModalStore();
const router = useRouter();
const route = useRoute();
definePageMeta({
  layout: false,
});

const countdown = ref(3);
let intervalId = null;
const initCountdown = () => {
  intervalId = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(intervalId);
    }
  }, 1000);
};

const token = route.query?.token;
const { data, pending: requesting, error: isError } = await registerApi(token);
onMounted(async () => {
  await nextTick();
  if (!isError.value) {
    initCountdown();
  }
});
watch(countdown, (newVal, oldVal) => {
  if (oldVal && newVal === 0) {
    goLogin();
  }
});

const goLogin = () => {
  router.push('/');
  loginModalStore.openLoginModal();
};

watchEffect(() => {
  if (countdown.value === 0 && intervalId) {
    clearInterval(intervalId);
  }
});
const { logo } = useLogo();
</script>

<template>
  <div class="word-frame" v-show="!requesting">
    <div class="logo">
      <img :src="logo" alt="" />
    </div>
    <h1>
      {{ isError ? t('register.activationLinkIncorrect') : t('register.emailVerifiedSuccess') }}
    </h1>
    <div>
      <a-button type="text" @click="goLogin">
        {{ isError ? t('register.clickToLoginPage') : t('register.secondsToLogin', { count: countdown }) }}
      </a-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading-spin {
  width: 800px;
  margin: auto;
  overflow: hidden;
  display: block;
  padding-top: 100px;
}
.word-frame {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
  .logo {
    width: 180px;
    height: 180px;
    img {
      object-fit: contain;
    }
  }
  .nuxt-icon {
    font-size: 180px;
  }
}
.jump-home {
  cursor: pointer;
}
</style>
