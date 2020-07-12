import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { closeAlert } from '../../../actions/alert';
import { Dialog, DialogContent } from '@material-ui/core';
import './Alert.scss';

import AlertError from '../../../assets/images/alert-error.svg';
import AlertInfo from '../../../assets/images/alert-info.svg';
import AlertQuestion from '../../../assets/images/alert-question.svg';
import AlertSuccess from '../../../assets/images/alert-success.svg';
import AlertWarning from '../../../assets/images/alert-warning.svg';
const ALERT_ICON = {
  error: AlertError,
  info: AlertInfo,
  question: AlertQuestion,
  success: AlertSuccess,
  warning: AlertWarning
};

const Alert = (props) => {
  const { isOpen, data } = props;
  const { closeAlert } = props;
  const { type, title, subtitle, onYesFn } = data;
  let { okText, confirmText, cancelText } = data;

  if (!okText) {
    okText = 'OK';
  }

  if (!confirmText) {
    confirmText = 'Continute';
  }

  if (!cancelText) {
    cancelText = 'Cancel';
  }

  function close() {
    console.log('close');
    if (onYesFn) onYesFn(false);
    closeAlert();
  }
  function onYesClick() {
    console.log('onYesClick');
    if (onYesFn) onYesFn(true);
    closeAlert();
  }

  return (
    <Dialog open={isOpen} className="alert-dialog">
      <DialogContent className="alert--wrapper">
        <div className="alert--icon">
          <img alt="icon" src={ALERT_ICON[type || 'error']} />
        </div>
        <h2 className="alert--title">{title}</h2>
        <div className="alert--subtitle">{subtitle}</div>
        <div className="alert--button-group">
          {(type === 'error' || type === 'success' || type === 'info') && (
            <button className={'btn--ok ' + type} onClick={close}>
              {okText}
            </button>
          )}
          {(type === 'warning' || type === 'question') && (
            <Fragment>
              <button className={'btn--confirm ' + type} onClick={onYesClick}>
                {confirmText}
              </button>
              <button className="btn--cancel" onClick={close}>
                {cancelText}
              </button>
            </Fragment>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state) => {
  return {
    isOpen: state.alert.isOpen,
    data: state.alert.data
  };
};

export default connect(
  mapStateToProps,
  {
    closeAlert
  }
)(Alert);
