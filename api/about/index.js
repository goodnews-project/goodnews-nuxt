// 获取关于页面的信息
export const getDesc = () => {
  return useMyFetch('/_api/v1/instance/extended_description');
};

