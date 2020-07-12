import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { formatChatDate } from '../../utils/pipe';
import { Conversation } from '../../apis';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import socket from '../../utils/socket';

const ListMessages = (props) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loadingMessage, setLoadingMessage] = useState(false);
  const { user, conversation } = props;
  const { _id: conversationID, userOne: _userOne, userTwo: _userTwo } = conversation;
  let other;
  if (conversationID) {
    other = user.email !== _userOne.email ? _userOne : _userTwo;
  }
  const [selectedConversation, setSelectedConversation] = useState();
  const limit = 6;
  let scroll = useRef();

  async function loadMessages() {
    await loadMessage(conversationID, true);
    setTimeout(() => {
      scrollToBottom()
    })
  }

  useEffect(() => {
    if (!conversationID) return;

    loadMessages()
    console.log('other',user, other)

    socket.emit('join', {
      me: user.email,
      other: other.email
    });

    socket.on('users-changed', (data) => {
      console.log("on-join", data)
    });
  }, [conversationID])

  useEffect(()=>{
    if(!socket) return;
    
    socket.on('new-message', (data) => {
      renderNewMessage(data);
    });
    
    return () => socket.off('new-message');
  }, [selectedConversation])


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 10 * 1000)

    return () => clearInterval(interval);
  })

  function scrollToBottom() {
    if (scroll && scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight - scroll.current.clientHeight;
  }

  async function loadMessage(conversationID, loadNew = false) {
    try {
      setLoadingMessage(true);

      const response = await Conversation.getListMessages({
        id: conversationID,
        page: loadNew ? 1 : (selectedConversation ? selectedConversation.nextPage : 1),
        limit
      });
      if (!selectedConversation || loadNew) {
        setSelectedConversation(response);
      } else {
        let isEnd = false;
        if (response.messages.length < limit) {
          isEnd = true;
        } 
          const newMessages = response.messages.concat(selectedConversation.messages);
          setSelectedConversation({ ...selectedConversation, messages: newMessages, isEnd, nextPage: response.nextPage })
        
      }
      setLoadingMessage(false);

    } catch (error) {
      console.log('err', error);
      setLoadingMessage(false);
      Conversation.alertError(error);
    }
  }

  async function onScroll(event) {
    if (scroll.current.scrollTop === 0 && !loadingMessage) {
      console.log("LOADMORE MESSAGE")
      if (!selectedConversation.isEnd) {
        await loadMessage(conversationID);
        if (scroll) scroll.current.scrollTop = 60;
      }

    }
  }

  function renderNewMessage(data) {
    console.log('renderNewMessage', data)
    setSelectedConversation({ ...selectedConversation, messages: selectedConversation.messages.concat(data) });
    setCurrentTime(new Date())
    setTimeout(() => {
      scrollToBottom()
    })
  }

  async function sendMessage(event, id, userId) {
    event.preventDefault();
    event.persist();

    try {
      const message = event.target.content.value;
      const response = await Conversation.sendMessage({
        id,
        message
      })

      const data = {
        _id: shortid.generate(),
        createAt: new Date(),
        content: message,
        sendBy: userId
      }
      socket.emit("add-message", data);
      event.target.content.value = "";

    } catch (error) {
      console.log(error, error)
      Conversation.alertError(error);
    }
  }

  function renderMessagesList(_messages, userOne, userTwo) {

    if (!_messages || _messages.length === 0) return null;
    return _messages.map(({ _id, content, sendBy, createAt }) => {
      const from = sendBy === userOne._id ? userOne : userTwo;
      return (
        <div key={_id} >
          <div className="contact">
            <span className="image-container">
              <figure className="profile-image">
                <img src={from.avatar}
                  onError={(image) => {
                    image.target.src = "/images/avatar.png";
                  }} alt="avatar" />
                <figcaption className="font-accent">M</figcaption>
              </figure>
              {/* <span className={`online-indicator ${from.isOnline?'online':''}`}>
                <i />
              </span> */}
            </span>

            <div className="user-info">
              <div className="username-container">
                <strong>{from.username}</strong>
              </div>
              <div className="message-body">
                {content}
              </div>
            </div>
            <aside>
              <div className="time">
                {formatChatDate(createAt, currentTime)}
              </div>
            </aside>
          </div>
        </div>
      )
    })
  }

  if (!selectedConversation)
    return (
      <div className="empty-state no-conversations">
        <strong className="font-accent">Nothing to See Here yet</strong><small>Your conversations will appear here.</small>
      </div>
    )


  const { userOne, userTwo, messages: _messages } = selectedConversation;
  const _user = user.email !== userOne.email ? userOne : userTwo;
  return (
    <div className="conversation">
      <header>
        <div className="upper-row">
          <div className="user-info">
            <h1><span className={`online-indicator ${_user.isOnline?'online':''}`}><i></i></span>
              {_user.username}
            </h1>
          </div>
        </div>

        <small>
          <span>Last seen<time>8h ago</time></span>
          <span>Local time<time >Dec 11, 10:40 PM</time></span>
        </small>

      </header>
      <div className="conversation-panels">
        <div className="message-flow">
          <div className="content at-top" onScroll={onScroll} ref={scroll}>
            {
              loadingMessage && <div className="spinner-wrapper mt-5" >
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            }
            {renderMessagesList(_messages, userOne, userTwo)}
          </div>
          <form className="send-message" onSubmit={e => sendMessage(e, _user._id, user._id)}>
            <div className='seach-box'>
              <div className='search-input'>
                <input
                  className='custom-input-text'
                  name="content"
                  type='text'
                  placeholder='Gửi tin nhắn'
                />
              </div>
            </div>
            <button className="btn btn-send">Send</button>
          </form>
        </div>
        <aside className="details-pane">
          <section className="about">
            <header><h2>About</h2></header>
            <div className="summary">
              <Link to={`/${_user.role ? 'teacher' : 'student'}/${_user._id}`} className="profile-image-link no-style-link">
                <figure className="profile-image">
                  <img src={_user.avatar}
                    onError={(image) => {
                      image.target.src = "/images/avatar.png";
                    }} alt="avatar" />
                  <figcaption className="font-accent">M</figcaption>
                </figure></Link>
              <Link to={`/${_user.role ? 'teacher' : 'student'}/${_user._id}`} className="username no-style-link">{_user.username}</Link>
              <div><span className="user-level">{_user.job || null}</span></div>
            </div>
          </section>
        </aside>
      </div>

    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
}
export default connect(mapStateToProps)(ListMessages);