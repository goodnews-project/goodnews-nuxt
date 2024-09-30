
import { manualFetch } from '@/api/base';
// 获取ip规则列表
export const getIpRulesList = () => {
  return manualFetch(`/admin/_api/ip_blocks`, {
    method: 'get',
  });
};

// 新增
export const createIpRules = (data) => {
  return manualFetch(`/admin/_api/ip_blocks/create`, {
    method: 'post',
    body: data,
  });
};

// 删除
export const deleteIpRules = (ids) => {
  return manualFetch(`/admin/_api/ip_blocks/batch`, {
    method: 'delete',
    body: {
      ids,
    },
  });
};
