import listInitialState from '../listInitialState';

import recountListStateBeforeRequest from '../recountListStateBeforeRequest';

test('should recount list state with change state action and clean items', () => {
  const state = recountListStateBeforeRequest({
    ...listInitialState,
    items: [1, 2, 3],

    requestId: 3,
  }, {
    filters: null,
    appliedFilters: null,
    sort: null,
  });

  expect(state.shouldClean).toBe(true);
  expect(state.loading).toBe(true);
  expect(state.error).toBe(null);
  expect(state.requestId).toBe(4);
  expect(state.items).toEqual([]);
});

test('should recount list state with change state action and not clean items', () => {
  const state = recountListStateBeforeRequest({
    ...listInitialState,
    items: [1, 2, 3],

    requestId: 3,

    saveItemsWhileLoad: true,
  }, {
    filters: null,
    appliedFilters: null,
    sort: null,
  });

  expect(state.shouldClean).toBe(true);
  expect(state.loading).toBe(true);
  expect(state.error).toBe(null);
  expect(state.requestId).toBe(4);
  expect(state.items).toEqual([1, 2, 3]);
});

test('should recount list state with load more action and not clean items', () => {
  const state = recountListStateBeforeRequest({
    ...listInitialState,
    items: [1, 2, 3],

    requestId: 3,
  }, null);

  expect(state.shouldClean).toBe(false);
  expect(state.loading).toBe(true);
  expect(state.error).toBe(null);
  expect(state.requestId).toBe(4);
  expect(state.items).toEqual([1, 2, 3]);
});

test('should not change filters, appliedFilters and sort with load more action', () => {
  const state = recountListStateBeforeRequest({
    ...listInitialState,
    items: [1, 2, 3],

    filters: {
      testFilter: 'testValue1',
    },

    appliedFilters: {
      testFilter: 'testValue2',
    },

    sort: {
      param: 'testParam',
      asc: true,
    },

    requestId: 3,
  }, null);

  expect(state.filters).toEqual({
    testFilter: 'testValue1',
  });
  expect(state.appliedFilters).toEqual({
    testFilter: 'testValue2',
  });
  expect(state.sort).toEqual({
    param: 'testParam',
    asc: true,
  });
});

test('should set new filters with change state action', () => {
  const state = recountListStateBeforeRequest({
    ...listInitialState,
    items: [1, 2, 3],

    filters: {
      testFilter: 'testValue1',
    },

    appliedFilters: {
      testFilter: 'testValue2',
    },

    sort: {
      param: 'testParam',
      asc: true,
    },

    requestId: 3,
  }, {
    filters: {
      testFilter: 'testValue3',
    },

    appliedFilters: null,
    sort: null,
  });

  expect(state.filters).toEqual({
    testFilter: 'testValue3',
  });
  expect(state.appliedFilters).toEqual({
    testFilter: 'testValue2',
  });
  expect(state.sort).toEqual({
    param: 'testParam',
    asc: true,
  });
});

test('should set new appliedFilters with change state action', () => {
  const state = recountListStateBeforeRequest({
    ...listInitialState,
    items: [1, 2, 3],

    filters: {
      testFilter: 'testValue1',
    },

    appliedFilters: {
      testFilter: 'testValue2',
    },

    sort: {
      param: 'testParam',
      asc: true,
    },

    requestId: 3,
  }, {
    filters: null,

    appliedFilters: {
      testFilter: 'testValue3',
    },

    sort: null,
  });

  expect(state.filters).toEqual({
    testFilter: 'testValue1',
  });
  expect(state.appliedFilters).toEqual({
    testFilter: 'testValue3',
  });
  expect(state.sort).toEqual({
    param: 'testParam',
    asc: true,
  });
});

test('should set new sort with change state action', () => {
  const state = recountListStateBeforeRequest({
    ...listInitialState,
    items: [1, 2, 3],

    filters: {
      testFilter: 'testValue1',
    },

    appliedFilters: {
      testFilter: 'testValue2',
    },

    sort: {
      param: 'testParam',
      asc: true,
    },

    requestId: 3,
  }, {
    filters: null,
    appliedFilters: null,

    sort: {
      param: 'testParam2',
      asc: false,
    },
  });

  expect(state.filters).toEqual({
    testFilter: 'testValue1',
  });
  expect(state.appliedFilters).toEqual({
    testFilter: 'testValue2',
  });
  expect(state.sort).toEqual({
    param: 'testParam2',
    asc: false,
  });
});
