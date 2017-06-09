import 'babel-polyfill'
import 'url-search-params-polyfill'
import 'whatwg-fetch'

import {parseSearchParams} from 'url-search-utils'

import './mockApi'

import React from 'react'
import {render} from 'react-dom'

import {Provider} from 'react-redux'

import store from './store'
import List from './List'

const {
  sort,
  ...parsedSearch
} = parseSearchParams({
  page: 'number',
  perPage: 'number',
  hideYellow: (value) => !!value,
  hideRed: (value) => !!value,
  hideBlue: (value) => !!value,
})

render(
  <Provider store={ store }>
    <List
      sort={{
        param: sort ?
          (
            sort[0] === '-' ?
              sort.substring(1, sort.length) :
              sort
          ):
          'id',
        asc: !!sort && sort[0] !== '-'
      }}
      appliedFilters={{
        ...parsedSearch,
        page: parsedSearch.page || 1,
        perPage: parsedSearch.perPage || 10,
      }}
    />
  </Provider>,
  document.getElementById('app'),
)
