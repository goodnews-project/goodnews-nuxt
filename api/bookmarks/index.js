import { manualFetch } from '~/api/base';

// 将推文标记为书签 --api/v1/statuses/{statusId}/bookmark
export const bookmarkTweet = (tweetId) => {
  return manualFetch(`/_api/v1/statuses/${tweetId}/bookmark`, {
    method: 'post',
  });
};

// 移除书签 -- api/v1/statuses/{statusId}/un-bookmark
export const removeBookmark = (tweetId) => {
  return manualFetch('/_api/v1/statuses/' + tweetId + '/un-bookmark', {
    method: 'put',
  });
};

// 移除所有书签  api/v1/bookmarks/un-bookmark-all
export const removeAllBookmark = () => {
  return manualFetch('/_api/v1/bookmarks/un-bookmark-all', {
    method: 'put',
  });
};
