import { manualFetch } from '../base';

// 规则列表
export const getRuleList = () => {
  return manualFetch('/admin/api/rule/list', {
    method: 'get',
  });
};
// 添加规则
export const addRule = (data) => {
  return manualFetch('/admin/api/rule/create', {
    method: 'post',
    body: data,
  });
};
// 删除规则
export const deleteRule = (id) => {
  return manualFetch(`/admin/api/rule/delete/${id}`, {
    method: 'delete',
  });
};
