import { manualFetch } from '~/api/base';
export const followUser = (userId) => {
  return manualFetch('/_api/v1/follow', {
    method: 'PUT',
    body: {
      account_id: userId,
    },
  });
};

// 取消关注
export const unfollowUser = (userId) => {
  return manualFetch(`/_api/v1/un-follow`, {
    method: 'PUT',
    body: {
      account_id: userId,
    },
  });
};

// 拉黑
export const blockUser = (userId) => {
  return manualFetch(`/_api/v1/block`, {
    method: 'POST',
    body: {
      target_account_id: userId,
    },
  });
};
// 获取已拉黑的用户
export const getBlockList = (params) => {
  return useMyFetch(`/_api/v1/block`, {
    method: 'GET',
    params,
  });
};
// 移出黑名单
export const unBlockUser = (userId) => {
  return manualFetch(`/_api/v1/block`, {
    method: 'DELETE',
    data: {
      target_account_id: userId,
    },
  });
};

// 屏蔽
export const muteUser = (data) => {
  return manualFetch(`/_api/v1/mute`, {
    method: 'POST',
    body: data,
  });
};
// 获取屏蔽列表
export const getMuteList = (params) => {
  return useMyFetch(`/_api/v1/mute`, {
    method: 'GET',
    params,
  });
};
// 移出屏蔽
export const unMuteUser = (userId) => {
  return manualFetch(`/_api/v1/mute`, {
    method: 'DELETE',
    data: {
      target_account_id: userId,
    },
  });
};

// 隐藏评论
export const hideReply = (statusId, toggle = 0) => {
  return manualFetch(`/_api/v1/statuses/${statusId}/toggle?toggle=${toggle}`, {
    method: 'PUT',
  });
};

// 举报用户
export const reportUser = (data) => {
  return manualFetch('/_api/v1/report', {
    method: 'POST',
    body: data,
  });
};

// 推荐关注
export const getRecommendFollow = (params) => {
  return useMyFetch({
    url: '/_api/v1/recommend/account',
    method: 'GET',
    params,
  });
};

// 修改密码
export const changePassword = (o, n) => {
  return manualFetch(`/_api/v1/change-password`, {
    method: 'POST',
    body: { old_password: o, password: n },
  });
};

// 新推文通知开关
export const toggleNewStatusNotification = (acct, enable) => {
  return manualFetch(`/_api/v1/${acct}/status-notify`, {
    method: 'PUT',
    body: {
      enable,
    }
  });
}