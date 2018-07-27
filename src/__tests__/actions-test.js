import { isFSA } from 'flux-standard-action';

import {
  REGISTER_LIST,
  DESTROY_LIST,

  CHANGE_LIST_STATE,

  LOAD_LIST_SUCCESS,
  LOAD_LIST_ERROR,

  INSERT_ITEM,
  DELETE_ITEM,
  UPDATE_ITEM,
} from '../actionsTypes';

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

import listInitialState from '../listInitialState';
import collectListInitialState from '../collectListInitialState';

test('register list action is FSA', () => {
  expect(isFSA(registerList(1, {}, {}))).toBeTruthy();
});

test('should create register list action', () => {
  expect(registerList(1, {
    appliedFilters: {},
  }, {}))
    .toEqual({
      type: REGISTER_LIST,
      payload: {
        listId: 1,
        listInitialState: collectListInitialState({
          appliedFilters: {},
        }, {}),
      },
    });
});

test('should set default params in register list action', () => {
  expect(registerList(1, {}, {}))
    .toEqual({
      type: REGISTER_LIST,
      payload: {
        listId: 1,
        listInitialState: collectListInitialState({}, {}),
      },
    });
});

test('destroy list action is FSA', () => {
  expect(isFSA(destroyList(1))).toBeTruthy();
});

test('should create destroy list action', () => {
  expect(destroyList(1))
    .toEqual({
      type: DESTROY_LIST,
      payload: {
        listId: 1,
      },
    });
});

test('changeListState action is FSA', () => {
  expect(isFSA(changeListState(1, listInitialState, 'testAction'))).toBeTruthy();
});

test('should create changeListState action', () => {
  expect(changeListState(1, listInitialState, 'testAction'))
    .toEqual({
      type: CHANGE_LIST_STATE,

      payload: {
        listId: 1,
        nextListState: listInitialState,
      },

      meta: {
        actionType: 'testAction',
      },
    });
});

test('should throw an exception in load list success action without response', () => {
  expect(() => {
    loadListSuccess(1);
  })
    .toThrowError('Response is required');
});

test('should throw an exception in load list success action without response items', () => {
  expect(() => {
    loadListSuccess(1, {
      additional: {
        count: 3,
      },
    }, 5);
  })
    .toThrowError('Response items is required');
});

test('should throw an exception in load list success action if response items is not array', () => {
  expect(() => {
    loadListSuccess(1, {
      items: 12,
    }, 5);
  })
    .toThrowError('Response items should be array');
});

test('load list success action is FSA', () => {
  expect(isFSA(loadListSuccess(1, {
    items: [1, 2, 3],
  }, 5))).toBeTruthy();
});

test('should create load list success action', () => {
  expect(loadListSuccess(1, {
    items: [1, 2, 3],
    additional: {
      count: 3,
    },
  }, 5))
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
        requestId: 5,
      },
    });
});

test('load list error action is FSA', () => {
  expect(isFSA(loadListError(1, {
    error: 'Error message',
    additional: {
      count: 0,
    },
  }, 5))).toBeTruthy();
});

test('should create load list error action', () => {
  expect(loadListError(1, {
    error: 'Error message',
    additional: {
      count: 0,
    },
  }, 5))
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
        requestId: 5,
      },
    });
});

test('insertItem action is FSA', () => {
  expect(isFSA(insertItem(1, 5, {
    id: 12,
    name: 'test',
  }, {
    count: 10,
  }))).toBeTruthy();
});

test('should create insertItem action', () => {
  expect(insertItem(1, 5, {
    id: 12,
    name: 'test',
  }, {
    count: 10,
  }))
    .toEqual({
      type: INSERT_ITEM,
      payload: {
        listId: 1,
        itemIndex: 5,
        item: {
          id: 12,
          name: 'test',
        },
        additional: {
          count: 10,
        },
      },
    });
});

test('deleteItem action is FSA', () => {
  expect(isFSA(deleteItem(1, 5, {
    count: 10,
  }))).toBeTruthy();
});

test('should create deleteItem action', () => {
  expect(deleteItem(1, 5, {
    count: 10,
  }))
    .toEqual({
      type: DELETE_ITEM,
      payload: {
        listId: 1,
        itemIndex: 5,
        additional: {
          count: 10,
        },
      },
    });
});

test('updateItem action is FSA', () => {
  expect(isFSA(updateItem(1, 5, {
    id: 12,
    name: 'test',
  }, {
    count: 10,
  }))).toBeTruthy();
});

test('should create updateItem action', () => {
  expect(updateItem(1, 5, {
    id: 12,
    name: 'test',
  }, {
    count: 10,
  }))
    .toEqual({
      type: UPDATE_ITEM,
      payload: {
        listId: 1,
        itemIndex: 5,
        item: {
          id: 12,
          name: 'test',
        },
        additional: {
          count: 10,
        },
      },
    });
});
