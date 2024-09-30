// import request from '@/utils/request'
import { manualFetch } from '~/api/base';
// 登录
export const loginApi = (data) => {
  return manualFetch('/_api/v1/login', {
    method: 'POST',
    body: data,
  });
};

// 修改密码
export const changePwdApi = (old_password, password) => {
  return manualFetch('/_api/v1/change-password', {
    method: 'POST',
    body: JSON.stringify({ old_password, password }),
  });
};

// 注册验证邮箱
export const registerApi = (token) => {
  return useMyFetch('/_api/v1/confirm', {
    method: 'POST',
    body: JSON.stringify({ confirmation_token: token }),
  });
};

// 忘记密码的邮箱验证
export const forgetPwdApi = (email) => {
  return manualFetch('/_api/v1/reset-password/send-mail', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

// 重置密码
export const resetPwdApi = (data) => {
  return manualFetch('/_api/v1/reset-password/reset', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
