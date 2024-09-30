<script setup>
import loadingIcon from '~/components/loadingIcon/index.vue';
import { getNotifications, read } from '@/api/notifications';
import NotificationItem from './notification.vue';
import { getNum } from '@/api/nav/index.js';

const scrollbar = ref(true);
const pullLoading = ref(false);

const props = defineProps({
  params: {
    type: Object,
    default: () => ({}),
  },
});

const { data, loading, refresh, maxId } = await useList('notifications', async ({ max_id }) => {
  try {
    const res = await getNotifications(!!max_id ? { max_id, ...props.params } : { ...props.params });

    if (!res?.data?.length) scrollbar.value = false;

    pullLoading.value = false;

    return res;
  } catch (err) {
    console.error(err);
  }
});

watch(
  () => props.params,
  () => {
    onRefresh();
  }
);

const dataList = computed(() => {
  const list = data.value?.list || [];
  const result = [...new Map(list.map((item) => [item.id, item])).values()];
  return result;
});

const { subscribeNotification } = useWebSocketManager();

onMounted(() => {
  subscribeNotification((event, notification) => {
    if (notification?.status?.media_attachments) {
      notification.status.attachments = notification?.status?.media_attachments;
    }
    const list = data.value?.list || [];
    const typeMap = {
      follow: 1,
      mention: 2,
      reblog: 3,
      favourite: 4,
      status: 5,
      'admin.sign_up': 11,
      mention: 20,
    };

    notification.notify_type = typeMap[notification.type];
    notification.read = 0;

    if (!list.length) {
      return;
    }

    if (event === 'delete') {
      const index = list.findIndex((item) => item.id === tweet);

      if (index >= 0) {
        list.splice(index, 1);
      }

      return;
    }

    list.unshift(notification);
  });
});

const num = useNotificationsNum();

watch(
  () => dataList.value,
  async (val) => {
    const unReadIds = dataList.value.filter((item) => item.read === 0).map((item) => item.id);

    if (unReadIds.length) {
      try {
        // 静态减去未读数
        num.value.notifications = Math.max(0, num.value.notifications - unReadIds.length);
        await read({ ids: unReadIds });
        // 刷新角标
        const notificationsRes = await getNum();
        num.value = notificationsRes;
      } catch (err) {}
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

const onRefresh = async () => {
  pullLoading.value = true;

  if (!maxId.value) {
    maxId.value = '';
    refresh();
    return;
  }

  maxId.value = '';
};

const getList = () => {
  if (dataList.value.length > 0) {
    maxId.value = dataList.value[dataList.value.length - 1]?.id || '';
  }
};
</script>

<template>
  <van-pull-refresh v-model="pullLoading" @refresh="onRefresh" head-height="75">
    <RealList @reach-bottom="getList" :scrollbar="scrollbar" class="list" :loading="loading">
      <div v-for="item in dataList" :key="item.id" class="item">
        <NotificationItem class="notification-item" :class="{ unread: item.read === 0 }" :data="item"> </NotificationItem>
      </div>
    </RealList>
    <template #loading>
      <loadingIcon></loadingIcon>
    </template>
  </van-pull-refresh>
</template>

<style lang="scss" scoped>
.list {
  .item {
    cursor: pointer;
    transition: all 0.3s ease-out;

    &:hover {
      background: var(--color-neutral-1);
    }

    .notification-item {
      border-bottom: 1px solid var(--color-neutral-3);
      padding: 10px;
      padding-bottom: 0;

      :deep(.tweet-item) {
        border: 0;
      }
    }
  }
}

.unread {
  border-left: 5px solid rgb(var(--arcoblue-6));
}
</style>
