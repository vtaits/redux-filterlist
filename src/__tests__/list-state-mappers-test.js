import listInitialState from '../listInitialState';

import {
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
  resetSorting,
} from '../list-state-mappers';

const defaultState = {
  ...listInitialState,

  alwaysResetFilters: {
    filterForReset: 'initialValue',
  },

  filters: {
    filterForReset: 'filterValue',
  },

  appliedFilters: {
    filterForReset: 'appliedFilterValue',
  },
};

test('should set filter value', () => {
  const mapperResult = setFilterValue({
    ...defaultState,

    filters: {
      ...defaultState.filters,
      testFilter1: 'testValue1',
      testFilter2: 'testValue2',
    },
  }, 'testFilter2', 'testValue3');

  expect(mapperResult.filters).toEqual({
    filterForReset: 'filterValue',
    testFilter1: 'testValue1',
    testFilter2: 'testValue3',
  });
  expect(mapperResult.appliedFilters).toEqual(null);
  expect(mapperResult.sort).toEqual(null);
});

test('should apply filter with setted value', () => {
  const mapperResult = applyFilter({
    ...defaultState,

    filters: {
      ...defaultState.filters,
      testFilter1: 'testValue1',
      testFilter2: 'testValue2',
    },

    appliedFilters: {
      ...defaultState.appliedFilters,
      testFilter1: 'testValue3',
      testFilter2: 'testValue4',
    },
  }, 'testFilter2');

  expect(mapperResult.filters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue1',
    testFilter2: 'testValue2',
  });
  expect(mapperResult.appliedFilters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue3',
    testFilter2: 'testValue2',
  });
  expect(mapperResult.sort).toEqual(null);
});

test('should set and apply filter', () => {
  const mapperResult = setAndApplyFilter({
    ...defaultState,

    filters: {
      ...defaultState.filters,
      testFilter1: 'testValue1',
      testFilter2: 'testValue2',
    },

    appliedFilters: {
      ...defaultState.appliedFilters,
      testFilter1: 'testValue3',
      testFilter2: 'testValue4',
    },
  }, 'testFilter2', 'testValue5');

  expect(mapperResult.filters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue1',
    testFilter2: 'testValue5',
  });
  expect(mapperResult.appliedFilters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue3',
    testFilter2: 'testValue5',
  });
  expect(mapperResult.sort).toEqual(null);
});

test('should reset filter', () => {
  const mapperResult = resetFilter({
    ...defaultState,

    initialFilters: {
      testFilter2: 'testValue5',
    },

    filters: {
      ...defaultState.filters,
      testFilter1: 'testValue1',
      testFilter2: 'testValue2',
    },

    appliedFilters: {
      ...defaultState.appliedFilters,
      testFilter1: 'testValue3',
      testFilter2: 'testValue4',
    },
  }, 'testFilter2');

  expect(mapperResult.filters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue1',
    testFilter2: 'testValue5',
  });
  expect(mapperResult.appliedFilters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue3',
    testFilter2: 'testValue5',
  });
  expect(mapperResult.sort).toEqual(null);
});

test('should set multiple filters values', () => {
  const mapperResult = setFiltersValues({
    ...defaultState,

    filters: {
      ...defaultState.filters,
      testFilter1: 'testValue1',
      testFilter2: 'testValue2',
    },
  }, {
    testFilter2: 'testValue3',
    testFilter3: 'testValue4',
  });

  expect(mapperResult.filters).toEqual({
    filterForReset: 'filterValue',
    testFilter1: 'testValue1',
    testFilter2: 'testValue3',
    testFilter3: 'testValue4',
  });
  expect(mapperResult.appliedFilters).toEqual(null);
  expect(mapperResult.sort).toEqual(null);
});

test('should apply multiple filters with stored values', () => {
  const mapperResult = applyFilters({
    ...defaultState,

    filters: {
      ...defaultState.filters,
      testFilter1: 'testValue1',
      testFilter2: 'testValue2',
      testFilter3: 'testValue5',
    },

    appliedFilters: {
      ...defaultState.appliedFilters,
      testFilter1: 'testValue3',
      testFilter2: 'testValue4',
      testFilter3: 'testValue6',
    },
  }, ['testFilter2', 'testFilter3']);

  expect(mapperResult.filters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue1',
    testFilter2: 'testValue2',
    testFilter3: 'testValue5',
  });
  expect(mapperResult.appliedFilters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue3',
    testFilter2: 'testValue2',
    testFilter3: 'testValue5',
  });
  expect(mapperResult.sort).toEqual(null);
});

test('should set and apply multiple filters', () => {
  const mapperResult = setAndApplyFilters({
    ...defaultState,

    filters: {
      ...defaultState.filters,
      testFilter1: 'testValue1',
      testFilter2: 'testValue2',
      testFilter3: 'testValue5',
    },

    appliedFilters: {
      ...defaultState.appliedFilters,
      testFilter1: 'testValue3',
      testFilter2: 'testValue4',
      testFilter3: 'testValue6',
    },
  }, {
    testFilter2: 'testValue7',
    testFilter3: 'testValue8',
  });

  expect(mapperResult.filters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue1',
    testFilter2: 'testValue7',
    testFilter3: 'testValue8',
  });
  expect(mapperResult.appliedFilters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue3',
    testFilter2: 'testValue7',
    testFilter3: 'testValue8',
  });
  expect(mapperResult.sort).toEqual(null);
});

