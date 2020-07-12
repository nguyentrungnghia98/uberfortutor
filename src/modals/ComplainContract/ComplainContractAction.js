export const OPEN_COMPLAIN_CONTRACT_MODAL = 'OPEN_COMPLAIN_CONTRACT_MODAL';
export const CLOSE_COMPLAIN_CONTRACT_MODAL = 'CLOSE_COMPLAIN_CONTRACT_MODAL';


export const openComplainContractModal = (id, onUpdateSuccess) => {
  console.log('openComplainContractModal') 
  return {
    type: OPEN_COMPLAIN_CONTRACT_MODAL,
    id,
    onUpdateSuccess
  };
};
export const closeModal = () => {
  return {
    type: CLOSE_COMPLAIN_CONTRACT_MODAL
  };
};
