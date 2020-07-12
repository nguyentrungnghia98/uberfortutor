import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { formatChatDate } from '../../utils/pipe';
import SelectOption from '../shared/SelectOption/SelectOption';
import { Conversation } from '../../apis';
import ListMessage from './ListMessage';
import './Messages.scss';

const arrOption = [
  { text: 'Tất cả tin nhắn', code: 'all' },
  { text: 'Tin nhắn chưa đọc', code: 'unread' },
  { text: 'Tin nhắn mới nhất', code: 'newest' },
  { text: 'Tin nhắn cũ nhất', code: 'oldest' },
]


const Messages = (props) => {
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(arrOption[0])
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date())
  const [conversations, setConversations] = useState([])
  const { user } = props;

  

  useEffect(() => {
    const data = {}
    switch (selectedOption.code) {
      case 'unread':
        data.condition = { readNewestMessage: false }; break;
      case 'newest':
        data.sort = { field:"haveNewMessageAt", type : -1 }; break;
      case 'oldest':
        data.sort = { field:"haveNewMessageAt", type : 1 }; break;
      default:
        break;
    }

    async function loadConversations() {
      try {
        setLoading(true);

        const response = await Conversation.getListConversation({
          page: 1,
          limit: 50,
          ...data
        });
        const conversations = response.docs;
        setConversations(conversations);
        if (conversations && conversations.length > 0) {
          //setSelectedConversation(conversations[0]);
        }

        setLoading(false);
      } catch (error) {
        console.log('err', error);
        setLoading(false);

        Conversation.alertError(error);
      }
    }
    loadConversations();
    console.log('change', selectedOption)
  }, [selectedOption])

  function setOption(i) {
    setSelectedOption(arrOption[i]);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 10 * 1000)

    return () => clearInterval(interval);
  })


  function selectConversation(id) {
    console.log('id', id)
    const conversation = conversations.find(({ _id }) => id === _id);
    if (conversation) setSelectedConversation(conversation);
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


  function renderContactList() {
    if (conversations.length === 0) return null;
    return (
      <nav className="contacts-list">
        {conversations.map(({ _id, userOne, userTwo, newestMessage, haveNewMessageAt, readNewestMessage }) => {
          const _user = user.email !== userOne.email ? userOne : userTwo;
          return (
            <a key={_id} href="script:0" onClick={selectConversation.bind(this, _id)} className={`contact ${(selectedConversation && selectedConversation._id === _id) ? 'active-contact' : ''} no-style-link`}>
              <span className="image-container">
                <figure className="profile-image">
                  <img src={_user.avatar}
                    onError={(image) => {
                      image.target.src = "/images/avatar.png";
                    }} alt="avatar" />
                  <figcaption className="font-accent">M</figcaption>
                </figure>
                <span className={`online-indicator ${_user.isOnline?'online':''}`}>
                  <i />
                </span>
              </span>

              <div className="user-info">
                <div className="username-container">
                  <strong>{_user.username}</strong>
                </div>
                <p className="text-trunc">
                  {newestMessage}
                </p>
              </div>
              <aside>
                <div className="time">
                  {formatChatDate(haveNewMessageAt, currentTime)}                 
                </div>
                {!readNewestMessage && <span className="unread-count">
                  <i className="far fa-envelope"/>
                </span>}
                
              </aside>
            </a>
          )
        })}
      </nav>
    )
  }

  return (
    <div className="page-wrapper messages">
      <div className="messages-container">
        <article className="index">
          <div className="route index-route">
            <aside className="contacts-container">
              <header>
                <div className="search-bar">
                  {!openSearch ? (
                    <>
                      <SelectOption setOption={setOption} selectedOption={selectedOption} arrOption={arrOption} />
                      <button onClick={() => setOpenSearch(true)} className="button-link search-toggle"><i className="fa fa-search" aria-hidden="true"></i></button>
                    </>
                  ) : (
                      <>
                        <div className='seach-box'>
                          <div className='search-input'>
                            <input
                              className='custom-input-text'
                              type='text'
                              placeholder='Tìm kiếm theo tên...'
                            />
                          </div>
                        </div>
                        <button onClick={() => setOpenSearch(false)} className="button-link search-toggle search-close">Close</button>
                      </>
                    )}

                </div>
              </header>
              {renderContactList()}
            </aside>

            <ListMessage conversation={selectedConversation} />


          </div>
        </article>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
}
export default connect(mapStateToProps)(Messages);