test('should reset multiple filters', () => {
  const mapperResult = resetFilters({
    ...defaultState,

    initialFilters: {
      testFilter2: 'testValue7',
      testFilter3: 'testValue8',
    },

    filters: {
      ...defaultState.filters,
      testFilter1: 'testValue1',
      testFilter2: 'testValue2',
      testFilter3: 'testValue5',
    },

    appliedFilters: {
      ...defaultState.appliedFilters,
      testFilter1: 'testValue3',
      testFilter2: 'testValue4',
      testFilter3: 'testValue6',
    },
  }, ['testFilter2', 'testFilter3']);

  expect(mapperResult.filters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue1',
    testFilter2: 'testValue7',
    testFilter3: 'testValue8',
  });
  expect(mapperResult.appliedFilters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue3',
    testFilter2: 'testValue7',
    testFilter3: 'testValue8',
  });
  expect(mapperResult.sort).toEqual(null);
});

test('should reset all filters', () => {
  const mapperResult = resetAllFilters({
    ...defaultState,

    saveFiltersOnResetAll: ['testFilter2', 'testFilter3'],

    initialFilters: {
      testFilter3: 'testValue9',
      testFilter4: 'testValue10',
    },

    filters: {
      ...defaultState.filters,
      testFilter1: 'testValue1',
      testFilter2: 'testValue2',
      testFilter3: 'testValue5',
      testFilter4: 'testValue7',
    },

    appliedFilters: {
      ...defaultState.appliedFilters,
      testFilter1: 'testValue3',
      testFilter2: 'testValue4',
      testFilter3: 'testValue6',
      testFilter4: 'testValue8',
    },
  });

  expect(mapperResult.filters).toEqual({
    filterForReset: 'initialValue',
    testFilter2: 'testValue2',
    testFilter3: 'testValue5',
    testFilter4: 'testValue10',
  });
  expect(mapperResult.appliedFilters).toEqual({
    filterForReset: 'initialValue',
    testFilter2: 'testValue4',
    testFilter3: 'testValue6',
    testFilter4: 'testValue10',
  });
  expect(mapperResult.sort).toEqual(null);
});

test('should set sorting with asc is isDefaultSortAsc (false)', () => {
  const mapperResult = setSorting({
    ...defaultState,

    filters: {
      ...defaultState.filters,
      testFilter1: 'testValue1',
    },

    appliedFilters: {
      ...defaultState.appliedFilters,
      testFilter1: 'testValue3',
    },

    isDefaultSortAsc: false,
  }, 'sortParam');

  expect(mapperResult.filters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue1',
  });
  expect(mapperResult.appliedFilters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue3',
  });
  expect(mapperResult.sort).toEqual({
    param: 'sortParam',
    asc: false,
  });
});

test('should set sorting with asc is isDefaultSortAsc (true)', () => {
  const mapperResult = setSorting({
    ...defaultState,

    filters: {
      ...defaultState.filters,
      testFilter1: 'testValue1',
    },

    appliedFilters: {
      ...defaultState.appliedFilters,
      testFilter1: 'testValue3',
    },

    isDefaultSortAsc: true,
  }, 'sortParam');

  expect(mapperResult.filters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue1',
  });
  expect(mapperResult.appliedFilters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue3',
  });
  expect(mapperResult.sort).toEqual({
    param: 'sortParam',
    asc: true,
  });
});

test('should set change sort asc', () => {
  const mapperResult = setSorting({
    ...defaultState,

    filters: {
      ...defaultState.filters,
      testFilter1: 'testValue1',
    },

    appliedFilters: {
      ...defaultState.appliedFilters,
      testFilter1: 'testValue3',
    },

    isDefaultSortAsc: false,

    sort: {
      param: 'sortParam',
      asc: false,
    },
  }, 'sortParam');

  expect(mapperResult.filters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue1',
  });
  expect(mapperResult.appliedFilters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue3',
  });
  expect(mapperResult.sort).toEqual({
    param: 'sortParam',
    asc: true,
  });
});

test('should set sorting with asc from payload', () => {
  const mapperResult = setSorting({
    ...defaultState,

    filters: {
      ...defaultState.filters,
      testFilter1: 'testValue1',
    },

    appliedFilters: {
      ...defaultState.appliedFilters,
      testFilter1: 'testValue3',
    },

    isDefaultSortAsc: false,

    sort: {
      param: 'sortParam',
      asc: false,
    },
  }, 'sortParam', false);

  expect(mapperResult.filters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue1',
  });
  expect(mapperResult.appliedFilters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue3',
  });
  expect(mapperResult.sort).toEqual({
    param: 'sortParam',
    asc: false,
  });
});

test('should reset sorting with asc is isDefaultSortAsc (true)', () => {
  const mapperResult = resetSorting({
    ...defaultState,

    filters: {
      ...defaultState.filters,
      testFilter1: 'testValue1',
    },

    appliedFilters: {
      ...defaultState.appliedFilters,
      testFilter1: 'testValue3',
    },

    isDefaultSortAsc: true,

    sort: {
      param: 'sortParam',
      asc: false,
    },
  });

  expect(mapperResult.filters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue1',
  });
  expect(mapperResult.appliedFilters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue3',
  });
  expect(mapperResult.sort).toEqual({
    param: null,
    asc: true,
  });
});

test('should reset sorting with asc is isDefaultSortAsc (false)', () => {
  const mapperResult = resetSorting({
    ...defaultState,

    filters: {
      ...defaultState.filters,
      testFilter1: 'testValue1',
    },

    appliedFilters: {
      ...defaultState.appliedFilters,
      testFilter1: 'testValue3',
    },

    isDefaultSortAsc: false,

    sort: {
      param: 'sortParam',
      asc: false,
    },
  });

  expect(mapperResult.filters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue1',
  });
  expect(mapperResult.appliedFilters).toEqual({
    filterForReset: 'initialValue',
    testFilter1: 'testValue3',
  });
  expect(mapperResult.sort).toEqual({
    param: null,
    asc: false,
  });
});
