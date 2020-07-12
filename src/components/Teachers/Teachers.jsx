import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Teacher from '../shared/Teacher/Teacher';
import './Teachers.scss';
import SelectOption from '../shared/SelectOption/SelectOption';
import ReactPaginate from 'react-paginate';
import { User, TagSkill } from '../../apis';
import history from '../../history';

const arrSortOption = [
  { text: 'Tên A-Z', code: 'username_1' },
  { text: 'Tên Z-A', code: 'username_-1' },
  { text: 'Giá tiền tăng', code: 'salaryPerHour_1' },
  { text: 'Giá tiền giảm', code: 'salaryPerHour_-1' },
  { text: 'Số học sinh đã dạy tăng', code: 'history_1' },
  { text: 'Số học sinh đã dạy giảm', code: 'history_-1' },
]

const arrPriceOption = [
  { text: 'Phí trên giờ bất kì', code: 'any' },
  { text: 'Dưới 20.000đ', code: 'LESS__20000' },
  { text: 'Từ 20.000đ đến 50.000đ', code: 'FROM_TO__20000__50000' },
  { text: 'Từ 50.000đ đến 70.000đ', code: 'FROM_TO__50000__70000' },
  { text: 'Từ 70.000đ đến 100.000đ', code: 'FROM_TO__70000__100000' },
  { text: 'Trên 100.000đ', code: 'GREATER__100000' },
]

