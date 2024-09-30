import { manualFetch } from '../base';

// 获取过滤器列表
export const getFilters = () => {
  return manualFetch('/_api/admin/filters', {
    method: 'GET',
  });
};

// 添加新的过滤器
export const createFilters = (data) => {
  return manualFetch('/_api/admin/filters/create', {
    method: 'POST',
    body: data,
  });
};

export const delFilters = (id) => {
  return manualFetch(`/_api/admin/filters/delete/${id}`, {
    method: 'DELETE',
  });
};

export const getFiltersDetails = (id) => {
  return manualFetch(`/_api/admin/filters/${id}`, {
    method: 'GET',
  });
};
