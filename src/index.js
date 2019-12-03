import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import {Elements, StripeProvider} from 'react-stripe-elements';

ReactDOM.render(
    <Router>
<StripeProvider apiKey="pk_test_mc83QL9RmvS9wkshUJjFojYX00FlNSDclg">
  <Elements>
        <App />
  </Elements>
  </StripeProvider>
    </Router>,

    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
