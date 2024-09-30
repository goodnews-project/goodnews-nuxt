import { manualFetch } from '../base';

export const getNum = () => {
  return manualFetch('/_api/v1/markers', {
    method: 'get',
  });
};
