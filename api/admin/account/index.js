
import { manualFetch } from '@/api/base';
// 获取账户信息
export const getAccountInfo = (id) => {
  return manualFetch(`/_api/admin/accounts/${id}`, {
    method: 'get',
  });
};

// 冻结账户
export const disableAccount = (id) => {
  return manualFetch(`/_api/admin/accounts/${id}/disable`, {
    method: 'POST',
  });
};

// 开启账户
export const enableAccount = (id) => {
  return manualFetch(`/_api/admin/accounts/${id}/enable`, {
    method: 'POST',
  });
};
// 设置为敏感内容
export const setAccountSensitive = (id) => {
  return manualFetch(`/_api/admin/accounts/${id}/sensitive`, {
    method: 'POST',
  });
};
// 取消设置为敏感内容
export const setAccountUnSensitive = (id) => {
  return manualFetch(`/_api/admin/accounts/${id}/un-sensitive`, {
    method: 'POST',
  });
};

// 隐藏账户
export const setAccountSilence = (id) => {
  return manualFetch(`/_api/admin/accounts/${id}/silence`, {
    method: 'POST',
  });
};

// 取消隐藏账户
export const setAccountUnSilence = (id) => {
  return manualFetch(`/_api/admin/accounts/${id}/un-silence`, {
    method: 'POST',
  });
};

// 永久停用账户
export const setAccountSuspend = (id) => {
  return manualFetch(`/_api/admin/accounts/${id}/suspend`, {
    method: 'POST',
  });
};
// 取消永久停用账户
export const setAccountUnSuspend = (id) => {
  return manualFetch(`/_api/admin/accounts/${id}/un-suspend`, {
    method: 'POST',
  });
};

// 设为敏感用户
export const setAccountSensitiveUser = (id) => {
  return manualFetch(`/_api/admin/accounts/${id}/sensitive`, {
    method: 'POST',
  });
};

// 取消敏感用户
export const setAccountUnSensitiveUser = (id) => {
  return manualFetch(`/_api/admin/accounts/${id}/un-sensitive`, {
    method: 'POST',
  });
};