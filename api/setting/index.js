import { manualFetch } from '~/api/base';
// 获取系统实例信息
export const getInstance = () => {
  return useMyFetch('/_api/v2/instance', {
    method: 'get',
  });
};

export function updateProfile(data) {
  return manualFetch('/_api/v1/user-profile', {
    method: 'put',
    body: JSON.stringify(data),
  });
}

// 仪表盘数据
export const getDashboardData = () => {
  return useMyFetch('/_api/admin/dashboard?start_at=2024-01-18', {
    method: 'get',
  });
};

export const getReportList = (params) => {
  return useMyFetch('/admin/_api/reports', {
    method: 'get',
    params,
  });
};

export const getReportDetail = (id) => {
  return useMyFetch('/admin/_api/reports/${id}/detail', {
    method: 'get',
  });
  // return request({
  //   url: `/admin/_api/reports/${id}/detail`,
  //   method: 'get'
  // })
};

// 设置举报分类
export const setReportCategory = (id, data) => {
  return useMyFetch('/admin/_api/reports/${id}/setCategory', {
    method: 'put',
    body: data,
  });
  // return request({
  //   url: `/admin/_api/reports/${id}/setCategory`,
  //   method: 'PUT',
  //   data
  // })
};
