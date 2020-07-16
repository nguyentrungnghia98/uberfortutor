import React, { useState } from 'react';
import {
  CircularProgress
} from '@material-ui/core';
import CssTextField from './CssTextField';
import {User} from '../../apis';
import { fetchUser } from '../../actions/user';
import {connect} from 'react-redux';
import toast from '../../utils/toast';

function converCurrency(money) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
  });
  return formatter.format(money).slice(1);
}

const Salary = (props) => {
  const {user, fetchUser} = props;
  const [loadSaveDone, setLoadSaveDone] = useState(true);
  const [salary, setSalary] = useState(user.salaryPerHour||'') ;
  
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoadSaveDone(false);
      const data = {
        salaryPerHour: salary
      };
      const response = await User.updateInfo(data);
      fetchUser(response);
      console.log('data', data, response)

      setLoadSaveDone(true);
      toast.success('Cập nhật thành công!!!');
    } catch (error) {
      console.log({ error });
      setLoadSaveDone(true);
      let message = 'Some thing wrong!';
      if (error.response && error.response.data && error.response.data.message) message = error.response.data.message;
      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="setting-form salary-form">
      <h4>Thu phí giảng dạy</h4>
      <div className="salary-field"> 
        <div className="salary-info">
          <p>Phí trên giờ</p>
          <span>Đây là tổng số tiền học sinh sẽ thấy</span>
        </div>
        <div className="salary-price">
            <CssTextField
            variant="outlined"
            placeholder=""
            value={salary}
            onChange={e => setSalary(e.target.value)}
          />
          <span>/hr</span>
        </div>
      </div>

      <div className="salary-field"> 
        <div className="salary-info">
          <p>Hệ thống thu phí</p>
          <span>Hệ thống sẽ chiết khấu 20% thu nhập của bạn</span>
        </div>
        <div className="salary-price">
          <div>  {converCurrency(Math.round(salary*0.2,3))} </div>
          <span>/hr</span>
        </div>
      </div>

      <div className="salary-field no-border"> 
        <div className="salary-info">
          <p>Số tiền bạn nhận được</p>
          <span>Số tiền sau khi trừ phí</span>
        </div>
        <div className="salary-price">
        <div> {converCurrency(Math.round(salary*0.8,3))} </div>
          <span>/hr</span>
        </div>
      </div>
      <div className="actions">
            <button className="btn btn-primary">
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
export default connect(mapStateToProps, {fetchUser})(Salary);