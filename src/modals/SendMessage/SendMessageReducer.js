import {
  OPEN_SEND_MESSAGE_MODAL,
  CLOSE_SEND_MESSAGE_MODAL
} from './SendMessageAction';


const sendMessageModal = (state = false, action) => {
  switch (action.type) {
    case OPEN_SEND_MESSAGE_MODAL:
      return true;
    case CLOSE_SEND_MESSAGE_MODAL:
    return false;
    default:
      return state;
  }
};

export default sendMessageModal;
