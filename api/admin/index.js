import { manualFetch } from '../base';

// 获取角色列表
export const getRoleList = () => {
  return manualFetch(`/_api/admin/roles`, {
    method: 'get',
  });
};

// 获取新增角色权限列表
export const getCreateRoles = (params) => {
  return manualFetch(`/_api/admin/roles/create`, {
    method: 'get',
    params,
  });
};

// 新增角色
export const createRole = (data) => {
  return manualFetch(`/_api/admin/roles`, {
    method: 'post',
    body: data,
  });
};

// 编辑角色
export const editRole = (data) => {
  return manualFetch(`/_api/admin/roles/${data.id}`, {
    method: 'PUT',
    body: data,
  });
};

// 编辑角色信息
export const getEditRoles = (id) => {
  return manualFetch(`/_api/admin/roles/${id}/edit`, {
    method: 'get',
  });
};

export const getUserList = (data) => {
  return manualFetch(`/admin/api/user/list`, {
    method: 'GET',
    params: data,
  });
};

export const bannedUser = (data) => {
  return manualFetch(`/admin/api/user/banned`, {
    method: 'PUT',
    body: data,
  });
};
