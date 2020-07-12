import {
  OPEN_COMPLAIN_CONTRACT_MODAL,
  CLOSE_COMPLAIN_CONTRACT_MODAL
} from './ComplainContractAction';

const INITIAL_MODAL = {
  toggle: false,
  id: '',
  onUpdateSuccess: () => {}
}

const complainContractModal = (state = INITIAL_MODAL, action) => {
  switch (action.type) {
    case OPEN_COMPLAIN_CONTRACT_MODAL:
      return {...state, toggle: true, id : action.id, onUpdateSuccess: action.onUpdateSuccess};
    case CLOSE_COMPLAIN_CONTRACT_MODAL:
      return {...state, toggle: false, id : '', onUpdateSuccess: ()=>{}};
    default:
      return state;
  }
};

export default complainContractModal;
