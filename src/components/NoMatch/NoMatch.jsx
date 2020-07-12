import React from "react";
import {Link} from "react-router-dom";
import './NoMatch.scss';
const NoMatch = () => {
  return (
    <div className="notmatch">
      <div className="page-wrapper mid-content-wrapper">
        <div className="number-text"> 404 </div>
        <div className="sub-text"> Xin lỗi, không tìm thấy đường dẫn. </div>
        <Link className="btn btn-homepage" to="/">
          <i className="fas fa-home" />Về trang chủ
    </Link>
      </div>
    </div>
  )
}

export default NoMatch;