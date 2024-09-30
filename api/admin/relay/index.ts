import { manualFetch } from '~/api/base';
export const getList = () => {
  return manualFetch(`/_api/admin/relays`, {
    method: 'GET',
  });
};

// 启用
export const enable = (id: number | string) => {
  return manualFetch(`/_api/admin/relays/${id}/enable`, {
    method: 'PUT',
  });
};

// 禁用
export const disable = (id: number | string) => {
  return manualFetch(`/_api/admin/relays/${id}/disable`, {
    method: 'PUT',
  });
};

// 删除
export const del = (id: number | string) => {
  return manualFetch(`/_api/admin/relays/${id}`, {
    method: 'DELETE',
  });
};

// 添加并启用
export const addAndEnable = ({ inbox_url: string }) => {
  return manualFetch(`/_api/admin/relays`, {
    method: 'POST',
    body: JSON.stringify({ inbox_url: string }),
  });
};
