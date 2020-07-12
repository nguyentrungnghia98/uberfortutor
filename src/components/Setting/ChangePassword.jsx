import React, { useState } from 'react';
import {
  CircularProgress
} from '@material-ui/core';
import CssTextField from './CssTextField';
import {User} from '../../apis';
import { logOut } from '../../actions/user';
import {connect} from 'react-redux';
import toast from '../../utils/toast';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadSaveDone, setLoadSaveDone] = useState(true);
  const [disableButton, setDisableButton] = useState(true);

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    try {
      setLoadSaveDone(false);
      const data = {
        oldPassword: password,
        newPassword
      };
      const response = await User.changePassword(data);
      //fetchUser(response);
      //logOut();
      console.log('data', data, response)

      setLoadSaveDone(true);
      toast.success('Cập nhật thành công');
    } catch (error) {
      console.log({ error });
      setLoadSaveDone(true);
      let message = 'Some thing wrong!';
      if (error.response && error.response.data && error.response.data.message) message = error.response.data.message;
      toast.error(message);
    }
  }

  return (
    <form onSubmit={handlePasswordSubmit} className="setting-form">
      <h4>Đổi mật khẩu</h4>
      <label className="text-label">
        Mật khẩu hiện tại
              </label>
      <CssTextField
        className=''
        variant="outlined"
        placeholder="Nhập mật khẩu hiện tại"
        margin="normal"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <label className="text-label">
        Mật khẩu mới
              </label>
      <CssTextField
        className=''
        variant="outlined"
        placeholder="Nhập mật khẩu mới"
        margin="normal"
        type="password"
        value={newPassword}
        onChange={e => {
          setNewPassword(e.target.value);
          if (e.target.value !== confirmPassword) {
            setDisableButton(true);
          } else {
            setDisableButton(false);
          }
        }}
        required
      />
      <label className="text-label">
        Nhập lại mật khẩu mới
              </label>
      <CssTextField
        className=''
        variant="outlined"
        placeholder="Nhập lại mật khẩu mới"
        margin="normal"
        value={confirmPassword}
        type="password"
        onChange={e => {
          setConfirmPassword(e.target.value);
          if (e.target.value !== newPassword) {
            setDisableButton(true);
          } else {
            setDisableButton(false);
          }
        }}
      />
      <div className="actions">
        <button className="btn btn-primary" disabled={disableButton}>
          {loadSaveDone ? (
            'Cập nhật'
          ) : (
              <CircularProgress size={20} />
            )}
        </button>
      </div>
    </form>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  };
};
export default connect(mapStateToProps, {logOut})(ChangePassword) ;