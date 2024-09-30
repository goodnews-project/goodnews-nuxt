// 获取推文列表

// 搜索接口
import { manualFetch } from '~/api/base';
export const getHashTagData = (params) => {
  return manualFetch('/_api/v1/search', {
    method: 'get',
    params,
  });
};
