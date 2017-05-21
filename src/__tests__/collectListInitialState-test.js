import collectListInitialState from '../collectListInitialState'
import listInitialState from '../listInitialState'

test('should return listInitialState', () => {
  expect(collectListInitialState({})).toEqual(listInitialState)
})

test('should set initial sort', () => {
  const state = collectListInitialState({
    sort: {
      param: 'param',
      asc: false,
    },
  })

  expect(state.sort).toEqual({
    param: 'param',
    asc: false,
  })
})

test('should set initial filters', () => {
  const filters = {
    filter1: 'value1',
    filter2: 'value2',
    filter3: ['value3', 'value4'],
  }

  const state = collectListInitialState({
    appliedFilters: filters,
  })

  expect(state.filters).toEqual(filters)
  expect(state.appliedFilters).toEqual(filters)
})

test('should set filters for resetting', () => {
  const alwaysResetFilters = {
    filter1: 'value1',
    filter2: 'value2',
  }

  const state = collectListInitialState({
    alwaysResetFilters,
  })

  expect(state.alwaysResetFilters).toEqual(alwaysResetFilters)
})

test('should set catchRejects', () => {
  const state = collectListInitialState({
    catchRejects: true,
  })

  expect(state.catchRejects).toEqual(true)
})

test('should set isDefaultSortAsc true', () => {
  const state = collectListInitialState({
    isDefaultSortAsc: true,
  })

  expect(state.isDefaultSortAsc).toEqual(true)
})

test('should set isDefaultSortAsc false', () => {
  const state = collectListInitialState({
    isDefaultSortAsc: true,
  })

  expect(state.isDefaultSortAsc).toEqual(true)
})

test('should no set isDefaultSortAsc (true by default)', () => {
  const state = collectListInitialState({
  })

  expect(state.isDefaultSortAsc).toEqual(true)
})

test('should set saveFiltersOnResetAll', () => {
  const state = collectListInitialState({
    saveFiltersOnResetAll: ['filter1', 'filter2'],
  })

  expect(state.saveFiltersOnResetAll).toEqual(['filter1', 'filter2'])
})
