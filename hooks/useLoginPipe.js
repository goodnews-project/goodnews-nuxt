import { useLoginModalStore } from '@/stores/loginModal';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

export default function useLoginPipe() {
  const userStore = storeToRefs(useUserStore());
  const loginModalStore = useLoginModalStore();
  const login = () => {
    const isLogin = computed(() => userStore.userInfo.value?.id);
    if (!isLogin.value) {
      loginModalStore.openLoginModal();
      return false;
    }
    return true;
  };
  return login;
}
