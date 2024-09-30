// src/composables/useWebSocketManager.js
import { ref } from 'vue';
import { useWebSocket } from '@/api/websocket';

const baseURL = `wss://${import.meta.env.VITE_BASE_API.replace('https://', '')}`;

const subType = {
  'public-local': 'public:local',
  'public-common': 'public:remote',
  home: 'public:home',
  notification: 'user',
};

const cbMap = {};

const subscribe = (key) => {
  return (cb) => {
    const cbs = cbMap[key] || [];
    cbs.push(cb);
    cbMap[key] = cbs;
  };
};

export const initWebSocket = () => {
  const token = getToken();
  const url = computed(() => `${baseURL}/api/v1/streaming?token=${token.value}`);
  const onMessageCb = (data) => {
    const { event, payload } = data;
    const type = data.stream?.[0];
    const cbs = cbMap[type] || [];
    cbs.forEach((cb) => cb(event, payload));
  };

  const { socket, isConnected, messages, onMessage, connect, sendMessage, close } = useWebSocket(url, {
    onMessage: onMessageCb,
  });
  const currentSubscription = ref(null);

  watchEffect(() => {
    if (!token.value) {
      close();
    } else {
      connect();
    }
  });

  const router = useRouter();
  router.beforeEach((to, from) => {
    if (from.name === 'notification') {
      return;
    }
    if (currentSubscription.value && isConnected.value) {
      sendMessage({ action: 'unsubscribe', type: currentSubscription.value });
    }
  });

  const route = useRoute();

  watchEffect(() => {
    if (isConnected.value) {
      sendMessage({ type: 'subscribe', stream: subType['notification'] });
    }
  });
  watchEffect(() => {
    const type = subType[route.name];
    if (type && isConnected.value) {
      currentSubscription.value = type;
      sendMessage({ type: 'subscribe', stream: type });
    }
  });
};

export function useWebSocketManager() {
  const subscribeTimelineLocal = subscribe(subType['public-local']);
  const subscribeTimelineCommon = subscribe(subType['public-common']);
  const subscribeHome = subscribe(subType['home']);
  const subscribeNotification = subscribe(subType['notification']);
  return {
    initWebSocket,
    subscribeTimelineLocal,
    subscribeTimelineCommon,
    subscribeHome,
    subscribeNotification,
  };
}
