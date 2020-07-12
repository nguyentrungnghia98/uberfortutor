import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Contract } from '../../apis';
import './DetailContract.scss';
import { TextField, TextareaAutosize } from '@material-ui/core';
import { converCurrency } from '../../utils/pipe';
import StarRatings from 'react-star-ratings';
import { connect } from 'react-redux';
import {openAlertWarning} from '../../actions/alert';

import {openComplainContractModal} from '../../modals/ComplainContract/ComplainContractAction';

const DetailContract = (props) => {
  const [loading, setLoading] = useState(false);
  const [processingReview, setProcessingReview] = useState(false)
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(0);
  const [contract, setContract] = useState();
  const { teacher, student, feePerHour,  numberOfHour, describe, status } = contract || {};
  let processing = false;

  useEffect(() => {
    reload();
  }, [])

  async function reload() {
    const { match } = props;
    console.log(props)
    const { id } = match.params;
    try {
      setLoading(true);
      const response = await Contract.getItem(id);
      setContract(response);
      setRating(response.reviewRate);
      setReviewContent(response.reviewContent); 
      setLoading(false);
    } catch (error) {
      console.log('err', error);
      setLoading(false);
      Contract.alertError(error);
    }
  }

  async function callApiUpdateContract(status){
    if(processing) return;
    let data = {id: contract._id, status};
    const {student, teacher, feePerHour, numberOfHour} = contract;
    data = { ...data, idStudent: student._id, idTeacher: teacher._id, skill: teacher.major, feePerHour, numberOfHour }
    
    try {
      processing = true;

      const response = await Contract.update(data);
      
      reload();

      processing = false;
      Contract.alert.success("Cập nhật thành công");
    } catch (error) {
      console.log('err', error);
      processing = false;
      //setTeacher(null)
      Contract.alertError(error);
    }
  }


  function onAcceptAlert(result){
    if (result) {
      callApiUpdateContract('finished')
    }
  }

  function updateContract(status){
    switch(status){
      case 'processing_complaint':
        props.openComplainContractModal(contract._id, reload);
        break;
      case 'finished':
        props.openAlertWarning(
          'Bạn có chắc chắn',
          'Sau kết thúc hợp đồng giáo viên sẽ nhận được tiền như thỏa thuận. Bạn sẽ không thể khiếu nại được nữa.',
          'Ok',
          onAcceptAlert
        );
        break;
      case 'denied':
        callApiUpdateContract('denied')
        break;
    }
    
  }

  async function updateReview(event){
    event.preventDefault();
    
    try {
      setProcessingReview(true);

      const response = await Contract.update({
        id: contract._id, 
        reviewRate: rating,
        reviewContent,
        reviewAt: new Date()
      });
      

      setProcessingReview(false);
      Contract.alert.success("Cập nhật thành công");
    } catch (error) {
      console.log('err', error);
      setProcessingReview(false);
      //setTeacher(null)
      Contract.alertError(error);
    }
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
  if (!contract) {
    return (
      <div className="page-wrapper teacher-info-container d-flex justify-content-center">
        <h5 className="mt-5"><i>Không tìm thấy hợp đồng</i></h5>
      </div>
    )
  }

  function renderContractInfo() {
    return (
      <div className="teacher custom-card">
        <div className="custom-card-container">
          <div className="custom-card--header teacher">
            <div className="row w-100">
              <div className="col-6 d-flex">
                <img src={teacher.avatar ? teacher.avatar : "/images/avatar.png"}
                  onError={(image) => {
                    image.target.src = "/images/avatar.png";
                  }} alt="avatar" />
                <div className="teacher-info">
                  <h5>{teacher.username}</h5>
                  <span>{teacher.job || 'Không rõ'}</span>
                  <span className="text-primary"><i>Gia sư</i></span>
                </div>
              </div>
              <div className="col-6 d-flex">
                <img src={student.avatar ? student.avatar : "/images/avatar.png"}
                  onError={(image) => {
                    image.target.src = "/images/avatar.png";
                  }} alt="avatar" />
                <div className="teacher-info">
                  <h5>{student.username}</h5>
                  <span>{student.job || 'Không rõ'}</span>
                  <span className="text-primary"><i>Học sinh</i></span>
                </div>
              </div>
            </div>


          </div>
          <div className="custom-card--body">
            <div className="form-field">
              <h4 className="">
                {contract.name}
              </h4>
            </div>
            <div className="form-field">
              <label className="text-label">
                Giá tiền cho 1 giờ
                  </label>
              <div className="flex-row-center">
                <TextField
                  variant="outlined"
                  placeholder="Ví dụ: 100000"
                  className='w-40 mr-3'
                  value={feePerHour}
                  InputProps={{
                    readOnly: true,
                  }}
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
                  value={numberOfHour}
                  InputProps={{
                    readOnly: true,
                  }}
                  required
                />
                <span>giờ</span>
              </div>
            </div>
            <div className="form-field">
              <div>=>  Tổng tiền: <b>{converCurrency(numberOfHour * feePerHour)}đ</b></div>
            </div>

            <div className="form-field">
              <label className="text-label">
                Mô tả công việc
                  </label>
              <TextareaAutosize
                variant="outlined"
                rows="6"
                placeholder="Nhập mô tả hợp đồng ví dự lịch học, môn học, ..."
                className='textarea-custom'
                value={describe}
                readOnly
                required
              />
            </div>
            

          </div>
        </div>
      </div>
    )
  }
  function renderContractReview() {
    if(contract.status === 'pending' || contract.status ==='denied') return;
    return (
      <div className="teacher custom-card">
        <div className="custom-card-container">
          <div className="custom-card--header teacher">

            <h5>Đánh giá và nhận xét</h5>
          </div>

          <div className="custom-card--body">
            <form onSubmit={updateReview} className="form-field">
              <div className="d-flex mb-4 align-items-center review-container">
                <p className="mr-4 my-0">Đánh giá của bạn về chất lượng giảng dạy của gia sư:</p>
                <StarRatings
                  starRatedColor="#ffde23"
                  rating={rating}
                  numberOfStars={5}
                  changeRating={(value) => setRating(value)}
                  starDimension="16px"
                  name='rating'
                  starSpacing="0"
                />
              </div>

              <p>Viết nhận xét của bạn vào bên dưới</p>
              <TextareaAutosize
                variant="outlined"
                rows="6"
                placeholder="Nhận xét của bạn về hợp đồng này..."
                className='textarea-custom'
                value={reviewContent}
                onChange={e => setReviewContent(e.target.value)}
                required
              />

              <button disabled={processingReview} type="submit" className="btn btn-primary mt-4 w-30 ml-auto">
                Đánh giá
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
  function renderActionContract() {
    switch (status) {
      case 'pending':
        return (
          <div className="custom-card">
            <div className="custom-card-container">
              <div className="custom-card--body">
                <div className="form-field align-items-center">
                  <h5>Trạng thái</h5>
                  <span className="text-warning mt-3">
                    Gia sư chưa xác nhận
                  </span>
                  <button onClick={e => updateContract('denied')} className="btn btn-primary mt-4">
                    Hủy hợp đồng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'processing':
        return (
          <div className="custom-card mt-3">
            <div className="custom-card-container">
              <div className="custom-card--body">
                <div className="form-field align-items-center">
                  <h5>Trạng thái</h5>
                  <span className="text-success mt-3">
                    Đã thanh toán.
                  </span>
                  <span className="text-success ">Đang trong quá trình học</span>
                  <button onClick={e => updateContract('processing_complaint')} className="btn btn-danger mt-4">
                    Khiếu nại hợp đồng
                  </button>
                  <button onClick={e => updateContract('finished')} className="btn btn-success mt-3">
                    Kết thúc hợp đồng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'processing_complaint':
        return (
          <div className="custom-card mt-3">
            <div className="custom-card-container">
              <div className="custom-card--body">
                <div className="form-field align-items-center">
                  <h5>Trạng thái</h5>
                  <span className="text-danger mt-3">
                    Học sinh đã khiếu nại.
                  </span>
                  <span className="text-danger text-center">Đang trong quá trình giải quyết</span>

                  <h5 className="mt-4">Nội dung khiếu nại</h5>
                  <TextareaAutosize
                    variant="outlined"
                    rows="4"
                    className='textarea-custom mt-2'
                    value={contract.complaintContent || "Không rõ"}
                    readOnly                
                />
               
                </div>
              </div>
            </div>
          </div>
        )
      case 'complainted':
        return (
          <div className="custom-card mt-3">
            <div className="custom-card-container">
              <div className="custom-card--body">
                <div className="form-field align-items-center">
                  <h5>Trạng thái</h5>
                  <span className="text-success text-center mt-3">
                    Học sinh khiếu nại thành công
                  </span>
                  <h5 className="mt-4">Nội dung khiếu nại</h5>
                  <TextareaAutosize
                    variant="outlined"
                    rows="4"
                    className='textarea-custom mt-2'
                    value={contract.complaintContent || "Không rõ"}
                    readOnly                
                />
                </div>
              </div>
            </div>
          </div>
        )
      case 'finished':
        return (
          <div className="custom-card mt-3">
            <div className="custom-card-container">
              <div className="custom-card--body">
                <div className="form-field align-items-center">
                  <h5>Trạng thái</h5>
                  <span className="text-success text-center mt-3">
                    Hợp đồng kết thúc thành công
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null;
    }
  }
  return (
    <div className="page-wrapper">
      <div className="contract-detail-container">
        <h4 className="ml-5">Thông tin hợp đồng</h4>
        <div className="row">
          <div className="col-12 col-lg-9">
            {renderContractInfo()}
            {renderContractReview()}
          </div>
          <div className="col-12 col-lg-3">
            <div className="mt-3 actions-contract">
              {renderActionContract()}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}


const mapStateToProps = (state) => {
  return {
    role: state.auth.user.role
  };
};

const _withRouter = withRouter(DetailContract);
export default connect(
  mapStateToProps, {
    openAlertWarning,
    openComplainContractModal
  }
)(_withRouter);