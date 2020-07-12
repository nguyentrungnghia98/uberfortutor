import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { openAuthenticationModal } from "../../modals/Authentication/AuthenticationAction";
import { openSetRoleModal } from "../../modals/SetRole/SetRoleAction";
import { logOut } from "../../actions/user";
import History from "../../history";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: window.location.pathname,
      visible: window.location.pathname !== '/',
      search: ''
    }

    History.listen(location => {
      console.log(location.pathname)
      this.setState({ path: location.pathname });
      if (location.pathname === '/') {
        this.setState({ visible: false });
      }else{
        this.setState({ visible: true });
      }

      if (!location.pathname.includes('/search')) {
        this.setState({ search: '' });
      }

      if(location.pathname.includes('/messages')){
        document.getElementsByTagName("META")[1].content="width=1280";
      }else{
        document.getElementsByTagName("META")[1].content="width=device-width, initial-scale=1";
      }
    });
  }

  handleScroll = () => {
    const { path } = this.state;
    if (path !== '/')
      return this.setState({ visible: true });

    const currentScrollPos = window.pageYOffset;
    const _visible = currentScrollPos > document.querySelector('#header').offsetHeight;

    this.setState({ visible: _visible });
  };

  componentDidMount() {
    
    console.log('')
    window.addEventListener("scroll", this.handleScroll);
  }

  items = {
    NotLogin: [
      { text: "Trờ thành gia sư", isHightLight: true, data: 'signup' },
      { text: "Đăng nhập", data: 'login' },
      { text: "Đăng kí", data: 'signup' }
    ],
    LoginAsStudent: [
      { text: "Đang học", isHightLight: true, link: "/studying" },
      { text: "Hợp đồng học", link: "/contracts" },
      { text: "Tin nhắn", link: "/messages" }
    ],
    LoginAsTeacher: [
      { text: "Yêu cầu dạy học", isHightLight: true, link: "/requests" },
      { text: "Hợp đồng học", link: "/contracts" },
      { text: "Doanh thu", link: "/salary" },
      { text: "Tin nhắn", link: "/messages" }
    ],
  };

  imgError(image) {
    image.target.src = "/images/avatar.png";
  }


  onLogout = () => {
    this.props.logOut();
  }

  goToSearch = (e) => {
    e.preventDefault();
    History.push(`/search/${this.state.search}`);
  }

  renderElement = () => {
    const { isSignedIn, user, openAuthenticationModal,openSetRoleModal } = this.props;

    if (isSignedIn) {
      let role;
      switch (user.role) {
        case 0:
          role = 'LoginAsStudent'; break;
        case 1: role = 'LoginAsTeacher'; break;
        default: role = 'SelectRole';
      }
      if (role === 'SelectRole') {
        return (
          <ul className='navbar-nav ml-auto'>
            <li className='nav-item'>
              <div
                href="/"
                className={`nav-link hightlight`}
                onClick={() => openSetRoleModal()}
              >
                Chọn vai trò để tiếp tục
              </div>
            </li>
            <li className='nav-item'>
              <div
                href="/"
                className={`nav-link hightlight`}
                onClick={this.onLogout}
              >
                Đăng xuất
              </div>
            </li>
          </ul>
        )
      }

      return (
        <ul className='navbar-nav ml-auto'>
          {this.items[role].map((item, index) => {
            return (
              <li className='nav-item' key={item.text + index}>
                <Link className='nav-link' to={item.link}>
                  <span className={item.isHightLight ? 'hightlight' : ''}>
                    {item.text}
                  </span>
                </Link>
              </li>
            )
          })}
          <li className='nav-item'>
            <div className="dropdown avatar" data-toggle='dropdown'>
              <img src={user.avatar || "/images/avatar.png"} onError={this.imgError} alt="" />
            </div>
            <div className='dropdown-menu'>
              <div className="user-info">
                <img src={user.avatar || "/images/avatar.png"}  onError={this.imgError} alt="avatar" />
                <p>{user.username}</p>
              </div>
              <Link to="/setting">
              <button
                className='dropdown-item'
                type='button'
              >
                <i className="fas fa-cog" />
                Cài đặt
              </button>
              </Link>
              
              <button onClick={this.onLogout}
                className='dropdown-item'
                type='button'
              >
                <i className="fas fa-sign-out-alt"></i>
                Đăng xuất
              </button>
            </div>
          </li>
        </ul>
      )
    }

    return (
      <ul className='navbar-nav ml-auto'>
        {this.items["NotLogin"].map((item, index) => {
          return (
            <li className='nav-item' key={item.text + index}>

              <div
                href="/"
                className={`nav-link ${item.isHightLight ? 'hightlight' : ''}`}
                onClick={() => openAuthenticationModal(item.data)}
              >
                {item.text}
              </div>
            </li>
          )
        })}
      </ul>
    )
  };

  render() {
    const { visible, search } = this.state;
    return (
      <nav className={`navbar navbar-expand-lg bg-white ${visible ? 'visible navbar-light' : 'non-visible navbar-dark'}`} id="header">
        <Link to='/'>
          <div className='header--logo'>
            <img src="/images/logo-gia-su.png" alt="logo" />
          </div>
        </Link>

        
        <button
          className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          data-target='#navbarSupportedContent'
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon' />
        </button>

        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
        <form className='seach-box' onSubmit={this.goToSearch}>
          <svg className='ic_search_24px' viewBox='3 3 28.582 29.475'>
            <path
              fill='rgba(164,164,164,1)'
              id='ic_search_24px'
              d='M 23.42772483825684 21.53753662109375 L 22.13669586181641 21.53753662109375 L 21.67911338806152 21.08252334594727 C 23.28064727783203 19.1613597869873 24.24483489990234 16.6672191619873 24.24483489990234 13.95399856567383 C 24.24483489990234 7.904021263122559 19.48926162719727 3.000000238418579 13.6224193572998 3.000000238418579 C 7.755575180053711 3.000000238418579 3.000000238418579 7.904021263122559 3.000000238418579 13.95399856567383 C 3.000000238418579 20.00397491455078 7.755575180053711 24.90799903869629 13.6224193572998 24.90799903869629 C 16.25350952148438 24.90799903869629 18.67215347290039 23.91371154785156 20.53516006469727 22.26218795776367 L 20.97640037536621 22.73405265808105 L 20.97640037536621 24.06538200378418 L 29.14748764038086 32.47468566894531 L 31.58247375488281 29.96368789672852 L 23.42772483825684 21.53753662109375 Z M 13.6224193572998 21.53753662109375 C 9.553215980529785 21.53753662109375 6.268435955047607 18.15022277832031 6.268435955047607 13.95399856567383 C 6.268435955047607 9.75777530670166 9.553215980529785 6.370460510253906 13.6224193572998 6.370460510253906 C 17.69162178039551 6.370460510253906 20.97640037536621 9.75777530670166 20.97640037536621 13.95399856567383 C 20.97640037536621 18.15022277832031 17.69162178039551 21.53753662109375 13.6224193572998 21.53753662109375 Z'
            />
          </svg>
          <div className='search-input'>
            <input
              className='custom-input-text'
              name="search"
              value={search}
              onChange={e => this.setState({search: e.target.value})}
              required
              type='text'
              placeholder='Bạn muốn học gì...'
            />
          </div>
        </form>
          {this.renderElement()}
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    isSignedIn: state.auth.isSignedIn
  };
};

export default connect(
  mapStateToProps,
  {
    openAuthenticationModal,
    logOut,
    openSetRoleModal
  }
)(NavBar);
