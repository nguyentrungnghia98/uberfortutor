import { OPEN_ALERT, CLOSE_ALERT } from '../actions/types';


// export interface AlertReducer {
//   isOpen: boolean;
//   data: DataAlert;
// }

const INITAL_STATE = {
  isOpen: false,
  data: {
    type: 'success',
    title: '',
    subtitle: '',
    okText: '',
    confirmText: '',
    cancelText: '',
    onYesFn: () => {}
  }
};

export default (state = INITAL_STATE, action) => {
  switch (action.type) {
    case OPEN_ALERT:
      return {
        ...state,
        isOpen: true,
        data: action.data
      };
    case CLOSE_ALERT:
      return { ...INITAL_STATE };

    default:
      return { ...state };
  }
};
