import { manualFetch } from '~/api/base';
// 列表
export const getList = (options) => {
  return useMyFetch(`/_api/v1/follow_requests`, {
    method: 'get',
    ...options,
  });
};
// 审核通过
export const handleAuthorize = (data) => {
  return manualFetch(`/_api/v1/follow_requests/${data.id}/authorize`, {
    method: 'post',
    body: JSON.stringify(data),
  });
};

// 审核拒绝
export const reject = (data) => {
  return manualFetch(`/_api/v1/follow_requests/${data.id}/reject`, {
    method: 'post',
    body: JSON.stringify(data),
  });
};
