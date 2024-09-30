import { manualFetch } from '../base';

// 获取服务器招牌
export const getSettingBranding = () => {
  return manualFetch('/_api/admin/settings/branding', {
    method: 'GET',
  });
};

// 设置获取服务器招牌
export const setSettingBranding = (data) => {
  return manualFetch('/_api/admin/settings/branding', {
    method: 'PUT',
    body: data,
  });
};

// 获取服务器关于
export const getSettingAbout = () => {
  return manualFetch('/_api/admin/settings/about', {
    method: 'GET',
  });
};

// 设置服务器关于
export const setSettingAbout = (data) => {
  return manualFetch('/_api/admin/settings/about', {
    method: 'PUT',
    body: data,
  });
};

// 获取服务器敏感内容
export const getSettingSitive = async () => {
  let res = await manualFetch('/_api/admin/settings/branding', {
    method: 'GET',
  });
  if (res.receive_remote_sensitive == '1') {
    res.receive_remote_sensitive = true;
  } else {
    res.receive_remote_sensitive = false;
  }

  if (res.push_local_sensitive == '1') {
    res.push_local_sensitive = true;
  } else {
    res.push_local_sensitive = false;
  }
  return res;
};

// 设置获取敏感内容
export const setSettingSitive = (data) => {
  // 将字段中的true转为1,false转为0
  let formData = deepClone(data)
  for (let key in formData) {
    if (formData[key] === true) {
      formData[key] = '1';
    } else if (formData[key] === false) {
      formData[key] = '0';
    }
  }
  return manualFetch('/_api/admin/settings/branding', {
    method: 'PUT',
    body: formData,
  });
};
