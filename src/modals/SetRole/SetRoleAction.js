export const OPEN_SET_ROLE_MODAL = 'OPEN_SET_ROLE_MODAL';
export const CLOSE_SET_ROLE_MODAL = 'CLOSE_SET_ROLE_MODAL';


export const openSetRoleModal = (mode = 'login') => {
  return {
    type: OPEN_SET_ROLE_MODAL,
    mode
  };
};
export const closeModal = () => {
  return {
    type: CLOSE_SET_ROLE_MODAL
  };
};
