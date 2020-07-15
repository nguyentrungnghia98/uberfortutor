import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import reduxThunk from "redux-thunk";
import reducers from "./reducers/index";

const store = createStore(reducers, compose(applyMiddleware(reduxThunk)));

const AppWrapper = (props) => (
  <Provider store={store}>
    <App {...props} />
  </Provider>
);

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<AppWrapper />, div);
  ReactDOM.unmountComponentAtNode(div);
});
