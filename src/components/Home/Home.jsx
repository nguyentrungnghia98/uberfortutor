import React, { Component } from "react";
import history from '../../history';
import "./home.scss";
import IntroApp from "./IntroApp";
import PopularTeachers from "./PopularTeachers";
import ListSkill from "./ListSkill";

class Home extends Component {
  goToSearch = (e) => {
    e.preventDefault();
    history.push(`/search/${e.target.search.value}`);
  }
 
  render() {
    return (
      <>
        <div id='home-page' className='row mx-auto'>
          <div className='home-header'>

            <div id='home-page--container' className='home-page--container'>
              <div id='home-page--text'>
                <span>Chào mừng bạn đến với Uber for tutor</span>
              </div>
              <div className="home-page--subtext">Ứng dụng thuê gia sư nhanh chóng và uy tính nhất hiện nay</div>

              <form className="d-flex" onSubmit={this.goToSearch}>
                <div id='home-page--search' className='home-page--search'>
                  <div id='home-page--input'>
                    <input
                      className='custom-input-text'
                      type='text'
                      name="search"
                      required
                      placeholder='Bạn muốn học gì ...'
                    />
                  </div>

                </div>
                <button className="btn btn-search btn-info">
                  Tìm kiếm gia sư
                </button>
              </form>

            </div>
          </div>
          <div className="home--body">
            <IntroApp />
            <ListSkill />
            <PopularTeachers />
          </div>

        </div>
      </>
    );
  }
}

export default Home;