let arrAddressOption = [
  { text: 'Bất kì', code: 'any' },
  { text: 'Hà Nội', code: 'Hà Nội' },
  { text: 'Đà Nẵng', code: 'Đà Nẵng' },
  { text: 'Hồ Chí Mình', code: 'Hồ Chí Mình' },
  { text: 'Khác', code:'', type: 'input'}
]
class Teachers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      offset: 0,
      limit: 8,
      teachers: [],
      total: 0,
      loading: true,
      skills: []      
    };
    this.page = 1;
    this.selectedSortOption = arrSortOption[0]
    this.selectedPriceOption = arrPriceOption[0]
    this.selectedAddressOption = arrAddressOption[0]

    history.listen(location => {
      console.log(location)
      //this.reload();
    });
  }

  getFilterAndSort = () => {
    const data = {};
    let [property, type] = this.selectedSortOption.code.split("_")
    data.sort = {
      field : property,
      type : Number.parseInt(type)
    }

    if(this.selectedPriceOption.code !== 'any'){
      const [type, ...values] = this.selectedPriceOption.code.split("__");
      const fee = {
        type
      }
      if(values.length === 1) fee.value = values[0];
      else {
        fee.value1 = values[0];
        fee.value2 = values[1];
      }
      data.fee = fee;
    }

    if(this.selectedAddressOption.code !== 'any'){
      data.place = this.selectedAddressOption.code;
    }
    return data;
  }

  reload = async (reload = false) => {
    const { match } = this.props;
    const { category, id,search } = match.params;
    const {limit} = this.state;
    console.log(match)
    const filter = {};
    if(match.path.includes('/search')){
      filter.searchText = search;
    }else{
      if(category !== 'all') filter.arrTagSkill = [id];
    }
    

    try {
      this.setState({loading: true});

      const {docs, total} = await User.getListTeacher({
        page: this.page,
        limit,
        ...filter,
        ...this.getFilterAndSort()
      },reload);
      this.setState({teachers:docs, total});

      this.setState({loading: false});
    } catch (error) {
      console.log('err', error);
      this.setState({loading: false, teachers: []});
      User.alertError(error)
    }
  }

  getSkills = async () => {
    try {
      const response = await TagSkill.getList();
      this.setState({
        skills: response.slice(0, 6)
      })
    } catch (error) {
      TagSkill.alert.error(error);
    }
  }

  componentDidMount() {
    try {
      const tasks = [];
      tasks.push(this.reload(true));
      tasks.push(this.getSkills());
      Promise.all(tasks);
    } catch (error) {
      console.log('error', error)
    }
  }

  componentDidUpdate(prevProps){
    if(prevProps.match.url !== this.props.match.url) {
      this.page = 1;
      this.reload();
    }
  }

  onClickBtnInfo = (id) => {
    const path = `/teacher/${id}`;
    localStorage.setItem(path, window.location.pathname);
    history.push(path);
  }

  setSortOption = (i) => {
    this.selectedSortOption = arrSortOption[i];
    this.reload();
  }
  setPriceOption = (i) => {
    this.selectedPriceOption = arrPriceOption[i];
    this.reload();
  }
  setAddressOption = (i) => {
    this.selectedAddressOption = arrAddressOption[i];
    this.reload();
  }
  onArrSortOptionChange = (value) => {
    const data = { text: 'Khác', code:value, type: 'input'}
    arrAddressOption[arrAddressOption.length - 1] = data;
    this.selectedAddressOption = data;
    this.reload();
  }

  renderHeader = () => {
    const {skills} = this.state;
    if(skills.length === 0) return null;
    return (
      <div className="d-flex flex-wrap justify-content-between header">
        <div className="d-flex">
          {
            skills.map(({_id,content}) => {
              return (
                <Link className="header-menu-item ml-3 mr-5"
                  to={`/cat/${content}/${_id}`}
                  key={_id}>
                  <h5><b>{content}</b></h5>
                </Link>
              );
            })
          }
        </div>
        <Link className="header-menu-item ml-3 mr-3 text-primary"
          to="/all-skills">
          <h5><b>Xem tất cả kĩ năng</b></h5>
        </Link>
      </div>
    );
  }

  renderFilterOption = () => {
    return (
      <>
        <div className="filter-option-box w-100 pl-3 pr-3 mb-2 d-flex align-items-center justify-content-between">
          <div>
            <span>Lọc theo</span>
            <SelectOption setOption={this.setAddressOption} onInputChange={this.onArrSortOptionChange} selectedOption={this.selectedAddressOption} arrOption={arrAddressOption} />
            <SelectOption setOption={this.setPriceOption} selectedOption={this.selectedPriceOption} arrOption={arrPriceOption} />
          </div>
          <div className="mt-mb">
            <span>Sắp xếp theo</span>
            <SelectOption setOption={this.setSortOption} selectedOption={this.selectedSortOption}  arrOption={arrSortOption} />
          </div>
        </div>

      </>
    );
  }

  handlePageClick = data => {
    this.page = data.selected + 1;
    this.reload();
  };

  renderPageNumerNav() {
    const {total, limit} = this.state;
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
        onPageChange={this.handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
    )
  }

  remderListTeacher = () => {
    const { total, loading, teachers } = this.state;
    const { match } = this.props;
    const { category, search } = match.params;


    return (
      <div className="categories-body">

        <div className="mt-3 mb-3 ml-2">

              <h4 className="mb-4">{`${(loading ||teachers.length === 0)?0:total} kết quả cho "${category?category:search}"`}</h4>
        </div>


        <div className="d-flex flex-column align-items-center">

          {this.renderFilterOption()}
          <div className="w-100">
            <div className="row no-gutters">
              {loading ? (
                <>
                  <div className="spinner-wrapper">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                </>
              ) : (
                  <>{
                    teachers.map((item, index) => {
                      return (
                        <div key={item._id} className="col-12 col-sm-6 col-md-4 col-xl-3">
                          <Teacher data={item} onClickBtn={this.onClickBtnInfo}/>
                        </div>
                      );
                    })
                  }</>)}
              {(!loading && teachers.length === 0 ) && (
                <h5 className="mt-5">Rỗng</h5>
              )}
            </div>
          </div>
          {teachers.length !== 0 && (<>{this.renderPageNumerNav()}</>)}
          
        </div>

      </div>
    );
  }

  render() {
    return (
      <div className="page-wrapper teachers">
        <div className="teachers--container">
          {this.renderHeader()}
          {this.remderListTeacher()}
        </div>
        {/* <ScriptTag src="/js/cv-in-category.js" type="text/javascript"/> */}
      </div>
    );
  }
}

export default withRouter(Teachers);