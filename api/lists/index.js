import { manualFetch } from '~/api/base';
// 列表
export const getlistsData = (options = {}) => {
  return useMyFetch(`/_api/v1/list`, {
    method: 'get',
    ...options,
  });
};

// 创建列表
export const createList = (data) => {
  return manualFetch(`/_api/v1/list`, {
    method: 'post',
    body: JSON.stringify(data),
  });
};
// 修改列表名称
export const updateList = (listId, data) => {
  return manualFetch(`/_api/v1/list/${listId}`, {
    method: 'put',
    body: JSON.stringify(data),
  });
};
// 查看列表详情
export const getlistDetail = (listId) => {
  return useMyFetch(`/_api/v1/list/${listId}`);
};
// 删除列表
export const deleteList = (listId) => {
  return manualFetch(`/_api/v1/list/${listId}`, {
    method: 'delete',
  });
};

// 列表的账号列表
export const getlistUsers = (listId) => {
  return useMyFetch(`/_api/v1/list/${listId}/account`);
};

// 添加账号到列表
export const addListUser = (listId, data) => {
  return manualFetch(`/_api/v1/list/${listId}/account`, {
    method: 'post',
    body: JSON.stringify(data),
  });
};
// 删除列表的账号
export const deleteListUser = (listId, userId) => {
  return manualFetch(`/_api/v1/list/${listId}/account/${userId}`, {
    method: 'delete',
  });
};
