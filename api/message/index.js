import { manualFetch } from '~/api/base';
// 获取会话记录
export const getInfo = (id) => {
  return useMyFetch(() => `/_api/v1/dm/list/${id.value}`, {
    method: 'get',
  });
};

// 发送私信
export const send = (data) => {
  return useMyFetch(`/_api/v1/dm/conversations/send`, {
    method: 'post',
    body: data,
  });
};

// 创建会话
export const create = (data) => {
  return useMyFetch(`/_api/v1/dm/conversations/create`, {
    method: 'post',
    body: data,
  });
};
// 获取会话列表
export const getConversations = async () => {
  return useMyFetch(`/_api/v1/dm/conversations`, {
    method: 'get',
  });
};

// 搜索
export const searchPost = (data) => {
  return manualFetch('/_api/v1/dm/search', {
    method: 'get',
    params: {
      keyword: data,
    },
  });
};

// 阅读私信
export const readDm = (data) => {
  return useMyFetch(`/_api/v1/dm/read`, {
    method: 'get',
    params: data,
  });
};
