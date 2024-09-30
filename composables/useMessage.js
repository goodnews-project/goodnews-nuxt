import { Message } from '@arco-design/web-vue';

export const useMessage = () => {
  if (process.client) {
    return Message;
  }

  return {
    info: () => {},
    success: () => {},
    warning: () => {},
    error: () => {},
  }
};
