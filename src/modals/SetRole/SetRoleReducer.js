import {
  OPEN_SET_ROLE_MODAL,
  CLOSE_SET_ROLE_MODAL
} from './SetRoleAction';


const setRoleModal = (state = false, action) => {
  switch (action.type) {
    case OPEN_SET_ROLE_MODAL:
      return true;
    case CLOSE_SET_ROLE_MODAL:
    return false;
    default:
      return state;
  }
};

export default setRoleModal;
