import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Contract } from '../../apis';
import './Contracts.scss';
import { converCurrency } from '../../utils/pipe';
import SelectOption from '../shared/SelectOption/SelectOption';
import ReactPaginate from 'react-paginate';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {openAlertWarning} from '../../actions/alert';
import {openComplainContractModal} from '../../modals/ComplainContract/ComplainContractAction';

const arrSortOption = [
  { text: 'Ngày tạo mới nhất', code: 'createTime_-1' },
  { text: 'Ngày tạo cũ nhất', code: 'createTime_1' },
  { text: 'Giá tiền tăng', code: 'totalPrice_1' },
  { text: 'Giá tiền giảm', code: 'totalPrice_-1' },
]

const arrStatusOption = [
  { text: 'Bất kì', code: 'any' },
  { text: 'Chờ giáo viến đồng ý', code: 'pending' , className:'text-warning'},
  { text: 'Đã từ chối', code: 'denied' , className:'text-danger'},
  { text: 'Đang học', code: 'processing', className:'text-success' },
  { text: 'Chờ giải quyết khiếu nại', code: 'processing_complaint' , className:'text-danger'},
  { text: 'Khiếu nại thành công', code: 'complainted', className:'text-danger' },
  { text: 'Kết thúc thành công', code: 'finished' , className:'text-success'},
]

