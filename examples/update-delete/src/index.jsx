import 'babel-polyfill';
import 'whatwg-fetch';

import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';

import './mockApi';

import store from './store';
import List from './List';

render(
  <Provider store={store}>
    <List />
  </Provider>,
  document.getElementById('app'),
);
