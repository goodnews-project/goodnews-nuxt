import { manualFetch } from '../base';

// 给推文投票的接口
export const tweetToVote = (pollId: any, data: any) => {
  return manualFetch(`/_api/v1/polls/${pollId}/votes`, {
    method: 'post',
    body: JSON.stringify(data),
  });
};

// 发推
export const tweetToPost = (data: any) => {
  return manualFetch('/_api/v1/statuses', {
    method: 'POST',
    body: data,
  });
};

// 置顶推文
export const tweetToPin = (tweetId: string) => {
  return manualFetch(`/_api/v1/statuses/${tweetId}/pin`, {
    method: 'put',
  });
};
// 取消置顶
export const tweetToUnpin = (tweetId: string) => {
  return manualFetch(`/_api/v1/statuses/${tweetId}/unpin`, {
    method: 'put',
  });
};
// 删除推文
export const tweetToDelete = (tweetId: string) => {
  return manualFetch(`/_api/v1/statuses/${tweetId}`, {
    method: 'delete',
  });
};

// 时间线
export const getTimeLineData = (data: any) => {
  return useMyTestFetch('/_api/v1/timeline', 'GET', data);
};

// 我关注的人的推文
export const getFollowingTweets = (data: any) => {
  const list = useState('homeList');
  const nuxtApp = useNuxtApp();

  return useMyTestFetch('/_api/v1/following', 'GET', data, {
    getCachedData(key: any) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key] || list.value;
    },
  });
};

// 本服务器的推文--实时动态
export const getTweetsByLocal = (data: any) => {
  return useMyTestFetch('/_api/v1/local-timeline', 'GET', data);
};

// 推文的上下文
export const getTweetContext = (tweetId: any) => {
  return useMyLazyFetch(`/_api/v1/statuses/${tweetId}/context`, {
    method: 'get',
  });
};

// 推文详情
export const getTweetDetail = (params: any) => {
  return useMyFetch(`/_api/v1/statuses/${params.acct}/status/${params.id}`, {
    method: 'get',
  });
};

// 推文转发
export const tweetToRepost = (tweetId: string) => {
  return manualFetch(`/_api/v1/statuses/${tweetId}/re-blog`, {
    method: 'put',
  });
  // return useMyFetch({
  //   url: `/_api/v1/statuses/${tweetId}/re-blog`,
  //   method: 'put',
  // });
};

// 推文取消转发
export const tweetToUnrepost = (tweetId: string) => {
  return manualFetch(`/_api/v1/statuses/${tweetId}/undo-re-blog`, {
    method: 'put',
  });
  // return useMyFetch({
  //   url: `/_api/v1/statuses/${tweetId}/undo-re-blog`,
  //   method: 'put',
  // });
};

// 喜欢推文
export const tweetToFave = (tweetId: string) => {
  return manualFetch(`/_api/v1/statuses/${tweetId}/fave`, {
    method: 'put',
  });
};
// 取消喜欢推文
export const tweetToUnfave = (tweetId: string) => {
  return manualFetch(`/_api/v1/statuses/${tweetId}/un-fave`, {
    method: 'put',
  });
};

// 评论推文
export const replyToTweet = (data: any) => {
  return manualFetch(`/_api/v1/statuses`, {
    method: 'post',
    body: data,
  });
};
// 评论推文的列表
export const getTweetReplyList = (tweetData: any, query: any) => {
  return useMyLazyFetch(`/_api/v1/statuses/${tweetData.acct}/status/${tweetData.id}/replies`, {
    method: 'get',
    params: query,
  });
};

// 编辑推文
export const editTweetData = (data) => {
  return manualFetch(`/_api/v1/statuses/${data.id}`, {
    method: 'put',
    body: data,
  });
};

// 记录用户查看的推文
export const recordTweetView = (status_ids: string) => {
  return manualFetch(`/_api/v1/view-statuses`, {
    method: 'post',
    body: {
      status_ids,
    }
  });
}
// 付费解锁此推文
export const unlockTweet = (tweetId: string, hash: string) => {
  return manualFetch(`/_api/v1/statuses/${tweetId}/unlock`, {
    method: 'put',
    body: {
      hash,
    },
  });
};
