import { notification } from 'antd/lib';
import data from '../../components/Education/data.json';

export const notifyError = (message = 'Some error occured') => notification.error({
  message,
});

export const notifySuccess = (message = 'Successful', description = null) => notification.success({
  message,
  description,
});

export const isGoerli = () => {
  // on server side, window is undefined.
  if (typeof window === 'undefined') return false;
  return Number(window?.MODAL_PROVIDER?.chainId || 1) === 5;
};

export const getEducationItemByComponent = (slug) => data.filter((item) => slug === item.slug)[0];
