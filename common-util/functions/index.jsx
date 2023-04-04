import { notification } from 'antd/lib';

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
