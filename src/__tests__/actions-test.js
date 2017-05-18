import {
  REGISTER_LIST,
  DESTROY_LIST,

  LOAD_LIST,
  LOAD_LIST_SUCCESS,
  LOAD_LIST_ERROR,

  SET_FILTER_VALUE,
  APPLY_FILTER,
} from '../actionsTypes'

import {
  registerList,
  destroyList,

  loadList,
  loadListSuccess,
  loadListError,

  setFilterValue,
  applyFilter,
} from '../actions'

import {isFSA} from 'flux-standard-action'

test('register list action is FSA', () => {
  expect(isFSA(registerList(1))).toBeTruthy()
})

test('should create register list action', () => {
  expect(registerList(1, {
    appliedFilters: {},
  }))
    .toEqual({
      type: REGISTER_LIST,
      payload: {
        listId: 1,
        params: {
          appliedFilters: {},
        },
      },
    })
})

test('should set default params in register list action', () => {
  expect(registerList(1))
    .toEqual({
      type: REGISTER_LIST,
      payload: {
        listId: 1,
        params: {},
      },
    })
})

test('destroy list action is FSA', () => {
  expect(isFSA(destroyList(1))).toBeTruthy()
})

test('should create destroy list action', () => {
  expect(destroyList(1))
    .toEqual({
      type: DESTROY_LIST,
      payload: {
        listId: 1,
      },
    })
})

test('load list action is FSA', () => {
  expect(isFSA(loadList(1))).toBeTruthy()
})

test('should create load list action', () => {
  expect(loadList(1))
    .toEqual({
      type: LOAD_LIST,
      payload: {
        listId: 1,
      },
    })
})

test('should throw an exception in load list success action without response', () => {
  expect(() => {
    loadListSuccess(1)
  })
    .toThrowError('Response is required')
})

test('should throw an exception in load list success action without response items', () => {
  expect(() => {
    loadListSuccess(1, {
      additional: {
        count: 3,
      },
    })
  })
    .toThrowError('Response items is required')
})

test('should throw an exception in load list success action if response items is not array', () => {
  expect(() => {
    loadListSuccess(1, {
      items: 12,
    })
  })
    .toThrowError('Response items should be array')
})

test('load list success action is FSA', () => {
  expect(isFSA(loadListSuccess(1, {
    items: [1, 2, 3]
  }))).toBeTruthy()
})

test('should create load list success action', () => {
  expect(loadListSuccess(1, {
    items: [1, 2, 3],
    additional: {
      count: 3,
    },
  }))
    .toEqual({
      type: LOAD_LIST_SUCCESS,
      payload: {
        listId: 1,
        response: {
          items: [1, 2, 3],
          additional: {
            count: 3,
          },
        },
      },
    })
})

test('load list error action is FSA', () => {
  expect(isFSA(loadListError(1, {
    error: 'Error message',
    additional: {
      count: 0,
    },
  }))).toBeTruthy()
})

test('should create load list error action', () => {
  expect(loadListError(1, {
    error: 'Error message',
    additional: {
      count: 0,
    },
  }))
    .toEqual({
      type: LOAD_LIST_ERROR,
      payload: {
        listId: 1,
        response: {
          error: 'Error message',
          additional: {
            count: 0,
          },
        },
      },
    })
})

test('set filter value action is FSA', () => {
  expect(isFSA(setFilterValue(1, 'testFilter', 'test'))).toBeTruthy()
})

test('should create set filter value action', () => {
  expect(setFilterValue(1, 'testFilter', 'test'))
    .toEqual({
      type: SET_FILTER_VALUE,
      payload: {
        listId: 1,
        filterName: 'testFilter',
        value: 'test',
      },
    })
})

test('should throw an exception in set filter value action if filterName is not defined', () => {
  expect(() => {
    setFilterValue(1)
  })
    .toThrowError('Filter name is required')
})

test('apply filter action is FSA', () => {
  expect(isFSA(applyFilter(1, 'testFilter'))).toBeTruthy()
})

test('should create apply filter action', () => {
  expect(applyFilter(1, 'testFilter'))
    .toEqual({
      type: APPLY_FILTER,
      payload: {
        listId: 1,
        filterName: 'testFilter',
      },
    })
})

test('should throw an exception in apply filter action if filterName is not defined', () => {
  expect(() => {
    applyFilter(1)
  })
    .toThrowError('Filter name is required')
})
