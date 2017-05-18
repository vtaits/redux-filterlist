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