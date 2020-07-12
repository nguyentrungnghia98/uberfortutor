import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { User, Contract } from '../../apis';
import './CreateContract.scss';
import { TextField, TextareaAutosize } from '@material-ui/core';
import { converCurrency } from '../../utils/pipe';
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';

let getTokenPurchase;
const CreateContract = (props) => {
  const [teacher, setTeacher] = useState();
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('');
  const [salaryPerHour, setSalaryPerHour] = useState(0);
  const [totalHour, setTotalHour] = useState(1);
  const [description, setDescription] = useState('');
  const [isCheck, setIsCheck] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [error, setError] = useState({ totalHour: '', salaryPerHour: '' });
  

  useEffect(() => {
    async function loadInfoUser() {
      const { match } = props;
      console.log(props)
      const { id } = match.params;
      try {
        setLoading(true);

        const response = await User.getItem(id);
        setTeacher(response)
        setSalaryPerHour(response.salaryPerHour)
        setLoading(false);
      } catch (error) {
        console.log('err', error);
        setLoading(false);
        setTeacher(null)
        User.alertError(error);
      }
    }
    if (props.role === 0) loadInfoUser();
  }, [])

  if (props.role !== 0) {
    return (
      <div className="page-wrapper text-center">
        <h5 className="mt-5">
          <i>Chúng tôi không hỗ trợ thuê gia sư nếu bạn đã là gia sư.<br /> Vui lòng tạo tài khoản khác với vai trò là học sinh</i>
        </h5>
      </div>
    )
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
        <h5 className="mt-5"><i>Không tìm thấy giáo viên</i></h5>
      </div>
    )
  }

  function validFormInput() {
    let check = true;
    const err = { ...error }
    if (isNaN(salaryPerHour)) {
      err.salaryPerHour = 'Định dạng không hợp lệ! Vui lòng nhập số.';
      check = false;
    } else {
      err.salaryPerHour = '';
    }

    if (isNaN(totalHour)) {
      err.totalHour = 'Định dạng không hợp lệ! Vui lòng nhập số.';
      check = false;
    } else {
      err.totalHour = '';
    }
    console.log(err)
    setError(err)
    return check;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    let token;
    if(getTokenPurchase){
      token = await getTokenPurchase();
    }
    console.log('token',token);
    if(!token)
      return Contract.alert.error("Kết nối thanh toán thất bại!");
    if(!token.token || !token.token.id)
      return Contract.alert.error("Vui lòng nhập đúng thẻ thanh toán!");
    
    
    if (!validFormInput()) {
      Contract.alert.error("Dữ liệu nhập không hợp lệ!");
      return
    }
    //history.push(`/contract`);
    
    const data = {
      tokenId: token.token.id,
      name,
      feePerHour: salaryPerHour,
      numberOfHour: totalHour,
      describe: description,
      teacher: teacher._id,
    }
    try {
      setLoadingCreate(true);

      const response = await Contract.create(data);

      Contract.alert.success("Tạo hợp đồng thành công.");
      setLoadingCreate(false);
    } catch (error) {
      console.log('err', error);
      setLoadingCreate(false);
      Contract.alertError(error);
    }
  }

  return (
    <div className="page-wrapper">
      <div className="contract-container">
        <h4 className="ml-5">Thuê gia sư</h4>
        <form onSubmit={handleSubmit}>
          <div className="teacher custom-card">
            <div className="custom-card-container">
              <div className="custom-card--header teacher">
                <img src={teacher.avatar ? teacher.avatar : "/images/avatar.png"}
                  onError={(image) => {
                    image.target.src = "/images/avatar.png";
                  }} alt="avatar" />
                <div className="teacher-info">
                  <h5>{teacher.username}</h5>
                  <span>{teacher.job || 'Không rõ'}</span>
                </div>

              </div>
              <div className="custom-card--body">
                <div className="form-field">
                  <label className="text-label">
                    Tên hợp đồng
              </label>
                  <TextField
                    variant="outlined"
                    placeholder="Ví dụ: Dạy hóa 12 vào T3,T5"
                    className='w-60'
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="teacher custom-card">
            <div className="custom-card-container">
              <div className="custom-card--header">
                <h5>Điều khoản</h5>
              </div>
              <div className="custom-card--body">
                <div className="form-field">
                  <label className="text-label">
                    Giá tiền cho 1 giờ
                  </label>
                  <div className="flex-row-center">
                    <TextField
                      variant="outlined"
                      placeholder="Ví dụ: 100000"
                      className='w-40 mr-3'
                      error={error.salaryPerHour === '' ? false : true}
                      helperText={error.salaryPerHour}
                      value={salaryPerHour}
                      onChange={e => setSalaryPerHour(e.target.value)}
                      required
                    />
                    <span>/hr</span>
                  </div>
                  <span className="ml-2">Giá gia sư yêu cầu là <b>{converCurrency(teacher.salaryPerHour)}đ</b></span>
                </div>
                <div className="form-field">
                  <label className="text-label">
                    Số giờ thuê
                  </label>
                  <div className="flex-row-center">
                    <TextField
                      variant="outlined"
                      placeholder="Ví dụ: 1"
                      className='w-40 mr-3'
                      error={error.totalHour === '' ? false : true}
                      helperText={error.totalHour}
                      value={totalHour}
                      onChange={e => setTotalHour(e.target.value)}
                      required
                    />
                    <span>giờ</span>
                  </div>
                </div>
                <div className="form-field">
                  <div>=>  Tổng tiền: <b>{converCurrency(totalHour * salaryPerHour)}đ</b></div>
                </div>
              </div>
            </div>
          </div>


          <div className="teacher custom-card">
            <div className="custom-card-container">
              <div className="custom-card--header">
                <h5>Mô tả công việc</h5>
              </div>
              <div className="custom-card--body">

                <div className="form-field">
                  <TextareaAutosize
                    variant="outlined"
                    rows="6"
                    placeholder="Nhập mô tả hợp đồng ví dự lịch học, môn học, ..."
                    className='textarea-custom'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="teacher custom-card">
            <div className="custom-card-container">
              <div className="custom-card--header">
                <h5>Thanh toán</h5>
              </div>
              <div className="custom-card--body">

                <div className="form-field">
                  <span className="ml-1 mb-3">Tổng tiền: <b>{converCurrency(totalHour * salaryPerHour)}đ</b></span>
                 

                  <StripeProvider apiKey="pk_test_JE8m9Z9tVIoUAu6yOjRvLaHy">
                    <div className="example">
                      <Elements>
                        <CheckoutForm setFunction={fn => {
                          console.log('inital',fn);
                          getTokenPurchase = fn
                        }}/>
                      </Elements>
                    </div>
                  </StripeProvider>
                  <div className="text-secondary text-card px-2">
                  <small style={{fontSize:'14px'}}>
                    Need a test card?<br /> Try 4242 4242 4242 4242, a valid expiration date in the future, and any CVC number and zip code.
                  </small>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="teacher custom-card">
            <div className="custom-card-container">
              <div className="custom-card--body">
                <div className="form-field">

                  <div className="flex-row-center">
                    <input type="checkbox" className="mr-2" name="vehicle1" checked={isCheck} onChange={e => setIsCheck(e.target.checked)} />
                    <span> Có, tôi đã đọc và đồng ý với <a href="script:0"> điều khoản </a> của công ty</span>
                  </div>
                  <button type="submit" className="btn btn-primary w-30 mt-3" disabled={!isCheck || loadingCreate}>
                    Thuê {teacher.username}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>

    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    role: state.auth.user.role
  };
};

const tmp = withRouter(CreateContract);
export default connect(
  mapStateToProps
)(tmp);
