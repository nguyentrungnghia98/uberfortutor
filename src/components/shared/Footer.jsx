import React, {useState} from "react";
import History from "../../history";

const Footer = () => {
  const [path, setPath] = useState(window.location.pathname);
  History.listen(location => {
    setPath(location.pathname)
  });

  if(path === '/messages') return null;
  return (
    <div className='footer'>
      <div className='footer-logo'>
        <div className='header--logo'>
            <img src="/images/logo-gia-su-white.png" alt="logo"/>
          </div>
        <div className='footer-icon'>
          <i className='fab fa-instagram' />
          <i className='fab fa-twitter' />
          <i className='fab fa-facebook-f' />
          <i className='fas fa-globe-europe' />
        </div>
      </div>
      <div className='footer-info'>
        <div className='footer-info-title'>Liên hệ</div>
        <div className='footer-info-content'>Địa chỉ : 840/43 Hương Lộ 2 , Phường
Bình Trị Đông A , Quận Bình Tân</div>
        <div className='footer-info-content'>
        Hotline: 0903696269
        </div>
        <div className='footer-info-content'>Email : Uberfortutor.vn@gmail.com</div>
      </div>
      <div className='footer-info'>
        <div className='footer-info-title'>Đến với ứng dụng</div>
        <div className='footer-info-content'>Tìm kiếm gia sư</div>
        <div className='footer-info-content'>Trở thành gia sư</div>
        <div className='footer-info-content'>Ứng tuyển</div>
      </div>
      <div className='footer-info'>
        <div className='footer-info-title'>Giới thiệu</div>
        <div className='footer-info-content'>– Ứng dụng giáo dục nền tảng công nghệ 4.0</div>
        <div className='footer-info-content'>– Mang tới sự trải nghiệm mới, giúp việc
học trở nên dễ dàng hơn.</div>
      </div>
    </div>
  );
};

export default Footer;