const Contracts = (props) => {
  const {match} = props;
  const {path} = match;
  const initStatusOption = path === "/studying"?arrStatusOption[3]: (path === "/requests"? arrStatusOption[1] : arrStatusOption[0])
  const [loading, setLoading] = useState(false)
  const [selectedSortOption, setSelectedSortOption] = useState(arrSortOption[0])
  const [selectedStatusOption, setSelectedStatusOption] = useState(initStatusOption);
  const [contracts, setContracts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 4;
  let processing = false;

  useEffect(() => {
    console.log('change path')
    setPage(1);
    setSelectedStatusOption(initStatusOption);
    //reload();
  }, [path])

  useEffect(() => {
    reload();
  }, [selectedSortOption,selectedStatusOption, page])

  function getFilterAndSort() {
    const data = {};
    let [property, type] = selectedSortOption.code.split("_")
    data.sort = {
      field : property,
      type : Number.parseInt(type)
    }

    if(selectedStatusOption.code !== 'any'){
      data.condition  = {
        status: selectedStatusOption.code
      };
    }

    return data;
  }

  async function reload() {
    try {
      setLoading(true);

      const response = await Contract.getList({
        page,
        limit,
        ...getFilterAndSort()
      });
      setContracts(response.docs);
      setTotal(response.total);
      setLoading(false);
    } catch (error) {
      console.log('err', error);
      setLoading(false);
      //setTeacher(null)
      Contract.alertError(error);
    }
  }

  async function callApiUpdateContract(status, id){
    if(processing) return;
    let data = {id, status};
    if(status === 'finished'){
      const contract = contracts.find(el => el._id === id);
      if(!contract) return Contract.alertError('id not found');
      const {student, teacher, feePerHour, numberOfHour} = contract;
      data = { ...data, idStudent: student._id, idTeacher: teacher._id, skill: teacher.major, feePerHour, numberOfHour }
    }
    try {
      processing = true;

      const response = await Contract.update(data);
      
      reload();
      Contract.alert.success("Cập nhật thành công.");
      processing = false;
    } catch (error) {
      console.log('err', error);
      processing = false;
      //setTeacher(null)
      Contract.alertError(error);
    }
  }

  function onAcceptAlert(id, result){
    console.log(arguments, result, id)
    if (result) {
      callApiUpdateContract('finished', id)
    }
  }



  async function updateContract(e,status, id){
    e.preventDefault();
    e.stopPropagation();

    switch(status){
      case 'processing_complaint':
        props.openComplainContractModal(id, reload);
        break;
      case 'finished':
        props.openAlertWarning(
          'Bạn có chắc chắn',
          'Sau kết thúc hợp đồng giáo viên sẽ nhận được tiền như thỏa thuận. Bạn sẽ không thể khiếu nại được nữa.',
          'Ok',
          onAcceptAlert.bind(this,id)
        );
        break;
      default:
        callApiUpdateContract(status,id)
        break;
    }
    

  }

  function setSortOption(i) {
    setSelectedSortOption(arrSortOption[i]);
  }

  function setStatusOption(i) {
    setSelectedStatusOption(arrStatusOption[i]);
  }

  function handlePageClick(data) {
    setPage(data.selected + 1);
    //this.reload();
  }

  function renderButtonActions(status, id){    
    const {role} = props;   
    switch(status){
      case 'pending':
        if(role === 0) return;
        return (
          <>
            <button onClick={e => updateContract(e,'denied',id)} className="btn btn-secondary mr-3">Từ chối</button>
            <button onClick={e => updateContract(e,'processing',id)} className="btn btn-primary">Đồng ý</button>
          </>
        )
      case 'processing':
          return (
            <>
              <button onClick={e => updateContract(e,'processing_complaint',id)} className="btn btn-danger">Khiếu nại</button>
              {role === 0 && <button onClick={e => updateContract(e,'finished',id)} className="btn btn-success ml-3">Hoàn thành</button>}
            </>
          )
      default:
            return null;
    }
  }
  function renderStatus(status){
    const statusData = arrStatusOption.find(el => el.code === status);
    if(!statusData) return 'unknown'
    return <div className={statusData.className}>{statusData.text}</div>
  }
  function renderContracts() {
    if (loading) {
      return (
        <div className="spinner-wrapper mt-5" >
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>

      )
    }
    if (contracts.length === 0) {
      return (
        <h5 className="mt-5"><i>Danh sách hợp đồng rỗng</i></h5>
      )
    }
    
    const role = props.role;
    return (
      <>
        <div className="contracts">
          {
            contracts.map(({_id, status,name, student, teacher,feePerHour,numberOfHour,describe }, index) => {
              //reverse
              const user = role === 1?student:teacher;
              const userRole = role === 1?'student':'teacher';

              return (
                <div key={_id} className="contract">
                <Link to={`/${userRole}/${user._id}`}>
                  <img src={user.avatar ? user.avatar : "/images/avatar.png"}
                    onError={(image) => {
                      image.target.src = "/images/avatar.png";
                    }} alt="avatar" />
                    </Link>
                  <div className="contract-info w-100">
                    <Link to={`/${userRole}/${user._id}`} className="no-style-link">
                    <div className="row ">
                      <div className="col-7 d-flex text-primary align-items-center">
                        <h5>{user.username}</h5>
                        <small className="ml-3"> - {user.job || 'Không rõ'}</small>
                      </div>
                      <div className="col-5 text-right">                      
                      {renderButtonActions(status, _id)}
                      </div>
                    </div>
                    </Link>
                    <Link to={`/contract/${_id}`} className="no-style-link">
                    <h5 className="mb-2 mt-2">{name || 'Không rõ'}</h5>
                    <div className="row">
                      <div className="col-4">
                        Giá tiền: <b> {converCurrency(feePerHour)} / h</b>
                      </div>
                      <div className="col-4">
                        Thời gian: <b> {converCurrency(numberOfHour)}</b>
                      </div>
                      <div className="col-4">
                        Tổng tiền: <b> {converCurrency(numberOfHour*feePerHour)}</b>
                      </div>
                    </div>

                    <div className="my-2 d-flex">
                      <span className="mr-2">Trạng thái: </span> {renderStatus(status)}
                    </div>

                    <div className="d-flex mb-2 contract-description">
                    <span className="mr-2">Mô tả: </span> 
                    <span className="description">
                      {describe}
                    </span>
                    </div>
                    </Link>
                  </div>
                </div>
              )
            })
          }
        </div>
      </>
    )
  }

  function renderPageNumerNav(){
    const pageCount = Math.ceil(total/limit);

    return (
      <ReactPaginate
        previousLabel={'Trước'}
        nextLabel={'Tiếp'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
    )
  }

  return (
    <div className="page-wrapper contracts-container">
      <div className="contract-detail-container">
        <h4 className="ml-5">Danh sách hợp đồng</h4>
        <div className="teacher custom-card">
          <div className="custom-card-container">
            <div className="custom-card--header">
              <div className='seach-box'>
                <i className="fas fa-search" />
                <div className='search-input'>
                  <input
                    className='custom-input-text'
                    type='text'
                    placeholder='Tìm kiếm theo tên...'
                  />
                </div>
              </div>
            </div>
            <div className="contract-options">
              <div className="d-flex align-items-center justify-content-between">
                <div><span><b>Sắp xếp theo</b></span>
                  <SelectOption setOption={setSortOption} selectedOption={selectedSortOption} arrOption={arrSortOption} /></div>
                <div>
                  <span><b>Trạng thái</b></span>
                  <SelectOption setOption={setStatusOption} selectedOption={selectedStatusOption} arrOption={arrStatusOption} />
                </div>

              </div>
            </div>
            <div className="custom-card--body">

              {renderContracts()}
              {contracts.length !== 0 && (<>{renderPageNumerNav()}</>)}
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

const _withRouter = withRouter(Contracts);
export default connect(
  mapStateToProps,{
    openAlertWarning,
    openComplainContractModal
  }
)(_withRouter);
