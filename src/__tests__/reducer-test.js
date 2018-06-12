import listInitialState from '../listInitialState';
import collectListInitialState from '../collectListInitialState';
import _reducer from '../reducer';

import {
  registerList,
  destroyList,

  changeListState,

  loadListSuccess,
  loadListError,

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

reducersForTest.forEach(({
  reducer,
  title,
}) => {
  describe(title, () => {
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
      const stateSymbol = Symbol('list state');

      let state = reducer({}, registerList(1, {}, {}));
      state = reducer(state, changeListState(1, stateSymbol, 'testAction'));
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
      const stateSymbol = Symbol('list state');

      let state = reducer({}, registerList(1, {}, {}));
      state = reducer(state, changeListState(1, stateSymbol, 'testAction'));

      expect(state[1]).toBe(stateSymbol);
    });

    test('should reset loading and shouldClean with loadListSuccess action', () => {
      let state = reducer({}, registerList(1, {}, {}));
      state = reducer(state, changeListState(1, {
        ...state[1],
        loading: true,
        shouldClean: true,
        requestId: 1,
      }, 'testAction'));

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
      state = reducer(state, changeListState(1, {
        ...state[1],
        loading: true,
        shouldClean: true,
        requestId: 1,
      }, 'testAction'));

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
      state = reducer(state, changeListState(1, {
        ...state[1],
        loading: true,
        shouldClean: true,
        requestId: 1,
      }, 'testAction'));

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
      state = reducer(state, changeListState(1, {
        ...state[1],
        loading: true,
        shouldClean: true,
        requestId: 1,
      }, 'testAction'));
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

      state = reducer(state, changeListState(1, {
        ...state[1],
        loading: true,
        shouldClean: true,
        requestId: 2,
      }, 'testAction'));
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

      state = reducer(state, changeListState(1, {
        ...state[1],
        loading: true,
        shouldClean: true,
        requestId: 3,
      }, 'testAction'));
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
      state = reducer(state, changeListState(1, {
        ...state[1],
        loading: true,
        shouldClean: false,
        requestId: 1,
      }, 'testAction'));
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

      state = reducer(state, changeListState(1, {
        ...state[1],
        loading: true,
        shouldClean: false,
        requestId: 2,
      }, 'testAction'));
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

      state = reducer(state, changeListState(1, {
        ...state[1],
        loading: true,
        shouldClean: true,
        requestId: 1,
      }, 'testAction'));
      state = reducer(state, changeListState(2, {
        ...state[2],
        loading: true,
        shouldClean: true,
        requestId: 1,
      }, 'testAction'));

      state = reducer(state, loadListError(1, null, 1));

      expect(state[1].loading).toEqual(false);
      expect(state[2].loading).toEqual(true);
    });

    test('should set list loading error and not change additional', () => {
      let state = reducer({}, registerList(1, {}, {}));

      state = reducer(state, changeListState(1, {
        ...state[1],
        loading: true,
        shouldClean: true,
        requestId: 1,
      }, 'testAction'));
      state = reducer(state, loadListError(1, {
        error: 'Error',
      }, 1));

      expect(state[1].error).toEqual('Error');
      expect(state[1].additional).toEqual(null);
    });

    test('should not set load error if request id is differs from list state request id', () => {
      let state = reducer({}, registerList(1, {}, {}));

      state = reducer(state, changeListState(1, {
        ...state[1],
        loading: true,
        shouldClean: true,
        requestId: 1,
      }, 'testAction'));
      state = reducer(state, loadListError(1, {
        error: 'Error',
      }, 2));

      expect(state[1].loading).toEqual(true);
      expect(state[1].error).toEqual(null);
      expect(state[1].additional).toEqual(null);
    });

    test('should set list additional on load error', () => {
      let state = reducer({}, registerList(1, {}, {}));

      state = reducer(state, changeListState(1, {
        ...state[1],
        loading: true,
        shouldClean: true,
        requestId: 1,
      }, 'testAction'));
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

    test('should insert item to list state and not change additional', () => {
      let state = reducer({}, registerList(1, {}, {}));
      state = reducer(state, changeListState(1, {
        ...state[1],
        loading: true,
        shouldClean: true,
        requestId: 1,
      }, 'testAction'));
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
      state = reducer(state, changeListState(1, {
        ...state[1],
        loading: true,
        shouldClean: true,
        requestId: 1,
      }, 'testAction'));
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
      state = reducer(state, changeListState(1, {
        ...state[1],
        loading: true,
        shouldClean: true,
        requestId: 1,
      }, 'testAction'));
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
      state = reducer(state, changeListState(1, {
        ...state[1],
        loading: true,
        shouldClean: true,
        requestId: 1,
      }, 'testAction'));
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
      state = reducer(state, changeListState(1, {
        ...state[1],
        loading: true,
        shouldClean: true,
        requestId: 1,
      }, 'testAction'));
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
      state = reducer(state, changeListState(1, {
        ...state[1],
        loading: true,
        shouldClean: true,
        requestId: 1,
      }, 'testAction'));
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
