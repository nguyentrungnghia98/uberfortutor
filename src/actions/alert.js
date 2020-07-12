import { OPEN_ALERT, CLOSE_ALERT } from './types';

// export interface DataAlert {
//   type: 'success' | 'warning' | 'info' | 'error' | 'question' | string;
//   title?: string;
//   subtitle?: string;
//   okText?: string;
//   confirmText?: string;
//   cancelText?: string;
//   onYesFn?: any;
// }

export const openAlertSuccess = (
  title,
  subtitle,
  okText = '',
  onYesFn = () => {}
) => {
  const data = { type: 'success', title, subtitle, okText, onYesFn };
  return {
    type: OPEN_ALERT,
    data
  };
};

export const openAlertInfo = (
  title,
  subtitle,
  okText = ''
) => {
  const data = { type: 'info', title, subtitle, okText };
  return {
    type: OPEN_ALERT,
    data
  };
};

export const openAlertError = (
  title,
  subtitle,
  okText = ''
) => {
  const data = { type: 'error', title, subtitle, okText };
  return {
    type: OPEN_ALERT,
    data
  };
};

export const openAlertWarning = (
  title,
  subtitle,
  confirmText = '',
  onYesFn = () => {},
  cancelText = '',
  confirmFn = null
) => {
  const data = {
    type: 'warning',
    title,
    subtitle,
    confirmText,
    cancelText,
    confirmFn,
    onYesFn
  };
  return {
    type: OPEN_ALERT,
    data
  };
};

export const openAlertQuestion = (
  title,
  subtitle,
  confirmText = '',
  onYesFn = () => {},
  cancelText = '',
  confirmFn = null
) => {
  const data = {
    type: 'question',
    title,
    subtitle,
    confirmText,
    cancelText,
    confirmFn,
    onYesFn
  };
  return {
    type: OPEN_ALERT,
    data
  };
};



export const closeAlert = () => {
  return {
    type: CLOSE_ALERT
  };
};
