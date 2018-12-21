import 'url-search-params-polyfill';
import 'whatwg-fetch';

import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';

import store from './store';
import List from './List';

import './mockApi';

render(
  <Provider store={store}>
    <List />
  </Provider>,
  document.getElementById('app'),
);
