import React, { useState, useEffect } from "react";
import {Conversation} from '../../apis';
import { connect } from 'react-redux';
import { closeModal } from './SendMessageAction';
import './SendMessage.scss';
import {
  Dialog,TextareaAutosize
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';

const SendMessageModal = props => {
  const {
    toggle,
    closeModal
  } = props;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [props.toggle])

  function handleClose() {
    closeModal();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    event.persist();
    const { match } = props;
    const { id } = match.params;
    try {
      setLoading(true);
      const message = event.target.content.value;
      const response = await Conversation.sendMessage({
        id,
        message
      })
      console.log('res',response)
      event.target.content.value = "";
      setLoading(false);
      closeModal();
      Conversation.alert.success("Gửi thành công");
    } catch (error) {
      setLoading(false);
      Conversation.alertError(error);
    }
  }

  function renderSendMessageForm() {
    return (
      <div className='popup-form'>
        <form autoComplete="off" onSubmit={handleSubmit}>

          <div className='form-row-buttons d-flex'>
          <TextareaAutosize
                      variant="outlined"
                      rows="6"                      
                      placeholder="Nhập nội dung tin nhắn..."
                      className='textarea-custom w-100'
                      name="content"
                      required
                    /> 
          </div>

          <div className='form-row-buttons mt-3 mb-4 text-right'>
            <button
              className='btn btn-primary'
              name='commit'
              type='submit'
              disabled={loading}
            >
              Gửi
            </button>
          </div>
        </form>

      </div>
    )
  }


  return (
    <div className='static-modal'>
      <Dialog open={toggle} onClose={handleClose} className="modal-login send-message-1">

        <div className='card card-login'>
          <div className='popup-content-login'>
            <div className='main-message'>
              <h5>Gửi tin nhắn</h5>
            </div>
            {renderSendMessageForm()}
          </div>
        </div>

      </Dialog>
    </div>
  );
};


const mapStateToProps = (state) => {
  return {
    toggle: state.sendMessageModal,
    user: state.auth.user,
  };
}; 


const _widthRouter = withRouter(SendMessageModal);

export default connect(
  mapStateToProps, {
    closeModal    
  }
)(_widthRouter);
