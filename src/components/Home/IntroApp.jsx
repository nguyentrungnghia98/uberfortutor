import React, { Component } from 'react';

class IntroApp extends Component {
  render() {
    return (
      <div className="home--card">
          <div className="intro-app">
            <h4>Về chúng tôi</h4>
            <p><b>Tìm kiếm gia sư, lớp học thêm</b> khiến bạn trở nên quá mệt mỏi, hay 
            bạn muốn <b>trở thành gia sư</b> kiếm thêm thu nhập. Hãy để <b>Uber for tutor </b>
             giải quyết giúp bạn</p>
             <button type="button" className="btn btn-primary">
              Xem thêm
             </button>
          </div>
      </div>
    );
  }

}

export default IntroApp;