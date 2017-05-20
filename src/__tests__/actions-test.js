import {
  REGISTER_LIST,
  DESTROY_LIST,

  LOAD_LIST,
  LOAD_LIST_SUCCESS,
  LOAD_LIST_ERROR,

  SET_FILTER_VALUE,
  APPLY_FILTER,
  SET_AND_APPLY_FILTER,
  RESET_FILTER,

  SET_FILTERS_VALUES,
  APPLY_FILTERS,
  SET_AND_APPLY_FILTERS,
  RESET_FILTERS,

  RESET_ALL_FILTERS,

  SET_SORTING,
} from '../actionsTypes'

import {
  registerList,
  destroyList,

  loadList,
  loadListSuccess,
  loadListError,

  setFilterValue,
  applyFilter,
  setAndApplyFilter,
  resetFilter,

  setFiltersValues,
  applyFilters,
  setAndApplyFilters,
  resetFilters,

  resetAllFilters,

  setSorting,
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

test('set and apply filter action is FSA', () => {
  expect(isFSA(setAndApplyFilter(1, 'testFilter', 'testValue'))).toBeTruthy()
})

test('should create set and apply filter action', () => {
  expect(setAndApplyFilter(1, 'testFilter', 'testValue'))
    .toEqual({
      type: SET_AND_APPLY_FILTER,
      payload: {
        listId: 1,
        filterName: 'testFilter',
        value: 'testValue',
      },
    })
})

test('should throw an exception in set and apply filter action if filterName is not defined', () => {
  expect(() => {
    setAndApplyFilter(1)
  })
    .toThrowError('Filter name is required')
})

test('reset filter action is FSA', () => {
  expect(isFSA(resetFilter(1, 'testFilter'))).toBeTruthy()
})

test('should create reset filter action', () => {
  expect(resetFilter(1, 'testFilter'))
    .toEqual({
      type: RESET_FILTER,
      payload: {
        listId: 1,
        filterName: 'testFilter',
      },
    })
})

test('should throw an exception in reset filter action if filterName is not defined', () => {
  expect(() => {
    resetFilter(1)
  })
    .toThrowError('Filter name is required')
})

test('set filters values action is FSA', () => {
  expect(isFSA(setFiltersValues(1, {
    filter1: 'value1',
    filter2: 'value2',
  }))).toBeTruthy()
})

test('should create set filters values action', () => {
  expect(setFiltersValues(1, {
    filter1: 'value1',
    filter2: 'value2',
  }))
    .toEqual({
      type: SET_FILTERS_VALUES,
      payload: {
        listId: 1,
        values: {
          filter1: 'value1',
          filter2: 'value2',
        },
      },
    })
})

test('should throw an exception in set filters values action if values is not defined', () => {
  expect(() => {
    setFiltersValues(1)
  })
    .toThrowError('Values is required')
})

test('apply filters values action is FSA', () => {
  expect(isFSA(applyFilters(1, ['filter1', 'filter2']))).toBeTruthy()
})

test('should create apply filters values action', () => {
  expect(applyFilters(1, ['filter1', 'filter2']))
    .toEqual({
      type: APPLY_FILTERS,
      payload: {
        listId: 1,
        filtersNames: ['filter1', 'filter2'],
      },
    })
})

test('should throw an exception in apply filters action if filters names is not defined', () => {
  expect(() => {
    applyFilters(1)
  })
    .toThrowError('Filters names is required')
})

test('should throw an exception in apply filters action if filters names is not an array', () => {
  expect(() => {
    applyFilters(1, 123)
  })
    .toThrowError('Filters names should be an array')
})

test('set and apply filters action is FSA', () => {
  expect(isFSA(setAndApplyFilters(1, {
    filter1: 'value1',
    filter2: 'value2',
  }))).toBeTruthy()
})

test('should create set and apply filters action', () => {
  expect(setAndApplyFilters(1, {
    filter1: 'value1',
    filter2: 'value2',
  }))
    .toEqual({
      type: SET_AND_APPLY_FILTERS,
      payload: {
        listId: 1,
        values: {
          filter1: 'value1',
          filter2: 'value2',
        },
      },
    })
})

test('should throw an exception in set and apply filters action if values is not defined', () => {
  expect(() => {
    setAndApplyFilters(1)
  })
    .toThrowError('Values is required')
})

test('reset filters action is FSA', () => {
  expect(isFSA(resetFilters(1, ['filter1', 'filter2']))).toBeTruthy()
})

test('should create reset filters action', () => {
  expect(resetFilters(1, ['filter1', 'filter2']))
    .toEqual({
      type: RESET_FILTERS,
      payload: {
        listId: 1,
        filtersNames: ['filter1', 'filter2'],
      },
    })
})

test('should throw an exception in reset filters action if filters names is not defined', () => {
  expect(() => {
    resetFilters(1)
  })
    .toThrowError('Filters names is required')
})

test('should throw an exception in reset filters action if filters names is not an array', () => {
  expect(() => {
    resetFilters(1, 123)
  })
    .toThrowError('Filters names should be an array')
})

test('reset all filters action is FSA', () => {
  expect(isFSA(resetAllFilters(1))).toBeTruthy()
})

test('should create reset all filters action', () => {
  expect(resetAllFilters(1))
    .toEqual({
      type: RESET_ALL_FILTERS,
      payload: {
        listId: 1,
      },
    })
})

test('setSorting action is FSA', () => {
  expect(isFSA(setSorting(1, 'id', true))).toBeTruthy()
})

test('should create setSorting action', () => {
  expect(setSorting(1, 'id', true))
    .toEqual({
      type: SET_SORTING,
      payload: {
        listId: 1,
        param: 'id',
        asc: true,
      },
    })
})

test('should throw an exception in setSorting action if param is not defined', () => {
  expect(() => {
    setSorting(1)
  })
    .toThrowError('Sorting param is required')
})
