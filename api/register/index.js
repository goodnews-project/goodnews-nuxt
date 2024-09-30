// import request from '@/utils/request';
import { manualFetch } from "@/api/base";
// 获取规则
export const getRules = () => {
  return useMyFetch('/_api/v1/rule');
};

// 注册
export const register = (data) => {
  return manualFetch('/_api/v1/reg', {
    method: 'post',
    body: data,
  });
};

// 发送注册邮箱
export const sendEmail = (data) => {
  return manualFetch('/_api/v1/reg-send-email', {
    method: 'post',
    body: data,
  });
};
