import { manualFetch } from '../base';

// 通知设为已读
export const read = (data) => {
  return manualFetch('/_api/v1/notifications/read', {
    method: 'PUT',
    body: data,
  });
};

// 获取通知列表
export const getNotifications = (params) => {
  return manualFetch(`/_api/v1/notifications`, {
    method: 'GET',
    params,
  });
};
