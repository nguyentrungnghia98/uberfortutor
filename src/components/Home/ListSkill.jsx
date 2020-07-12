import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { TagSkill } from '../../apis';

class ListSkill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skills: []
    }
  }

  reload = async () => {
    try {
      const response = await TagSkill.getList();
      this.setState({
        skills: response.slice(0, 6)
      })
      console.log('data', response)

    } catch (error) {
      console.log({ error });
      let message = 'Some thing wrong!';
      if (error.response && error.response.data && error.response.data.message) message = error.response.data.message;
      TagSkill.alert.error(message);
    }
  }
  componentDidMount() {
    this.reload();
  }

  renderCategories = () => {
    const { skills } = this.state;
    console.log('renderCategories', skills)
    return (
      <div className="d-flex flex-wrap justify-content-start">
        {
          skills.map(({ avatar, _id, content }) => {
            return (
              <Link className=" category-item mb-3" key={_id}
                to={`/cat/${content}/${_id}`} >
                <img src={avatar} alt={content} onError={(image) => {
                  image.target.src = "/images/category.png";
                }} />
                <div>{content}</div>
              </Link>
            );
          })
        }
      </div>
    );
  }

  render() {
    return (
      <div className="home--card">
        <div className="home--card__header">
          <div className="home--card__title">
            Môn học
                  </div>
          <Link to="/cat" className="btn see-more">
            Xem thêm &gt;
                  </Link>
        </div>
        {this.renderCategories()}
      </div>
    );
  }
}

export default ListSkill;