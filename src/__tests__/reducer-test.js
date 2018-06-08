import listInitialState from '../listInitialState';
import collectListInitialState from '../collectListInitialState';
import _reducer from '../reducer';

import {
  registerList,
  destroyList,

  changeListState,

  loadList,
  loadListSuccess,
  loadListError,

  setStateFromProps,

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

  insertItem,
  deleteItem,
  updateItem,
} from '../actions';

const reducersForTest = [{
  reducer: _reducer,
  title: 'default reducer',
}, {
  reducer: _reducer.plugin({
    test: state => state,
  }),
  title: 'reducer with plugin',
}];

const resetListActions = [
  {
    fn: setStateFromProps.bind(null, 1, {
      filter: 'value',
    }, {
      param: 'test',
      asc: true,
    }),
    name: 'setStateFromProps',
  },
  {
    fn: applyFilter.bind(null, 1, 'param'),
    name: 'applyFilter',
  },
  {
    fn: setAndApplyFilter.bind(null, 1, 'param', 'value'),
    name: 'setAndApplyFilter',
  },
  {
    fn: resetFilter.bind(null, 1, 'param'),
    name: 'resetFilter',
  },
  {
    fn: applyFilters.bind(null, 1, []),
    name: 'applyFilters',
  },
  {
    fn: setAndApplyFilters.bind(null, 1, {}),
    name: 'setAndApplyFilters',
  },
  {
    fn: resetFilters.bind(null, 1, []),
    name: 'resetFilters',
  },
  {
    fn: resetAllFilters.bind(null, 1),
    name: 'resetAllFilters',
  },
  {
    fn: setSorting.bind(null, 1, 'param'),
    name: 'setSorting',
  },
  {
    fn: resetSorting.bind(null, 1),
    name: 'resetSorting',
  },
];

