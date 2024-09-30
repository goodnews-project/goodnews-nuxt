import { manualFetch } from '@/api/base';
// 获取实例列表
export const getInstanceList = (data) => {
  return manualFetch('/_api/admin/instances', {
    params: data,
  });
};

// 实例详情
export const getInstanceDetail = (domain) => {
  return manualFetch(`/_api/admin/instances/${domain}`, {
    method: 'get',
  });
};

export const putInstanceSetting = (domain, data) => {
  return manualFetch(`/_api/admin/instances/${domain}/setting`, {
    method: 'put',
    body: data,
  });
};
