// 获取新增角色权限列表
import { manualFetch } from '@/api/base';
export const getDataList = (params) => {
  return manualFetch(`/admin/_api/follow_recommendations`, {
    method: 'get',
    params,
  });
};

// 禁用/恢复推荐关注
export const bannedRecommend = (data) => {
  return manualFetch('/admin/_api/follow_recommendations/suppressed', {
    method: 'put',
    data: data,
  });
};
