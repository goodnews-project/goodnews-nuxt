import { ref, onBeforeUnmount } from 'vue';

export function useWebSocket(url, { onMessage }) {
  const socket = ref(null);
  const isConnected = ref(false);
  const messages = ref([]);

  const heartbeatInterval = 15000; // 心跳间隔 15 秒
  const reconnectInterval = 5000; // 重连间隔 5 秒
  let maxReconnectTimes = 5; //  最大重连次数
  let heartbeatTimer;
  let reconnectTimer;

  const connect = () => {
    // 客户端链接
    if (!process.client) return;
    watchEffect(() => {
      socket.value = new WebSocket(url.value);
    });

    socket.value.onopen = () => {
      isConnected.value = true;
      // console.log('WebSocket 连接', socket.value);
      startHeartbeat();
    };

    socket.value.onmessage = (event) => {
      const message = JSON.parse(event.data);
      messages.value.push(message);
      onMessage(message);
    };

    socket.value.onclose = () => {
      isConnected.value = false;
      // console.log('WebSocket 关闭');
      stopHeartbeat();
    };

    // 断线重连
    socket.value.onerror = () => {
      isConnected.value = false;
      // console.error('WebSocket 断线重连');
      stopHeartbeat();
      scheduleReconnect();
    };
  };

  const sendMessage = (message) => {
    // console.log('WebSocket 发送消息', message);
    if (socket.value && isConnected.value) {
      socket.value.send(JSON.stringify(message));
    }
  };

  // 开始心跳
  const startHeartbeat = () => {
    if (heartbeatTimer) return;
    heartbeatTimer = setInterval(() => {
      if (isConnected.value) {
        sendMessage({ type: 'heartbeat' });
      }
    }, heartbeatInterval);
  };

  // 停止心跳
  const stopHeartbeat = () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  };

  // 重连
  const scheduleReconnect = () => {
    if (reconnectTimer) return;
    // 重连次数用完
    if (maxReconnectTimes <= 0) {
      // console.error('WebSocket 重连次数用完');
      return;
    }
    // 先将之前的连接关闭
    if (socket.value) {
      socket.value.close();
    }
    reconnectTimer = setTimeout(() => {
      connect();
      reconnectTimer = null;
      maxReconnectTimes -= 1;
    }, reconnectInterval);
  };

  const close = () => {
    // console.log('手动关闭 WebSocket', socket.value);
    if (socket.value) {
      socket.value.close();
    }
  };

  const open = () => {
    connect();
  };

  onBeforeUnmount(() => {
    close();
  });

  return {
    socket,
    isConnected,
    messages,
    onMessage,
    connect,
    sendMessage,
    close,
    open,
  };
}
