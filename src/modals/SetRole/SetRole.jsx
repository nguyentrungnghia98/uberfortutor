import React, { useState, useEffect } from "react";
import {User} from '../../apis';
import { connect } from 'react-redux';
import { fetchUser } from '../../actions/user';
import { closeModal } from './SetRoleAction';
import './SetRole.scss';
import toast from '../../utils/toast';

import {
  Dialog
} from '@material-ui/core';
const SetRoleModal = props => {
  const {
    toggle,
    closeModal,
    fetchUser,
    user
  } = props;

  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('student');

  useEffect(() => {
    setLoading(false);
  }, [props.toggle])

  function handleClose() {
    console.log('close')
    closeModal();
  }


  async function callApiPost(url, data, message, callback) {
    try {
      setLoading(true);

      const userToken = localStorage.getItem('userToken');
        const response = await User.axios.post(url,data, {
          headers: { authorization : userToken }
        });

      console.log('data', data, response)
        
      setLoading(false);

      if (response.data.results) {
        callback(response.data.results.object);
      } else {
        callback();
      }


      toast.success(message);
    } catch (error) {
      console.log({ error });
      setLoading(false);
      let message = 'Some thing wrong!';
      if (error.response && error.response.data && error.response.data.message) message = error.response.data.message;
      toast.error(message);
    }
  }

  async function handleSubmit(event, type) {
    event.preventDefault();

    const url = `/user/update`;
    const data = { role: role === 'student' ? 0 : 1 };
    const message = "Đăng kí thành công"

    const callback = (user) => {
      fetchUser(data);
      closeModal()
    };

    callApiPost(url, data, message, callback);
  }

  function renderFillInfoForm() {
    return (
      <div className='popup-form'>
        <form autoComplete="off" onSubmit={(e) => handleSubmit(e, 'register')}>

          <div className='form-row-buttons btns-custom'>
            <p>Tôi muốn:</p>
            <div className="d-flex">
              <button
                type="button" onClick={() => setRole('student')}
                className={"btn btn-white " + (role === 'student' ? 'active' : '')}>Thuê gia sư</button>
              <button
                type="button" onClick={() => setRole('teacher')}
                className={"btn btn-white " + (role === 'teacher' ? 'active' : '')}>Làm gia sư</button>
            </div>
          </div>

          <div className='form-row-buttons cf'>
            <button
              className='btn-lrg-standard fullwidth mb-4'
              id='login-btn'
              name='commit'
              tabIndex='4'
              type='submit'
              disabled={loading}
            >
              {!loading ? 'Tạo tài khoản' : (
                <div className="spinner-border text-light" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </button>
          </div>
        </form>

      </div>
    )
  }


  return (
    <div className='static-modal'>
      <Dialog open={toggle} onClose={handleClose} className="modal-login">

        <div className='card card-login'>
          <div className='popup-content-login'>
            <div className='main-message'>
              <h5>Điền đầy đủ thông tin để hoàn tất việc đăng kí</h5>
              <span>{user? user.email: ''}</span>

            </div>
            {renderFillInfoForm()}
          </div>
        </div>

      </Dialog>
    </div>
  );
};


const mapStateToProps = (state) => {
  return {
    toggle: state.setRoleModal,
    user: state.auth.user,
  };
};

export default connect(
  mapStateToProps, {
    closeModal,
    fetchUser
  }
)(SetRoleModal);
