import {
  OPEN_AUTHENTICATION_MODAL,
  CLOSE_AUTHENTICATION_MODAL
} from './AuthenticationAction';

const INITIAL_MODAL = {
  toggle: false,
  modeModal: 'login'
}

const authenticationModal = (state = INITIAL_MODAL, action) => {
  switch (action.type) {
    case OPEN_AUTHENTICATION_MODAL:
      console.log('reducer', action)
      return {...state, toggle: true, modeModal : action.mode};
    case CLOSE_AUTHENTICATION_MODAL:
    return {...state, toggle: false};
    default:
      return state;
  }
};

export default authenticationModal;
