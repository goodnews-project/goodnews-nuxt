import { getBaseUrl, getHeaders } from '~/composables/useMyFetch';
import { getUser, removeUser, removeToken } from '~/utils/auth';
import { useLoginModalStore } from '@/stores/loginModal';
import { needLoginApi } from '~/utils/constant';
export const uploadFile = (file, config) => {
  return manualFetch('/_api/v1/attachment', {
    method: 'post',
    body: file,
    ...config,
  });
};

export const getUserInfo = (name, options = {}) => {
  return useMyFetch(`/_api/v1/account/${name}`, {
    method: 'get',
    ...options,
  });
};

export const manualFetch = (url, options) => {
  const { $i18n } = useNuxtApp();
  const { t } = $i18n;
  return $fetch(url, {
    baseURL: getBaseUrl(),
    headers: getHeaders(),
    ...options,
    // 请求拦截器
    async onRequest({ request, options }) {
      const user = getUser();
      // 未登录拦截
      if (!user.value) {
        if (needLoginApi.some((api) => request.includes(api))) {
          const loginModalStore = useLoginModalStore();
          loginModalStore.openLoginModal();
          return Promise.reject({ code: 401 });
        }
      }
      return options;
    },

    async onResponseError({ request, options, response }) {
      if (response.status === 401) {
        const user = getUser();
        if (user.value) {
          useMessage().error(t('common.loginExpired'));
          removeUser();
          removeToken();
        }
        return Promise.reject();
      }
      if (response.status === 404) {
        showError({
          statusCode: 404,
          statusMessage: 'Page not found',
        });
      }
      if (response.status === 500) {
        useMessage().error(t('common.serverError'))
      }
      if (response?._data?.msg) {
        useMessage().error(response._data.msg);
      }
      return Promise.reject(response);
    },
  });
};
