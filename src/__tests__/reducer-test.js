import listInitialState from '../listInitialState'
import reducer from '../reducer'

import {
  registerList,
  destroyList,
  loadList,
  loadListSuccess,
  loadListError,
} from '../actions'

test('should work with empty state', () => {
  expect(reducer(undefined, {
    type: 'CUSTOM_ACTION',
  })).toEqual({})
})

test('should register empty list', () => {
  expect(reducer({}, registerList(1, {}))).toEqual({
    1: listInitialState,
  })
})

test('should register two lists', () => {
  const firstState = reducer({}, registerList(1, {}))

  expect(reducer(firstState, registerList(2))).toEqual({
    1: listInitialState,
    2: listInitialState,
  })
})

test('should set loading state', () => {
  const firstState = reducer({}, registerList(1, {}))
  const secondState = reducer(firstState, loadList(1))

  expect(secondState[1].loading).toEqual(true)
})
