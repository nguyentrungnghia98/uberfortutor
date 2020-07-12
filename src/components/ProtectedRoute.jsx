import React from 'react';
import { Route } from 'react-router-dom';
import AccessDenied from './AccessDenied/AccessDenied';
import toast from "../utils/toast";

const ProtectedRoute = ({
  component: Component,
  isAuthenticated, triggerLogin, isLoading,
  ...rest
}) => {

  if (!isAuthenticated && !isLoading) {
    triggerLogin();
    toast.error('Vui lòng đăng nhập để truy cập.');
  }

  return (
    <Route
      {...rest}
      render={props => {

        if (isLoading) return (
          <div className="page-wrapper">
            <div className="spinner-wrapper">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>

          </div>

        )

        return isAuthenticated ? (
          <Component {...props} />
        ) : (
            <AccessDenied />
          );
      }}
    />
  );
};

export default ProtectedRoute;