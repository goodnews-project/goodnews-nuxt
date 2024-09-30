export const getDemoData = () => useMyFetch('/_api/v2/instance');

export const getFollowData = () => {
  const url = '_api/v1/following?page=1';
  return useMyFetch(url, {
    method: 'get',
  });
};
