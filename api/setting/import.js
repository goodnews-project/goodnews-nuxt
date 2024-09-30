import { manualFetch } from '../base';

// 导入
export const importData = (data) => {
  return manualFetch('/_api/admin/imports/upload', {
    method: 'post',
    body: data,
  });
};
