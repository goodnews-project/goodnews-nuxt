// import request from '@/utils/request';

// 获取话题标签的列表
export const getExploreList = (data) => {
  return useMyFetch('/_api/v1/explore', {
    method: 'GET',
    params: data,
  });
};
