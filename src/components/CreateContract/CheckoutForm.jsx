import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';

const createOptions = () => {
  return {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'Open Sans, sans-serif',
        letterSpacing: '0.025em',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#c23d4b',
      },
    }
  }
};

class CheckoutForm extends Component {
  state = {
    errorMessage: '',
  };
  constructor(props) {
    super(props);
    this.getToken = this.getToken.bind(this);
  }

  componentDidMount() {
    this.props.setFunction(this.getToken);
  }

  handleChange = ({error}) => {
    if (error) {
      this.setState({errorMessage: error.message});
    }else{
      this.setState({errorMessage: ''});
    }
  };

  async getToken(){
    if (this.props.stripe) {
      const res = await this.props.stripe.createToken();
      console.log('res',res)
      return res;
    } else {
      console.log("Stripe.js hasn't loaded yet.");
      return null;
    }
  };

  render() {
    return (
      <div className="checkout">
        <CardElement onChange={this.handleChange}  {...createOptions()}/>
        <div className="error" role="alert">
            {this.state.errorMessage}
          </div>
        {/* <button type="button" onClick={this.handleSubmit.bind(this)}>Purchase</button> */}
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);