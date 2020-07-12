import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Teacher from '../shared/Teacher/Teacher';
import {User} from '../../apis';

const responsive = {
  desktop: {
    breakpoint: {
      max: 3000,
      min: 1024
    },
    items: 3,
    partialVisibilityGutter: 40
  },
  mobile: {
    breakpoint: {
      max: 464,
      min: 0
    },
    items: 1,
    partialVisibilityGutter: 30
  },
  tablet: {
    breakpoint: {
      max: 1024,
      min: 464
    },
    items: 2,
    partialVisibilityGutter: 30
  }
};

class PopularTeachers extends Component {

  constructor(props) {
    super(props);

    this.state = {
      teachers: [],
      total: 0,
      loading: true      
    };
  }

  reload = async () => {
    try {
      this.setState({loading: true});

      const {docs, total} = await User.getListTeacher({
        page:1,
        limit: 12,
        sort: {
          field: "numberOfStudent",
          type: -1
        }
      });
      this.setState({teachers:docs, total});

      this.setState({loading: false});
    } catch (error) {
      console.log('err', error);
      this.setState({loading: false, teachers: []});
      User.alertError(error)
    }
  }

  componentDidMount(){
    this.reload();
  }

  renderListTeachers = () => {
    const {teachers} = this.state;
    if(!teachers.length) {
      return <h5><i>Danh sách rỗng</i></h5>
    }
    return (
      <Carousel
      additionalTransfrom={0}
      arrows
      autoPlaySpeed={3000}
      centerMode={false}
      className=""
      containerClass="container-with-dots"
      dotListClass=""
      draggable
      focusOnSelect={false}
      infinite
      itemClass=""
      keyBoardControl
      minimumTouchDrag={80}
      renderButtonGroupOutside={false}
      renderDotsOutside={false}
      responsive={responsive}
      showDots={false}
      sliderClass=""
      slidesToSlide={1}
      swipeable
      >
        {teachers.map((item,index) => {
          return (
            <Teacher key={index} data ={item}/>
          )
        })}
      </Carousel>
    );
  }

  render() {
    return (
      <div className="home--card">
        <div className="home--card__header">
          <div className="home--card__title">
            Người dạy nổi bật
              </div>
          <Link to="/cat/all" className="btn see-more">
            Xem thêm &gt;
              </Link>
        </div>
        {this.renderListTeachers()}
      </div>
    );
  }
}

export default PopularTeachers;