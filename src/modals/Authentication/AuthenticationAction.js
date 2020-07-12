export const OPEN_AUTHENTICATION_MODAL = 'OPEN_AUTHENTICATION_MODAL';
export const CLOSE_AUTHENTICATION_MODAL = 'CLOSE_AUTHENTICATION_MODAL';


export const openAuthenticationModal = (mode = 'login') => {
  return {
    type: OPEN_AUTHENTICATION_MODAL,
    mode
  };
};
export const closeAuthenticationModal = () => {
  return {
    type: CLOSE_AUTHENTICATION_MODAL
  };
};
