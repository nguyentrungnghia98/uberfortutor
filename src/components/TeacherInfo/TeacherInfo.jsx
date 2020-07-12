import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { User, Contract } from '../../apis';
import history from '../../history';
import './TeacherInfo.scss';
import SelectOption from '../shared/SelectOption/SelectOption';
import StarRatings from 'react-star-ratings';
import { converCurrency, formatDate } from '../../utils/pipe';
import ReactPaginate from 'react-paginate';
import { withRouter, Link } from 'react-router-dom';
import { openAuthenticationModal } from '../../modals/Authentication/AuthenticationAction';
import SendMessageModal from '../../modals/SendMessage/SendMessage';
import { openSendMessageModal } from '../../modals/SendMessage/SendMessageAction';

const review = {
  name: "Fake review",
  rate: 4.2,
  date: new Date(),
  price: 1210000,
  comment: 'Thầy dạy rất nhiệt tình, tận tâm, kiến thức chuyên sâu. Rất mong học với thầy trong những khóa tiếp theo',

}

const arrSortOption = [
  { text: 'Mới nhất', code: "reviewAt_-1" },
  { text: 'Đánh giá cao nhất', code: 'reviewRate_-1' },
  { text: 'Đánh giá thấp nhất', code: 'reviewRate_1' },
  { text: 'Số tiền cao nhất', code: 'totalPrice_-1' }
]


const TeacherInfo = (props) => {
  const [teacher, setTeacher] = useState();
  const [selectedSortOption, setSelectedSortOption] = useState(arrSortOption[0]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true)
  const [loadingReviews, setLoadingReviews] = useState(true);
  const limit = 5;
  const [reviews, setReviews] = useState([]);


  useEffect(() => {
    loadInfoUser();
  }, [])

  useEffect(() => {
    if(!teacher) return;
    loadingTeacherReviews();
  }, [selectedSortOption, page, teacher])

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

  function getFilterAndSort() {
    const data = {};
    let [property, type] = selectedSortOption.code.split("_")
    data.sort = {
      field : property,
      type : Number.parseInt(type)
    }
    return data;
  }

  async function loadingTeacherReviews() {
    try {
      setLoadingReviews(true);

      const response = await Contract.getListReview({
        id: teacher._id,
        role: teacher.role,
        page,
        limit,
        ...getFilterAndSort()
      }); 
      setReviews(response.docs);
      setTotal(response.total);

      setLoadingReviews(false);
    } catch (error) {
      console.log('err', error);
      setLoadingReviews(false);
      //setTeacher(null)
      Contract.alertError(error);
    }
  }

  function createContract() {
    if (!props.isSignedIn) {
      User.alert.warn("Vui lòng đăng nhập để tiếp tục.")
      return props.openAuthenticationModal();
    }
    if (teacher._id) history.push(`/create-contract/${teacher._id}`);
  }

  function sendMessage() {
    if (!props.isSignedIn) {
      User.alert.warn("Vui lòng đăng nhập để tiếp tục.")
      return props.openAuthenticationModal();
    }
    props.openSendMessageModal();
  }
  function setSortOption(i) {
    setSelectedSortOption(arrSortOption[i]);
  }

  function handlePageClick(data) {
    setPage(data.selected + 1);
    console.log(data)
    // let selected = data.selected;
    // let offset = Math.ceil(selected * this.props.perPage);

    // this.setState({ offset: offset }, () => {
    //   this.loadCommentsFromServer();
    // });
  };

  function renderReviews() {
    if(loadingReviews){
      return (
        <div className="spinner-wrapper mt-5" >
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )
    } 
    if (reviews.length === 0) {
      return (
        <div className="d-flex justify-content-center">
          <h5 className="mt-5"><i>Danh sách rỗng</i></h5>
        </div>
      )
    }
    console.log('reviews',reviews);
    return (
      <>
        {reviews.map((review, index) => {
          return (
            <div className="review " key={index}>
              <div className="row no-gutters">
                <div className="col-10 review-content">
                  <h5>{review.name}</h5>
                  {review.reviewContent?
                  <>
                    <div className="d-flex align-items-center review-info">
                    <StarRatings
                      starRatedColor="#ffde23"
                      rating={review.reviewRate}
                      numberOfStars={5}
                      starDimension="16px"
                      name='rating'
                      starSpacing="0"
                    />
                    <div className="date">{formatDate(review.reviewAt)}</div>
                  </div>
                  <span className="comment"><i>{review.reviewContent}</i></span>
                  </>:
                  <span className="comment"><i>Chưa có đánh giá.</i></span>}
                  
                </div>
                <div className="col-2 price">
                  {converCurrency(review.totalPrice)}đ
                </div>
              </div>
            </div>
          )
        })}
      </>
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
        <h5 className="mt-5"><i>Không tìm thấy người dùng</i></h5>
      </div>
    )
  }

  const pageCount = Math.ceil(total / limit);
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
                  {/* <div className="review">
                    <div className="section">
                      <b>100%</b>
                      <div className="divide-primary" />
                      <span>Buổi học thành công</span>
                    </div>
                    <div className="section">
                      <b>100%</b>
                      <div className="divide-primary" />
                      <span>Đánh giá tốt</span>
                    </div>
                  </div> */}
                </div>
                <h4 className="teacher--title">{teacher.job ? teacher.job : 'Không rõ nghề nghiệp'}</h4>
                <p className="introduction">{teacher.introduction}</p>
                <h4 className="teacher--title">Kĩ năng</h4>
                <div className="skills">
                  {teacher.major && (<>
                    {teacher.major.map(({ content, _id }, index) => {
                      return (
                        <Link to={`/cat/${content}/${_id}`} key={index}>
                        <button  type="button" className="btn btn-tag">
                          {content}
                        </button>
                        </Link>
                      )
                    })}
                  </>)}

                </div>
                <div className="statistic row">
                  <div className="col-3">
                    <p>{converCurrency(teacher.salaryPerHour)}đ</p>
                    <span>1 giờ học</span>
                  </div>
                  <div className="col-3">
                    <p>{converCurrency(teacher.numberOfStudent|| 0)}</p>
                    <span>học viên</span>
                  </div>
                  <div className="col-3">
                    <p>{converCurrency(teacher.teachedHour|| 0)}</p>
                    <span>giờ dạy</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="teacher history">
              <div className="history-container">
                <div className="history--header">
                  <h5>Lịch sử dạy học và đánh giá</h5>
                  <SelectOption setOption={setSortOption} selectedOption={selectedSortOption} arrOption={arrSortOption} />
                </div>
                <div className="history--body">
                  {renderReviews()}
                  {reviews.length > 0 && <ReactPaginate
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
                  />}

                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-3">
            <div className="actions">
              {props.role !== 1 && (
                <>
                  <button className="btn btn-primary" onClick={createContract}>Thuê ngay</button>
                  <button className="btn btn-light" onClick={sendMessage}><i className="far fa-paper-plane mr-2" />Nhắn tin</button>
                  <button className="btn btn-light"><i className="far fa-heart mr-2" />  Save</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <SendMessageModal />
    </>
  )
}


const mapStateToProps = (state) => {
  return {
    role: state.auth.user ? state.auth.user.role : -1,
    isSignedIn: state.auth.isSignedIn
  };
};

const tmp = withRouter(TeacherInfo);
export default connect(
  mapStateToProps, {
    openAuthenticationModal,
    openSendMessageModal
  }
)(tmp);
