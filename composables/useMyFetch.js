import { getToken } from '@/utils/auth';
export const getHeaders = () => {
  const token = getToken().value;

  const headers = token
    ? {
        Authorization: `Bearer ${getToken().value}`,
      }
    : {};

  return headers;
};

export const getBaseUrl = () => {
  if (process.server) {
    return import.meta.env.VITE_LOCAL_API;
  }

  return import.meta.env.VITE_BASE_API;
};

export const useMyFetch = (request, opts) => {
  return useFetch(request, {
    baseURL: getBaseUrl(),
    headers: getHeaders(),
    ...opts,
    onResponseError({ response }) {
      if (response.status === 401) {
        removeToken();
        removeUser();
        return navigateTo('/?login=true');
      }
      if (response.status === 404) {
        showError({
          statusCode: 404,
          statusMessage: 'Page not found',
        });
      }
    },
  });
};
export const useMyLazyFetch = (request, opts) => {
  return useFetch(request, {
    baseURL: getBaseUrl(),
    lazy: true,
    headers: getHeaders(),
    ...opts,
  });
};

export const useMyTestFetch = (url, methods, params, config) => {
  return useFetch(url, {
    ...config,
    method: methods,
    baseURL: getBaseUrl(),
    onRequest({ request, options }) {
      const token = getToken().value;
      if (token) {
        options.headers.Authorization = `Bearer ${token}`;
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        return navigateTo('/?login=true');
      }
    },

    query: methods === 'GET' || methods === 'get' || methods === 'put' || methods === 'PUT' ? params : undefined,
    body: methods === 'POST' || methods === 'post' ? params : undefined,
    headers: getHeaders(),
  });
};
