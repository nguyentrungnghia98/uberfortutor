import React, { useState } from 'react';
import {
  CircularProgress
} from '@material-ui/core';
import CssTextField from './CssTextField';
import {User} from '../../apis';
import toast from '../../utils/toast';
import {connect} from 'react-redux';
import {converCurrency} from '../../utils/pipe';
import {fetchUser} from '../../actions/user';

const Withdrawal = (props) => {
  const [money, setMoney] = useState('');
  const [phone, setPhone] = useState('');
  const [loadSaveDone, setLoadSaveDone] = useState(true);
  const [disableButton, setDisableButton] = useState(true);
  const [error, setError] = useState({ money:'', phone:''});


  function validFormInput() {
    let check = true;
    const _error = {...error};

    if (isNaN(money) || money < 0) {
      _error.money = 'Vui lòng nhập số tiền hợp lệ!';
      check = false;
    } else if (!props.money || (!isNaN(money) && money > props.money)) {
      _error.money = 'Số dư của bạn không đủ!';
      check = false;
    }
    else {
      _error.money = '';
    }
 
    const regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    if (!regex.test(phone)) {
      _error.phone = 'Vui lòng nhập số điện thoại hợp lệ! Ví dụ: 0969123456';
      check = false;
    } else {
      _error.phone = '';
    }
    console.log('error',_error)
    setError(_error);
    return check;
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    if (!validFormInput()) return;

    try {
      setLoadSaveDone(false);
      const data = {
        idUser: props.id,
        money: -money,
        phone
      };
      const response = await User.updateMoney(data);

      
      console.log('data', data)

      setLoadSaveDone(true);
      toast.success('Cập nhật thành công');
      props.fetchUser({money: props.money - money})
    } catch (error) {
      console.log({ error });
      setLoadSaveDone(true);
      User.alertError(error);
    }
  }

  return (
    <form onSubmit={handlePasswordSubmit} className="setting-form">
      <h4>Rút tiền</h4>

      
      <label className="text-label">
        Số dư: {converCurrency(props.money || 0)}đ
      </label>

      <label className="text-label">
        Số tiền cần rút
              </label>
      <CssTextField
        className=''
        variant="outlined"
        placeholder="Nhập số tiền cần rút"
        margin="normal"
        type="text"
        value={money}
        onChange={e => setMoney(e.target.value)}
        error={error.money === '' ? false : true}
        helperText={error.money}
        required
      />
      <label className="text-label">
        Số điện thoại đã liên kết với Momo
              </label>
      <CssTextField
        className=''
        variant="outlined"
        placeholder="Nhập số điện thoại"
        margin="normal"
        type="text"
        value={phone}
        onChange={e => {
          setPhone(e.target.value);
        }}
        error={error.phone === '' ? false : true}
        helperText={error.phone}
        required
      />
      <div className="actions">
        <button className="btn btn-primary" disabled={!loadSaveDone}>
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
    money: state.auth.user.money,
    id: state.auth.user._id
  };
};

export default connect(mapStateToProps, {
  fetchUser
})(Withdrawal) ;