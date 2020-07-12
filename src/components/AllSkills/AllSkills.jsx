import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { TagSkill } from '../../apis';
import './AllSkills.scss';
class ListSkill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skills: [],
      loading: true
    }
  }

  reload = async () => {
    try {
      this.setState({loading: true})
      const response = await TagSkill.getList();
      this.setState({
        skills: response
      })
      this.setState({loading: false})
    } catch (error) {
      this.setState({loading: false})
      TagSkill.alert.error(error);
    }
  }
  componentDidMount() {
    this.reload();
  }

  renderCategories = () => {
    const { skills } = this.state;
    console.log('renderCategories', skills)
    return (
      <div className="row">
        {
          skills.map(({ avatar, _id, content }) => {
            return (
              <Link className="no-style-link mb-3 col-6 col-sm-4 col-md-3" key={_id}
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
    const {loading} = this.state;
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

    return (
      <div className="page-wrapper">
        <div className="skills-container ">
          <h4 className="ml-3">Danh sách kĩ năng</h4>
          <div className="skills-box bg-white container">
          {this.renderCategories()}
          </div>
        </div>        
      </div>
    );
  }
}

export default ListSkill;