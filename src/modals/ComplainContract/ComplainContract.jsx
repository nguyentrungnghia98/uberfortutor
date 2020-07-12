import React, { useState, useEffect } from "react";
import {Contract} from '../../apis';
import { connect } from 'react-redux';
import { closeModal } from './ComplainContractAction';
import './ComplainContract.scss';
import {
  Dialog,TextareaAutosize
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';

const ComplainContractModal = props => {
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

    try {
      setLoading(true);
      const message = event.target.content.value;
      const response = await Contract.update({
        id: props.id,
        status: 'processing_complaint',
        complaintContent:message
      })

      console.log('res',response)
      event.target.content.value = "";
      setLoading(false);
      closeModal();
      Contract.alert.success("Gửi thành công");

      if(props.onUpdateSuccess) props.onUpdateSuccess();
    } catch (error) {
      setLoading(false);
      Contract.alertError(error);
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
                      placeholder="Nhập nội dung khiếu nại..."
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
      <Dialog open={toggle} onClose={handleClose} className="modal-login compain-contract">

        <div className='card card-login'>
          <div className='popup-content-login'>
            <div className='main-message'>
              <h5>Khiếu nại hợp đồng</h5>
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
    toggle: state.complainContractModal.toggle,
    id: state.complainContractModal.id,
    onUpdateSuccess: state.complainContractModal.onUpdateSuccess,
  };
}; 


const _widthRouter = withRouter(ComplainContractModal);

export default connect(
  mapStateToProps, {
    closeModal    
  }
)(_widthRouter);
