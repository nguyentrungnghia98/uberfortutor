import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { User } from '../../apis';
import { withRouter } from 'react-router-dom';
import { openAuthenticationModal } from '../../modals/Authentication/AuthenticationAction';
import SendMessageModal from '../../modals/SendMessage/SendMessage';
import {openSendMessageModal} from '../../modals/SendMessage/SendMessageAction';



const StudentInfo = (props) => {
  const [teacher, setTeacher] = useState();
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    async function loadInfoUser() {
      const { match } = props;
      console.log(props)
      const { id } = match.params;
      try {
        setLoading(true);

        const response = await User.getItem(id);
        setTeacher(response)

        setLoading(false);
      } catch (error) {
        console.log('err', error);
        setLoading(false);
        setTeacher(null)
        User.alertError(error);
      }
    }
    loadInfoUser();
  }, [])

  function sendMessage() {
    if(!props.isSignedIn){
      User.alert.warn("Vui lòng đăng nhập để tiếp tục.")
      return props.openAuthenticationModal();
    }
    props.openSendMessageModal();
  }

  if (loading) {
    return (
      <div className="page-wrapper teacher-info-container d-flex justify-content-center">
        <div className="spinner-wrapper mt-5" >
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    )
  }
  if (!teacher) {
    return (
      <div className="page-wrapper teacher-info-container d-flex justify-content-center">
        <h5 className="mt-5"><i>Không tìm thấy người dùng</i></h5>
      </div>
    )
  }
  return (
    <>
    <div className="page-wrapper teacher-info-container">
      <div className="row px no-gutters">
        <div className="col-12 col-lg-9">
          <div className="teacher">
            <div className="teacher-container">
              <div className="teacher-info">
                <div className="d-flex">
                  <div className="info-left">
                    <img src={teacher.avatar ? teacher.avatar : "/images/avatar.png"}
                      onError={(image) => {
                        image.target.src = "/images/avatar.png";
                      }} alt="avatar" />
                  </div>
                  <div className="info-right">
                    <div className="name">{teacher.username}</div>
                    <div className="job"><i className="fas fa-map-marker-alt mr-2"></i> {teacher.address}</div>
                  </div>
                </div>
              </div>
              <h4 className="teacher--title">Nghề nghiệp</h4>
              <p className="introduction">{teacher.job ? teacher.job : 'Không rõ nghề nghiệp'}</p>               
              <h4 className="teacher--title">Mô tả</h4>
              <p className="introduction">{teacher.introduction}</p>          
            </div>
          </div>          
        </div>
        <div className="col-12 col-lg-3">
          <div className="actions">
                <button className="btn btn-light" onClick={sendMessage}><i className="far fa-paper-plane mr-2" />Nhắn tin</button>
                <button className="btn btn-light"><i className="far fa-heart mr-2" />  Save</button>
          </div>
        </div>
      </div>
    </div>

    <SendMessageModal/>
    </>
  )
}


const mapStateToProps = (state) => {
  return {
    role: state.auth.user ? state.auth.user.role : -1,
    isSignedIn: state.auth.isSignedIn
  };
};

const tmp = withRouter(StudentInfo);
export default connect(
  mapStateToProps,{
    openAuthenticationModal,
    openSendMessageModal
  }
)(tmp);
