import { FETCH_USER, SIGN_IN, SIGN_OUT } from './types';

export const fetchUser = (user) => {
  return {
    type: FETCH_USER,
    user
  };
};

export const signIn = (response) => async (dispatch) => {
  console.log('action signIn');
  localStorage.setItem('userToken', `${response.token}`);
  dispatch({
    type: SIGN_IN,
    user: response
  });
  // history.push('/profile');
};

export const logOut = () => async (dispatch) => {
  localStorage.setItem('userToken', '');
  dispatch({
    type: SIGN_OUT
  });
  //history.push('/login');
};
