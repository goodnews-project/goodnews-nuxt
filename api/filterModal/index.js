import { manualFetch } from '../base';

// 获取过滤器列表
export const getTweetFilters = () => {
  return useMyFetch('/_api/filters', {
    method: 'GET',
  });
};

// 添加新的推文过滤器
export const createTweetFilters = (data) => {
  return manualFetch('/_api/filters/create', {
    method: 'POST',
    body: data,
  });
};

// 过滤一条推文
export const filterTweets = (data, id) => {
  return manualFetch(`/_api/v1/statuses/${id}/filter`, {
    method: 'POST',
    body: data,
  });
};
