import { manualFetch } from '~/api/base';
export default async function useList(key, handler, options = {}) {
  const route = useRoute();

  const maxId = ref(route.params?.maxid || route.query?.max_id || '');

  const nuxtApp = useNuxtApp();

  const { data: cacheData } = useNuxtData(key);

  const isRefresh = ref(false);

  const {
    data,
    pending: loading,
    refresh: _refresh,
    clear,
  } = await useAsyncData(
    key,
    async () => {
      if (!cacheData.value) {
        cacheData.value = {};
      }

      if (!cacheData.value?.list) {
        cacheData.value.list = [];
      }

      const res = await handler({ max_id: maxId.value }).catch((e) => {
        return {};
      });

      const total = res?.total || 0;
      const data = res?.data || res?.list || [];

      if (isRefresh.value) {
        cacheData.value.list = data;
      } else {
        cacheData.value.list.push(...data);
      }

      isRefresh.value = false;

      return { list: cacheData.value.list, total, currentLength: data.length };
    },
    {
      getCachedData() {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      },
      lazy: true,
      ...options,
      watch: [maxId, ...(options.watch || [])],
    }
  );

  const refresh = () => {
    isRefresh.value = true;
    _refresh();
  };

  return {
    data,
    loading,
    refresh,
    clear,
    maxId,
  };
}
