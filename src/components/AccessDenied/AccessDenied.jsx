import React from "react";
import { connect } from 'react-redux';
import './AccessDenied.scss';
import { openAuthenticationModal } from '../../modals/Authentication/AuthenticationAction';

const NoMatch = (props) => {
  const { openAuthenticationModal } = props;

  return (
    <div className="notmatch">
      <div className="page-wrapper mid-content-wrapper">
        <div className="warning-text"> Từ chối truy cập </div>
        <div className="sub-text"> Vui lòng đăng nhập để truy cập trang này. </div>
        <button onClick={()=> openAuthenticationModal()} className="btn btn-homepage" to="/">
          Đăng nhập
        </button>
      </div>
    </div>
  )
}

export default connect(null, {
  openAuthenticationModal
})(NoMatch);