import { manualFetch } from '../base';

// 规则列表
export const getNsqInfo = () => {
  return manualFetch('/admin/_api/nsq/stats', {
    method: 'get',
  });
};
