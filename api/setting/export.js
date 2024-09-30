import { manualFetch } from '../base';

export const getExportsList = (params) => {
  return manualFetch('/_api/admin/exports', {
    method: 'get',
    params,
  });
};

// 导出请求的列表
export const requestData = (params) => {
  return manualFetch('/_api/admin/exports/request', {
    method: 'get',
  });
};

// 下载存档
export const downloadArchive = (id) => {
  return manualFetch(`/_api/admin/backups/${id}/download`, {
    method: 'get',
  });
};
