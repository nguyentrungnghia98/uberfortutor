export const OPEN_SEND_MESSAGE_MODAL = 'OPEN_SEND_MESSAGE_MODAL';
export const CLOSE_SEND_MESSAGE_MODAL = 'CLOSE_SEND_MESSAGE_MODAL';


export const openSendMessageModal = (mode = 'login') => {
  return {
    type: OPEN_SEND_MESSAGE_MODAL,
    mode
  };
};
export const closeModal = () => {
  return {
    type: CLOSE_SEND_MESSAGE_MODAL
  };
};
