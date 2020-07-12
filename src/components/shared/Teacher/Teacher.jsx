import React from "react";
import history from '../../../history';
import {Link} from 'react-router-dom';
import './Teacher.scss';
// const teacher = {
//   avatar: '',
//   username: '',
//   email: '',
//   salaryPerHour: 25,
//   address: 'Tp.Hồ Chí Minh',
//   job: 'Giáo viên Toán',
//   skills: [
//     {name: 'Toán 12'},{name: 'Tin học'},{name: 'React'},{name: 'Toán'},{name: 'Lập trình web'},
//   ]
// }
function converCurrency(money) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
  });
  return formatter.format(money).slice(1);
}
const Teacher = (props) => {
  const {onClickBtn,data} = props;
  const { avatar, username, job, address, salaryPerHour, major, _id } = data;
  return (
    <div className="teacher">
      <div className="teacher-container">
        <div className="teacher-info">
          <div className="info-left">
            <img src={avatar?avatar:"/images/avatar.png"}
              onError={(image) => {
                image.target.src = "/images/avatar.png";
              }} alt="avatar" />
          </div>
          <div className="info-right">
            <div className="name">{username}</div>
            <div className="job">{job}</div>
          </div>
        </div>
        <div className="sub-info">
          <div className="salary"><b>{converCurrency(salaryPerHour)}đ</b>/h</div>
          <div className="address">{address}</div>
        </div>
        <div className="divide"></div>
        <div className="skills">
        {major &&(
          <>
          {major.map(({content,_id}) => {
            return (
              <Link to={`/cat/${content}/${_id}`} key={_id}>
              <button  type="button" className="btn btn-tag">
                {content}
              </button>
              </Link>
            )
          })}
          </>
        )}
          
        </div>
        <div className="btn btn-primary" onClick={()=> {
          if(onClickBtn) onClickBtn(_id)
            else history.push(`/teacher/${_id}`)
        }}>
          Thông tin chi tiết
        </div>
      </div>
    </div>
  )
}

export default Teacher;