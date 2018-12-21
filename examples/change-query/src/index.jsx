import 'url-search-params-polyfill';
import 'whatwg-fetch';

import { BrowserRouter, Route } from 'react-router-dom';

import './mockApi';

import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';

import store from './store';
import List from './List';

render(
  <Provider store={store}>
    <BrowserRouter>
      <Route component={List} />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app'),
);