reducersForTest.forEach(({
  reducer,
  title,
}) => {
  describe(title, () => {
    resetListActions.forEach(({
      fn,
      name,
    }) => {
      test(`should reset list state with action "${name}" and clean items`, () => {
        let state = reducer({}, registerList(1, {
          alwaysResetFilters: {
            page: 1,
          },
          appliedFilters: {
            page: 2,
            filter: 'value',
          },
        }, {}));
        state = reducer(state, loadList(1));
        state = reducer(state, loadListSuccess(1, {
          items: [{
            label: 1,
            value: 1,
          }, {
            label: 2,
            value: 2,
          }],
          additional: {
            count: 2,
          },
        }, 1));
        state = reducer(state, fn());

        expect(state[1].appliedFilters.page).toEqual(1);
        expect(state[1].shouldClean).toEqual(true);
        expect(state[1].loading).toEqual(true);
        expect(state[1].error).toEqual(null);
        expect(state[1].items).toEqual([]);
      });

      test(`should reset list state with action "${name}" and not clean items`, () => {
        let state = reducer({}, registerList(1, {
          alwaysResetFilters: {
            page: 1,
          },
          appliedFilters: {
            page: 2,
            filter: 'value',
          },
          saveItemsWhileLoad: true,
        }, {}));
        state = reducer(state, loadList(1));
        state = reducer(state, loadListSuccess(1, {
          items: [{
            label: 1,
            value: 1,
          }, {
            label: 2,
            value: 2,
          }],
          additional: {
            count: 2,
          },
        }, 1));
        state = reducer(state, fn());

        expect(state[1].appliedFilters.page).toEqual(1);
        expect(state[1].shouldClean).toEqual(true);
        expect(state[1].loading).toEqual(true);
        expect(state[1].error).toEqual(null);
        expect(state[1].items).toEqual([{
          label: 1,
          value: 1,
        }, {
          label: 2,
          value: 2,
        }]);

        state = reducer(state, loadListSuccess(1, {
          items: [{
            label: 3,
            value: 3,
          }, {
            label: 4,
            value: 4,
          }],
          additional: {
            count: 2,
          },
        }, 2));

        expect(state[1].shouldClean).toEqual(false);
        expect(state[1].loading).toEqual(false);
        expect(state[1].error).toEqual(null);
        expect(state[1].items).toEqual([{
          label: 3,
          value: 3,
        }, {
          label: 4,
          value: 4,
        }]);
      });
    });

    test('should work with empty state', () => {
      expect(reducer(undefined, {
        type: 'CUSTOM_ACTION',
      })).toEqual({});
    });

    test('should register empty list', () => {
      expect(reducer({}, registerList(1, {}, {}))).toEqual({
        1: listInitialState,
      });
    });

    test('should register two lists', () => {
      const state = reducer({}, registerList(1, {}, {}));

      expect(reducer(state, registerList(2, {}, {}))).toEqual({
        1: listInitialState,
        2: listInitialState,
      });
    });

    test('should return prev state if list with id is already registered', () => {
      let state = reducer({}, registerList(1, {}, {}));
      state = reducer(state, loadList(1));
      const state2 = reducer(state, registerList(1, {}, {}));

      expect(state2).toEqual(state);
    });

    test('should destroy list', () => {
      let state = reducer({}, registerList(1, {}, {}));
      state = reducer(state, registerList(2, {}, {}));

      state = reducer(state, destroyList(1));

      expect(state).toEqual({
        2: listInitialState,
      });
    });


    test('should set list initial state such as collectListInitialState', () => {
      const params = {
        sort: {
          param: 'param',
          asc: false,
        },
        alwaysResetFilters: {
          page: 1,
        },
        appliedFilters: {
          filter1: 'value1',
          filter2: 'value2',
          filter3: ['value3', 'value4'],
        },
      };

      const state = reducer({}, registerList(1, params, {}));

      expect(state[1]).toEqual(collectListInitialState(params));
    });

    test('should change list state', () => {
      const nextListState = {
        ...listInitialState,

        sort: {
          param: 'param',
          asc: false,
        },

        alwaysResetFilters: {
          page: 1,
        },

        appliedFilters: {
          filter1: 'value1',
          filter2: 'value2',
          filter3: ['value3', 'value4'],
        },
      };

      let state = reducer({}, registerList(1, {}, {}));
      state = reducer(state, changeListState(1, nextListState, 'testAction'));

      expect(state[1]).toBe(nextListState);
    });

    test('should set loading state with loadList', () => {
      let state = reducer({}, registerList(1, {}, {}));
      state = reducer(state, loadList(1));

      expect(state[1].loading).toEqual(true);
      expect(state[1].shouldClean).toEqual(false);
    });

    test('should reset loading and shouldClean with loadListSuccess action', () => {
      let state = reducer({}, registerList(1, {}, {}));
      state = reducer(state, resetAllFilters(1));

      expect(state[1].loading).toEqual(true);
      expect(state[1].shouldClean).toEqual(true);

      state = reducer(state, loadListSuccess(1, {
        items: [],
        additional: {},
      }, 1));

      expect(state[1].loading).toEqual(false);
      expect(state[1].shouldClean).toEqual(false);
    });

    test('should not reset loading and shouldClean with loadListSuccess action if request id is differs from list state request id', () => {
      let state = reducer({}, registerList(1, {}, {}));
      state = reducer(state, resetAllFilters(1));

      expect(state[1].loading).toEqual(true);
      expect(state[1].shouldClean).toEqual(true);

      state = reducer(state, loadListSuccess(1, {
        items: [],
        additional: {},
      }, 2));

      expect(state[1].loading).toEqual(true);
      expect(state[1].shouldClean).toEqual(true);
    });

    test('should reset loading and shouldClean with loadListError action', () => {
      let state = reducer({}, registerList(1, {}, {}));
      state = reducer(state, resetAllFilters(1));

      expect(state[1].loading).toEqual(true);
      expect(state[1].shouldClean).toEqual(true);

      state = reducer(state, loadListError(1, {
        additional: {},
      }, 1));

      expect(state[1].loading).toEqual(false);
      expect(state[1].shouldClean).toEqual(false);
    });

    test('should load items and set additional if defined', () => {
      let state = reducer({}, registerList(1, {}, {}));
      state = reducer(state, loadList(1));
      state = reducer(state, loadListSuccess(1, {
        items: [{
          label: 1,
          value: 1,
        }, {
          label: 2,
          value: 2,
        }],
        additional: {
          count: 2,
        },
      }, 1));

      expect(state[1].loading).toEqual(false);
      expect(state[1].items).toEqual([{
        label: 1,
        value: 1,
      }, {
        label: 2,
        value: 2,
      }]);
      expect(state[1].additional).toEqual({
        count: 2,
      });

      state = reducer(state, loadList(1));
      state = reducer(state, loadListSuccess(1, {
        items: [{
          label: 3,
          value: 3,
        }, {
          label: 4,
          value: 4,
        }],
      }, 2));

      expect(state[1].items).toEqual([{
        label: 1,
        value: 1,
      }, {
        label: 2,
        value: 2,
      }, {
        label: 3,
        value: 3,
      }, {
        label: 4,
        value: 4,
      }]);
      expect(state[1].additional).toEqual({
        count: 2,
      });

      state = reducer(state, loadList(1));
      state = reducer(state, loadListSuccess(1, {
        items: [{
          label: 5,
          value: 5,
        }, {
          label: 6,
          value: 6,
        }],
        additional: null,
      }, 3));

      expect(state[1].items).toEqual([{
        label: 1,
        value: 1,
      }, {
        label: 2,
        value: 2,
      }, {
        label: 3,
        value: 3,
      }, {
        label: 4,
        value: 4,
      }, {
        label: 5,
        value: 5,
      }, {
        label: 6,
        value: 6,
      }]);
      expect(state[1].additional).toEqual(null);
    });

    test('should load items with save on load', () => {
      let state = reducer({}, registerList(1, {
        saveItemsWhileLoad: true,
      }, {}));
      state = reducer(state, loadList(1));
      state = reducer(state, loadListSuccess(1, {
        items: [{
          label: 1,
          value: 1,
        }, {
          label: 2,
          value: 2,
        }],
        additional: {
          count: 2,
        },
      }, 1));

      state = reducer(state, loadList(1));
      state = reducer(state, loadListSuccess(1, {
        items: [{
          label: 3,
          value: 3,
        }, {
          label: 4,
          value: 4,
        }, {
          label: 5,
          value: 5,
        }],
        additional: {
          count: 3,
        },
      }, 2));

      expect(state[1].loading).toEqual(false);
      expect(state[1].items).toEqual([{
        label: 1,
        value: 1,
      }, {
        label: 2,
        value: 2,
      }, {
        label: 3,
        value: 3,
      }, {
        label: 4,
        value: 4,
      }, {
        label: 5,
        value: 5,
      }]);
      expect(state[1].additional).toEqual({
        count: 3,
      });
    });

    test('should set current list loading to false on load error', () => {
      let state = reducer({}, registerList(1, {}, {}));
      state = reducer(state, registerList(2, {}, {}));

      state = reducer(state, loadList(1));
      state = reducer(state, loadList(2));

      state = reducer(state, loadListError(1, null, 1));

      expect(state[1].loading).toEqual(false);
      expect(state[2].loading).toEqual(true);
    });

    test('should set list loading error and not change additional', () => {
      let state = reducer({}, registerList(1, {}, {}));

      state = reducer(state, loadList(1));
      state = reducer(state, loadListError(1, {
        error: 'Error',
      }, 1));

      expect(state[1].error).toEqual('Error');
      expect(state[1].additional).toEqual(null);
    });

    test('should not set load error if request id is differs from list state request id', () => {
      let state = reducer({}, registerList(1, {}, {}));

      state = reducer(state, loadList(1));
      state = reducer(state, loadListError(1, {
        error: 'Error',
      }, 2));

      expect(state[1].loading).toEqual(true);
      expect(state[1].error).toEqual(null);
      expect(state[1].additional).toEqual(null);
    });

    test('should set list additional on load error', () => {
      let state = reducer({}, registerList(1, {}, {}));

      state = reducer(state, loadList(1));
      state = reducer(state, loadListError(1, {
        error: 'Error',
        additional: {
          error: true,
        },
      }, 1));

      expect(state[1].additional).toEqual({
        error: true,
      });
    });

    test('should reset list loading error', () => {
      let state = reducer({}, registerList(1, {}, {}));

      state = reducer(state, loadList(1));
      state = reducer(state, loadListError(1, {
        error: 'Error',
      }, 1));

      state = reducer(state, loadList(1));

      expect(state[1].error).toEqual(null);
    });

    test('should set applied filters and sort with setStateFromProps', () => {
      let state = reducer({}, registerList(1, {
        appliedFilters: {
          filter: 'value',
        },

        sort: {
          param: 'test',
          asc: true,
        },
      }, {}));

      state = reducer(state, setStateFromProps(1, {
        filter: 'value2',
      }, {
        param: 'test2',
        asc: false,
      }));

      expect(state[1].filters).toEqual({
        filter: 'value2',
      });
      expect(state[1].appliedFilters).toEqual({
        filter: 'value2',
      });
      expect(state[1].sort).toEqual({
        param: 'test2',
        asc: false,
      });
    });

    test('should set only applied filters with setStateFromProps', () => {
      let state = reducer({}, registerList(1, {
        appliedFilters: {
          filter: 'value',
        },

        sort: {
          param: 'test',
          asc: true,
        },
      }, {}));

      state = reducer(state, setStateFromProps(1, {
        filter: 'value2',
      }, null));

      expect(state[1].filters).toEqual({
        filter: 'value2',
      });
      expect(state[1].appliedFilters).toEqual({
        filter: 'value2',
      });
      expect(state[1].sort).toEqual({
        param: 'test',
        asc: true,
      });
    });

    test('should set only sort with setStateFromProps', () => {
      let state = reducer({}, registerList(1, {
        appliedFilters: {
          filter: 'value',
        },

        sort: {
          param: 'test',
          asc: true,
        },
      }, {}));

      state = reducer(state, setStateFromProps(1, null, {
        param: 'test2',
        asc: false,
      }));

      expect(state[1].filters).toEqual({
        filter: 'value',
      });
      expect(state[1].appliedFilters).toEqual({
        filter: 'value',
      });
      expect(state[1].sort).toEqual({
        param: 'test2',
        asc: false,
      });
    });

    test('should set filter value', () => {
      let state = reducer({}, registerList(1, {
        appliedFilters: {
          filter: 'value',
        },
      }, {}));

      state = reducer(state, setFilterValue(1, 'testFilter', 'testValue'));

      expect(state[1].filters.filter).toEqual('value');
      expect(state[1].filters.testFilter).toEqual('testValue');
    });

    test('should apply filter with setted value', () => {
      let state = reducer({}, registerList(1, {
        alwaysResetFilters: {
          page: 1,
          testFilter: 'testResetted',
        },
        appliedFilters: {
          page: 2,
          filter: 'value',
        },
      }, {}));

      state = reducer(state, setFilterValue(1, 'testFilter', 'testValue'));
      state = reducer(state, applyFilter(1, 'testFilter'));

      expect(state[1].appliedFilters.page).toEqual(1);
      expect(state[1].appliedFilters.filter).toEqual('value');
      expect(state[1].appliedFilters.testFilter).toEqual('testValue');
      expect(state[1].loading).toEqual(true);
      expect(state[1].error).toEqual(null);
      expect(state[1].items).toEqual([]);
    });

    test('should set and apply filter', () => {
      let state = reducer({}, registerList(1, {
        alwaysResetFilters: {
          page: 1,
          testFilter: 'testResetted',
        },
        appliedFilters: {
          page: 2,
          filter: 'value',
        },
      }, {}));

      state = reducer(state, setAndApplyFilter(1, 'testFilter', 'testValue'));

      expect(state[1].appliedFilters.page).toEqual(1);
      expect(state[1].filters.filter).toEqual('value');
      expect(state[1].appliedFilters.filter).toEqual('value');
      expect(state[1].filters.testFilter).toEqual('testValue');
      expect(state[1].appliedFilters.testFilter).toEqual('testValue');
      expect(state[1].loading).toEqual(true);
      expect(state[1].error).toEqual(null);
      expect(state[1].items).toEqual([]);
    });

    test('should reset filter', () => {
      let state = reducer({}, registerList(1, {
        alwaysResetFilters: {
          page: 1,
          testFilter: 'testResetted',
        },
        initialFilters: {
          testFilter: 'initialValue',
        },
        appliedFilters: {
          page: 2,
          filter: 'value',
          testFilter: 'testValue',
        },
      }, {}));

      state = reducer(state, resetFilter(1, 'testFilter'));

      expect(state[1].appliedFilters.page).toEqual(1);
      expect(state[1].filters.filter).toEqual('value');
      expect(state[1].appliedFilters.filter).toEqual('value');
      expect(state[1].filters.testFilter).toEqual('initialValue');
      expect(state[1].appliedFilters.testFilter).toEqual('initialValue');
      expect(state[1].loading).toEqual(true);
      expect(state[1].error).toEqual(null);
      expect(state[1].items).toEqual([]);
    });

    test('should set multiple filters values', () => {
      let state = reducer({}, registerList(1, {
        appliedFilters: {
          filter1: 'value1',
          filter2: 'value2',
        },
      }, {}));

      state = reducer(state, setFiltersValues(1, {
        filter2: 'value2_changed',
        filter3: 'value3',
      }));

      expect(state[1].filters.filter1).toEqual('value1');
      expect(state[1].filters.filter2).toEqual('value2_changed');
      expect(state[1].filters.filter3).toEqual('value3');
    });

    test('should apply multiple filters with stored values', () => {
      let state = reducer({}, registerList(1, {
        alwaysResetFilters: {
          page: 1,
        },
        appliedFilters: {
          page: 2,
          filter1: 'value1',
          filter2: 'value2',
        },
      }, {}));

      state = reducer(state, setFiltersValues(1, {
        filter1: 'value1_changed',
        filter2: 'value2_changed',
        filter3: 'value3',
      }));

      state = reducer(state, applyFilters(1, [
        'filter2',
        'filter3',
      ]));

      expect(state[1].appliedFilters.page).toEqual(1);
      expect(state[1].filters.filter1).toEqual('value1_changed');
      expect(state[1].filters.filter2).toEqual('value2_changed');
      expect(state[1].filters.filter3).toEqual('value3');
      expect(state[1].appliedFilters.filter1).toEqual('value1');
      expect(state[1].appliedFilters.filter2).toEqual('value2_changed');
      expect(state[1].appliedFilters.filter3).toEqual('value3');
      expect(state[1].loading).toEqual(true);
      expect(state[1].error).toEqual(null);
      expect(state[1].items).toEqual([]);
    });

    test('should set and apply multiple filters', () => {
      let state = reducer({}, registerList(1, {
        alwaysResetFilters: {
          page: 1,
        },
        appliedFilters: {
          page: 2,
          filter1: 'value1',
          filter2: 'value2',
        },
      }, {}));

      state = reducer(state, setAndApplyFilters(1, {
        filter2: 'value2_changed',
        filter3: 'value3',
      }));

      expect(state[1].appliedFilters.page).toEqual(1);
      expect(state[1].filters.filter1).toEqual('value1');
      expect(state[1].filters.filter2).toEqual('value2_changed');
      expect(state[1].filters.filter3).toEqual('value3');
      expect(state[1].appliedFilters.filter1).toEqual('value1');
      expect(state[1].appliedFilters.filter2).toEqual('value2_changed');
      expect(state[1].appliedFilters.filter3).toEqual('value3');
      expect(state[1].loading).toEqual(true);
      expect(state[1].error).toEqual(null);
      expect(state[1].items).toEqual([]);
    });

    test('should reset multiple filters', () => {
      let state = reducer({}, registerList(1, {
        alwaysResetFilters: {
          page: 1,
        },
        initialFilters: {
          filter1: 'initialValue1',
          filter2: 'initialValue2',
          filter3: 'initialValue3',
        },
        appliedFilters: {
          page: 2,
          filter1: 'value1',
          filter2: 'value2',
          filter3: 'value3',
        },
      }, {}));

      state = reducer(state, resetFilters(1, ['filter2', 'filter3']));

      expect(state[1].appliedFilters.page).toEqual(1);
      expect(state[1].filters.filter1).toEqual('value1');
      expect(state[1].filters.filter2).toEqual('initialValue2');
      expect(state[1].filters.filter3).toEqual('initialValue3');
      expect(state[1].appliedFilters.filter1).toEqual('value1');
      expect(state[1].appliedFilters.filter2).toEqual('initialValue2');
      expect(state[1].appliedFilters.filter3).toEqual('initialValue3');
      expect(state[1].loading).toEqual(true);
      expect(state[1].error).toEqual(null);
      expect(state[1].items).toEqual([]);
    });

    test('should reset all filters', () => {
      let state = reducer({}, registerList(1, {
        alwaysResetFilters: {
          page: 1,
          teseSaveFilter1: 10,
          teseSaveFilter2: 20,
        },
        initialFilters: {
          filter1: 'initialValue1',
          filter2: 'initialValue2',
        },
        appliedFilters: {
          teseSaveFilter1: 30,
          teseSaveFilter2: 40,
          page: 2,
          filter1: 'value1',
          filter2: 'value2',
          filter3: 'value3',
        },
        saveFiltersOnResetAll: ['teseSaveFilter1', 'teseSaveFilter2'],
      }, {}));

      state = reducer(state, resetAllFilters(1));

      expect(state[1].appliedFilters.page).toEqual(1);

      expect(state[1].filters.filter1).toEqual('initialValue1');
      expect(state[1].filters.filter2).toEqual('initialValue2');
      /* eslint-disable no-prototype-builtins */
      expect(state[1].filters.hasOwnProperty('filter3')).toEqual(false);
      /* eslint-enable no-prototype-builtins */

      expect(state[1].appliedFilters.filter1).toEqual('initialValue1');
      expect(state[1].appliedFilters.filter2).toEqual('initialValue2');
      /* eslint-disable no-prototype-builtins */
      expect(state[1].appliedFilters.hasOwnProperty('filter3')).toEqual(false);
      /* eslint-enable no-prototype-builtins */

      expect(state[1].appliedFilters.teseSaveFilter1).toEqual(30);
      expect(state[1].appliedFilters.teseSaveFilter2).toEqual(40);

      expect(state[1].loading).toEqual(true);
      expect(state[1].error).toEqual(null);
      expect(state[1].items).toEqual([]);
    });

    test('should set sorting with asc is isDefaultSortAsc (false)', () => {
      let state = reducer({}, registerList(1, {
        alwaysResetFilters: {
          page: 1,
        },
        appliedFilters: {
          page: 2,
        },
        isDefaultSortAsc: false,
      }, {}));

      state = reducer(state, setSorting(1, 'id'));

      expect(state[1].appliedFilters.page).toEqual(1);
      expect(state[1].sort.param).toEqual('id');
      expect(state[1].sort.asc).toEqual(false);
      expect(state[1].loading).toEqual(true);
      expect(state[1].error).toEqual(null);
      expect(state[1].items).toEqual([]);
    });

    test('should set sorting with asc is isDefaultSortAsc (true)', () => {
      let state = reducer({}, registerList(1, {
        alwaysResetFilters: {
          page: 1,
        },
        appliedFilters: {
          page: 2,
        },
        isDefaultSortAsc: true,
      }, {}));

      state = reducer(state, setSorting(1, 'id'));

      expect(state[1].appliedFilters.page).toEqual(1);
      expect(state[1].sort.param).toEqual('id');
      expect(state[1].sort.asc).toEqual(true);
      expect(state[1].loading).toEqual(true);
      expect(state[1].error).toEqual(null);
      expect(state[1].items).toEqual([]);
    });

    test('should set change sort asc', () => {
      let state = reducer({}, registerList(1, {
        alwaysResetFilters: {
          page: 1,
        },
        appliedFilters: {
          page: 2,
        },
        isDefaultSortAsc: false,
      }, {}));

      state = reducer(state, setSorting(1, 'id'));

      expect(state[1].sort.param).toEqual('id');
      expect(state[1].sort.asc).toEqual(false);

      state = reducer(state, setSorting(1, 'id'));

      expect(state[1].sort.asc).toEqual(true);
    });

    test('should set sorting with asc from payload', () => {
      let state = reducer({}, registerList(1, {
        alwaysResetFilters: {
          page: 1,
        },
        appliedFilters: {
          page: 2,
        },
        isDefaultSortAsc: false,
      }, {}));

      state = reducer(state, setSorting(1, 'id', true));

      expect(state[1].appliedFilters.page).toEqual(1);
      expect(state[1].sort.param).toEqual('id');
      expect(state[1].sort.asc).toEqual(true);
      expect(state[1].loading).toEqual(true);
      expect(state[1].error).toEqual(null);
      expect(state[1].items).toEqual([]);
    });

    test('should reset sorting with asc is isDefaultSortAsc (true)', () => {
      let state = reducer({}, registerList(1, {
        sort: {
          param: 'sortParam',
          asc: false,
        },
        alwaysResetFilters: {
          page: 1,
        },
        appliedFilters: {
          page: 2,
        },
        isDefaultSortAsc: true,
      }, {}));

      state = reducer(state, resetSorting(1));

      expect(state[1].appliedFilters.page).toEqual(1);
      expect(state[1].sort.param).toEqual(null);
      expect(state[1].sort.asc).toEqual(true);
      expect(state[1].loading).toEqual(true);
      expect(state[1].error).toEqual(null);
      expect(state[1].items).toEqual([]);
    });

    test('should reset sorting with asc is isDefaultSortAsc (false)', () => {
      let state = reducer({}, registerList(1, {
        sort: {
          param: 'sortParam',
          asc: false,
        },
        alwaysResetFilters: {
          page: 1,
        },
        appliedFilters: {
          page: 2,
        },
        isDefaultSortAsc: false,
      }, {}));

      state = reducer(state, resetSorting(1));

      expect(state[1].appliedFilters.page).toEqual(1);
      expect(state[1].sort.param).toEqual(null);
      expect(state[1].sort.asc).toEqual(false);
      expect(state[1].loading).toEqual(true);
      expect(state[1].error).toEqual(null);
      expect(state[1].items).toEqual([]);
    });
  });

  test('should insert item to list state and not change additional', () => {
    let state = reducer({}, registerList(1, {}, {}));
    state = reducer(state, loadList(1));
    state = reducer(state, loadListSuccess(1, {
      items: [{
        label: 1,
        value: 1,
      }, {
        label: 2,
        value: 2,
      }, {
        label: 3,
        value: 3,
      }, {
        label: 4,
        value: 4,
      }, {
        label: 5,
        value: 5,
      }],
      additional: {
        count: 5,
      },
    }, 1));

    state = reducer(state, insertItem(1, 2, {
      label: 6,
      value: 6,
    }));

    expect(state[1].items).toEqual([{
      label: 1,
      value: 1,
    }, {
      label: 2,
      value: 2,
    }, {
      label: 6,
      value: 6,
    }, {
      label: 3,
      value: 3,
    }, {
      label: 4,
      value: 4,
    }, {
      label: 5,
      value: 5,
    }]);

    expect(state[1].additional).toEqual({
      count: 5,
    });
  });

  test('should insert item to list state and change additional', () => {
    let state = reducer({}, registerList(1, {}, {}));
    state = reducer(state, loadList(1));
    state = reducer(state, loadListSuccess(1, {
      items: [{
        label: 1,
        value: 1,
      }, {
        label: 2,
        value: 2,
      }, {
        label: 3,
        value: 3,
      }, {
        label: 4,
        value: 4,
      }, {
        label: 5,
        value: 5,
      }],
      additional: {
        count: 5,
      },
    }, 1));

    state = reducer(state, insertItem(1, 2, {
      label: 6,
      value: 6,
    }, {
      count: 6,
    }));

    expect(state[1].items).toEqual([{
      label: 1,
      value: 1,
    }, {
      label: 2,
      value: 2,
    }, {
      label: 6,
      value: 6,
    }, {
      label: 3,
      value: 3,
    }, {
      label: 4,
      value: 4,
    }, {
      label: 5,
      value: 5,
    }]);

    expect(state[1].additional).toEqual({
      count: 6,
    });
  });

  test('should delete item from list state and not change additional', () => {
    let state = reducer({}, registerList(1, {}, {}));
    state = reducer(state, loadList(1));
    state = reducer(state, loadListSuccess(1, {
      items: [{
        label: 1,
        value: 1,
      }, {
        label: 2,
        value: 2,
      }, {
        label: 3,
        value: 3,
      }, {
        label: 4,
        value: 4,
      }, {
        label: 5,
        value: 5,
      }],
      additional: {
        count: 5,
      },
    }, 1));

    state = reducer(state, deleteItem(1, 2));

    expect(state[1].items).toEqual([{
      label: 1,
      value: 1,
    }, {
      label: 2,
      value: 2,
    }, {
      label: 4,
      value: 4,
    }, {
      label: 5,
      value: 5,
    }]);

    expect(state[1].additional).toEqual({
      count: 5,
    });
  });

  test('should delete item from list state and change additional', () => {
    let state = reducer({}, registerList(1, {}, {}));
    state = reducer(state, loadList(1));
    state = reducer(state, loadListSuccess(1, {
      items: [{
        label: 1,
        value: 1,
      }, {
        label: 2,
        value: 2,
      }, {
        label: 3,
        value: 3,
      }, {
        label: 4,
        value: 4,
      }, {
        label: 5,
        value: 5,
      }],
      additional: {
        count: 5,
      },
    }, 1));

    state = reducer(state, deleteItem(1, 2, {
      count: 4,
    }));

    expect(state[1].items).toEqual([{
      label: 1,
      value: 1,
    }, {
      label: 2,
      value: 2,
    }, {
      label: 4,
      value: 4,
    }, {
      label: 5,
      value: 5,
    }]);

    expect(state[1].additional).toEqual({
      count: 4,
    });
  });

  test('should update item and not change additional', () => {
    let state = reducer({}, registerList(1, {}, {}));
    state = reducer(state, loadList(1));
    state = reducer(state, loadListSuccess(1, {
      items: [{
        label: 1,
        value: 1,
      }, {
        label: 2,
        value: 2,
      }, {
        label: 3,
        value: 3,
      }, {
        label: 4,
        value: 4,
      }, {
        label: 5,
        value: 5,
      }],
      additional: {
        count: 5,
      },
    }, 1));

    state = reducer(state, updateItem(1, 2, {
      label: 10,
      value: 10,
    }));

    expect(state[1].items).toEqual([{
      label: 1,
      value: 1,
    }, {
      label: 2,
      value: 2,
    }, {
      label: 10,
      value: 10,
    }, {
      label: 4,
      value: 4,
    }, {
      label: 5,
      value: 5,
    }]);

    expect(state[1].additional).toEqual({
      count: 5,
    });
  });

  test('should update item and change additional', () => {
    let state = reducer({}, registerList(1, {}, {}));
    state = reducer(state, loadList(1));
    state = reducer(state, loadListSuccess(1, {
      items: [{
        label: 1,
        value: 1,
      }, {
        label: 2,
        value: 2,
      }, {
        label: 3,
        value: 3,
      }, {
        label: 4,
        value: 4,
      }, {
        label: 5,
        value: 5,
      }],
      additional: {
        count: 5,
      },
    }, 1));

    state = reducer(state, updateItem(1, 2, {
      label: 10,
      value: 10,
    }, {
      count: 4,
    }));

    expect(state[1].items).toEqual([{
      label: 1,
      value: 1,
    }, {
      label: 2,
      value: 2,
    }, {
      label: 10,
      value: 10,
    }, {
      label: 4,
      value: 4,
    }, {
      label: 5,
      value: 5,
    }]);

    expect(state[1].additional).toEqual({
      count: 4,
    });
  });
});

test('should throw an exception if reducer plugin is not an object', () => {
  expect(() => {
    _reducer.plugin(123);
  })
    .toThrowError('Reducer plugin should be an obeject');
});

test('should throw an exception if reducer plugin is null', () => {
  expect(() => {
    _reducer.plugin(null);
  })
    .toThrowError('Reducer plugin can\'t be null');
});

test('should apply plugin action', () => {
  const reducer = _reducer.plugin({
    2: (state, { type }) => {
      switch (type) {
        case 'TEST':
          return {
            ...state,
            items: [1, 2, 3, 4, 5],
          };

        default:
          return state;
      }
    },
  });

  let state = reducer({}, registerList(1, {}, {}));
  state = reducer(state, registerList(2, {}, {}));

  state = reducer(state, { type: 'TEST' });

  expect(state[1].items).toEqual([]);
  expect(state[2].items).toEqual([1, 2, 3, 4, 5]);
});
