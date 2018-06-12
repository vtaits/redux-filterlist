import React from 'react';
import { shallow } from 'enzyme';
import checkPropTypes from 'check-prop-types';

import ReduxFilterlistWrapper from '../ReduxFilterlistWrapper';
import { RequestCanceledError, LoadListError } from '../errors';

import { filterlistPropTypes } from '../propTypes';

import listInitialState from '../listInitialState';
import recountListState from '../recountListState';

const WrappedComponent = () => (
  <div />
);

const listActions = {
  registerList: () => {},
  destroyList: () => {},

  changeListState: () => {},

  loadListSuccess: () => {},
  loadListError: () => {},

  insertItem: () => {},
  deleteItem: () => {},
  updateItem: () => {},
};

const listStateMappers = {
  setFilterValue: () => {},
  applyFilter: () => {},
  setAndApplyFilter: () => {},
  resetFilter: () => {},
  setFiltersValues: () => {},
  applyFilters: () => {},
  setAndApplyFilters: () => {},
  resetFilters: () => {},
  resetAllFilters: () => {},
  setSorting: () => {},
  resetSorting: () => {},
};

const defaultProps = {
  listId: 'test',

  loadItems: () => {},
  onBeforeRequest: null,

  listState: listInitialState,

  listActions,

  WrappedComponent,
  reduxFilterlistParams: {},

  componentProps: {},

  listStateMappers,
};

class ManualReduxFilterlistWrapper extends ReduxFilterlistWrapper {
  componentDidMount() {}
  componentDidUpdate() {}

  manualComponentDidMount() {
    return super.componentDidMount();
  }

  manualComponentDidUpdate(prevProps) {
    return super.componentDidUpdate(prevProps);
  }

  requestItems(actionType, mappedState) {
    if (this.props.requestItemsMock) {
      this.props.requestItemsMock(actionType, mappedState);
    }
  }

  manualRequestItems(actionType, mappedState) {
    return super.requestItems(actionType, mappedState);
  }
}

class PageObject {
  constructor(props) {
    this.wrapper = shallow(
      <ManualReduxFilterlistWrapper
        {...defaultProps}
        {...props}
      />,
    );

    this.WrappedComponent = props.WrappedComponent || defaultProps.WrappedComponent;
  }

  instance() {
    return this.wrapper.instance();
  }

  getWrappedComponent() {
    return this.wrapper.find(this.WrappedComponent);
  }

  unmount() {
    this.wrapper.unmount();
  }

  componentDidMount() {
    return this.wrapper.instance().manualComponentDidMount();
  }

  requestItems(actionType, mappedState) {
    return this.wrapper.instance().manualRequestItems(actionType, mappedState);
  }

  setProps(props) {
    return this.wrapper.setProps(props);
  }

  async setPropsAndUpdate(props) {
    const prevProps = this.wrapper.props();

    this.wrapper.setProps(props);

    await this.wrapper.instance().manualComponentDidUpdate(prevProps);
  }
}

function setup(props) {
  return new PageObject(props);
}

test('should render WrappedComponent without error', () => {
  const page = setup({});

  expect(page.getWrappedComponent().length).toBe(1);
});

test('should provide the correct props', () => {
  const page = setup({
    listId: 'testId',
    listState: listInitialState,
    componentProps: {
      customProp: 'customValue',
    },
  });

  const wrappedComponentNode = page.getWrappedComponent();

  expect(wrappedComponentNode.length).toBe(1);

  const props = wrappedComponentNode.props();

  expect(Object.keys(props).sort())
    .toEqual([
      'applyFilter',
      'applyFilters',
      'customProp',
      'deleteItem',
      'insertItem',
      'listId',
      'listState',
      'loadItems',
      'resetAllFilters',
      'resetFilter',
      'resetFilters',
      'resetSorting',
      'setAndApplyFilter',
      'setAndApplyFilters',
      'setFilterValue',
      'setFiltersValues',
      'setSorting',
      'updateItem',
    ]);

  expect(Object.keys(props.listState).sort())
    .toEqual([
      'additional',
      'alwaysResetFilters',
      'appliedFilters',
      'autoload',
      'error',
      'filters',
      'initialFilters',
      'isDefaultSortAsc',
      'items',
      'loading',
      'requestId',
      'saveFiltersOnResetAll',
      'saveItemsWhileLoad',
      'shouldClean',
      'sort',
    ]);

  expect(props.listId).toBe('testId');
  expect(props.listState).toBe(listInitialState);

  expect(typeof props.loadItems).toBe('function');
  expect(typeof props.setFilterValue).toBe('function');
  expect(typeof props.applyFilter).toBe('function');
  expect(typeof props.setAndApplyFilter).toBe('function');
  expect(typeof props.resetFilter).toBe('function');
  expect(typeof props.setFiltersValues).toBe('function');
  expect(typeof props.applyFilters).toBe('function');
  expect(typeof props.setAndApplyFilters).toBe('function');
  expect(typeof props.resetFilters).toBe('function');
  expect(typeof props.resetAllFilters).toBe('function');
  expect(typeof props.setSorting).toBe('function');
  expect(typeof props.resetSorting).toBe('function');
  expect(typeof props.insertItem).toBe('function');
  expect(typeof props.deleteItem).toBe('function');
  expect(typeof props.updateItem).toBe('function');

  expect(props.customProp).toBe('customValue');

  expect(checkPropTypes(filterlistPropTypes({}), props, 'prop', 'TestChildComponent'))
    .toBeFalsy();
});

test('should call registerList on init', () => {
  const registerList = jest.fn();

  const reduxFilterlistParams = {
    autoload: false,
    sort: {
      param: 'param',
      asc: false,
    },
    isDefaultSortAsc: false,
    alwaysResetFilters: {},
    additional: {},
    initialFilters: {},
    filters: {},
    appliedFilters: {},
    saveFiltersOnResetAll: ['perPage'],
    saveItemsWhileLoad: true,
  };

  setup({
    listId: 'testId',

    listActions: {
      ...listActions,
      registerList,
    },

    componentProps: {
      testProp: 'testValue',
    },

    reduxFilterlistParams,
  });

  expect(registerList.mock.calls.length).toBe(1);
  expect(registerList.mock.calls[0][0]).toBe('testId');
  expect(registerList.mock.calls[0][1]).toBe(reduxFilterlistParams);
  expect(registerList.mock.calls[0][2]).toEqual({
    testProp: 'testValue',
  });
});

test('should call destroyList on unmount', () => {
  const destroyList = jest.fn();

  const page = setup({
    listId: 'testId',

    listActions: {
      ...listActions,
      destroyList,
    },
  });

  expect(destroyList.mock.calls.length).toBe(0);

  page.unmount();

  expect(destroyList.mock.calls.length).toBe(1);
  expect(destroyList.mock.calls[0][0]).toBe('testId');
});

test('should change list state and not request items', async () => {
  const mappedState = {
    filters: {
      testFilter: 'testValue2',
    },

    appliedFilters: null,
    sort: null,
  };

  const responseSymbol = Symbol('response');

  const loadItems = jest.fn(() => responseSymbol);
  const changeListState = jest.fn();
  const loadListSuccess = jest.fn();
  const loadListError = jest.fn();

  const listState = {
    ...listInitialState,
    requestId: 4,
  };

  const nextListState = recountListState(listState, mappedState);

  const page = setup({
    listId: 'testId',

    loadItems,

    listState,

    listActions: {
      ...listActions,
      changeListState,
      loadListSuccess,
      loadListError,
    },

    componentProps: {
      testProperty: 'testValue',
    },
  });

  await page.requestItems('testAction', mappedState);

  expect(changeListState.mock.calls.length).toBe(1);
  expect(changeListState.mock.calls[0][0]).toBe('testId');
  expect(changeListState.mock.calls[0][1]).toEqual(nextListState);
  expect(changeListState.mock.calls[0][2]).toBe('testAction');

  expect(loadItems.mock.calls.length).toBe(0);
  expect(loadListSuccess.mock.calls.length).toBe(0);
  expect(loadListError.mock.calls.length).toBe(0);
});

test('should change list state and request items successfully', async () => {
  const mappedState = {
    filters: {
      testFilter: 'testValue2',
    },

    appliedFilters: {
      testFilter: 'testValue3',
    },

    sort: {
      param: 'testParam',
      asc: true,
    },
  };

  const responseSymbol = Symbol('response');

  const loadItems = jest.fn(() => responseSymbol);
  const changeListState = jest.fn();
  const loadListSuccess = jest.fn();
  const loadListError = jest.fn();

  const listState = {
    ...listInitialState,
    requestId: 4,
  };

  const nextListState = recountListState(listState, mappedState);

  const page = setup({
    listId: 'testId',

    loadItems,

    listState,

    listActions: {
      ...listActions,
      changeListState,
      loadListSuccess,
      loadListError,
    },

    componentProps: {
      testProperty: 'testValue',
    },
  });

  await page.requestItems('testAction', mappedState);

  expect(changeListState.mock.calls.length).toBe(1);
  expect(changeListState.mock.calls[0][0]).toBe('testId');
  expect(changeListState.mock.calls[0][1]).toEqual(nextListState);
  expect(changeListState.mock.calls[0][2]).toBe('testAction');

  expect(loadItems.mock.calls.length).toBe(1);
  expect(loadItems.mock.calls[0][0]).toEqual(nextListState);
  expect(loadItems.mock.calls[0][1]).toEqual({
    testProperty: 'testValue',
  });

  expect(loadListSuccess.mock.calls.length).toBe(1);
  expect(loadListSuccess.mock.calls[0][0]).toBe('testId');
  expect(loadListSuccess.mock.calls[0][1]).toBe(responseSymbol);
  expect(loadListSuccess.mock.calls[0][2]).toBe(5);

  expect(loadListError.mock.calls.length).toBe(0);
});

test('should change list state and request items with error', async () => {
  const mappedState = {
    filters: {
      testFilter: 'testValue2',
    },

    appliedFilters: {
      testFilter: 'testValue3',
    },

    sort: {
      param: 'testParam',
      asc: true,
    },
  };

  const loadItems = jest.fn(() => {
    throw new LoadListError('test error');
  });
  const changeListState = jest.fn();
  const loadListSuccess = jest.fn();
  const loadListError = jest.fn();

  const listState = {
    ...listInitialState,
    requestId: 4,
  };

  const nextListState = recountListState(listState, mappedState);

  const page = setup({
    listId: 'testId',

    loadItems,

    listState,

    listActions: {
      ...listActions,
      changeListState,
      loadListSuccess,
      loadListError,
    },

    componentProps: {
      testProperty: 'testValue',
    },
  });

  await page.requestItems('testAction', mappedState);

  expect(changeListState.mock.calls.length).toBe(1);
  expect(changeListState.mock.calls[0][0]).toBe('testId');
  expect(changeListState.mock.calls[0][1]).toEqual(nextListState);
  expect(changeListState.mock.calls[0][2]).toBe('testAction');

  expect(loadItems.mock.calls.length).toBe(1);
  expect(loadItems.mock.calls[0][0]).toEqual(nextListState);
  expect(loadItems.mock.calls[0][1]).toEqual({
    testProperty: 'testValue',
  });

  expect(loadListSuccess.mock.calls.length).toBe(0);

  expect(loadListError.mock.calls.length).toBe(1);
  expect(loadListError.mock.calls[0][0]).toBe('testId');
  expect(loadListError.mock.calls[0][1]).toBe('test error');
  expect(loadListError.mock.calls[0][2]).toBe(5);
});

test('should change list state and cancel request', async () => {
  const mappedState = {
    filters: {
      testFilter: 'testValue2',
    },

    appliedFilters: {
      testFilter: 'testValue3',
    },

    sort: {
      param: 'testParam',
      asc: true,
    },
  };

  const loadItems = jest.fn(() => {
    throw new RequestCanceledError();
  });
  const changeListState = jest.fn();
  const loadListSuccess = jest.fn();
  const loadListError = jest.fn();

  const listState = {
    ...listInitialState,
    requestId: 4,
  };

  const nextListState = recountListState(listState, mappedState);

  const page = setup({
    listId: 'testId',

    loadItems,

    listState,

    listActions: {
      ...listActions,
      changeListState,
      loadListSuccess,
      loadListError,
    },

    componentProps: {
      testProperty: 'testValue',
    },
  });

  await page.requestItems('testAction', mappedState);

  expect(changeListState.mock.calls.length).toBe(1);
  expect(changeListState.mock.calls[0][0]).toBe('testId');
  expect(changeListState.mock.calls[0][1]).toEqual(nextListState);
  expect(changeListState.mock.calls[0][2]).toBe('testAction');

  expect(loadItems.mock.calls.length).toBe(1);
  expect(loadItems.mock.calls[0][0]).toEqual(nextListState);
  expect(loadItems.mock.calls[0][1]).toEqual({
    testProperty: 'testValue',
  });

  expect(loadListSuccess.mock.calls.length).toBe(0);
  expect(loadListError.mock.calls.length).toBe(0);
});

test('should change list state and throw error on request items', async () => {
  const mappedState = {
    filters: {
      testFilter: 'testValue2',
    },

    appliedFilters: {
      testFilter: 'testValue3',
    },

    sort: {
      param: 'testParam',
      asc: true,
    },
  };

  const loadItems = jest.fn(() => {
    throw new Error('custom error');
  });
  const changeListState = jest.fn();
  const loadListSuccess = jest.fn();
  const loadListError = jest.fn();

  const listState = {
    ...listInitialState,
    requestId: 4,
  };

  const nextListState = recountListState(listState, mappedState);

  const page = setup({
    listId: 'testId',

    loadItems,

    listState,

    listActions: {
      ...listActions,
      changeListState,
      loadListSuccess,
      loadListError,
    },

    componentProps: {
      testProperty: 'testValue',
    },
  });

  let isThrown = false;
  try {
    await page.requestItems('testAction', mappedState);
  } catch (e) {
    isThrown = true;
  }

  expect(changeListState.mock.calls.length).toBe(1);
  expect(changeListState.mock.calls[0][0]).toBe('testId');
  expect(changeListState.mock.calls[0][1]).toEqual(nextListState);
  expect(changeListState.mock.calls[0][2]).toBe('testAction');

  expect(loadItems.mock.calls.length).toBe(1);
  expect(loadItems.mock.calls[0][0]).toEqual(nextListState);
  expect(loadItems.mock.calls[0][1]).toEqual({
    testProperty: 'testValue',
  });

  expect(isThrown).toBe(true);

  expect(loadListSuccess.mock.calls.length).toBe(0);
  expect(loadListError.mock.calls.length).toBe(0);
});

test('should call onBeforeRequest before loadItems', async () => {
  const mappedState = {
    filters: {
      testFilter: 'testValue2',
    },

    appliedFilters: {
      testFilter: 'testValue3',
    },

    sort: {
      param: 'testParam',
      asc: true,
    },
  };

  const responseSymbol = Symbol('response');

  const calledFunctions = [];

  const onBeforeRequest = jest.fn(() => {
    calledFunctions.push('onBeforeRequest');
  });

  const loadItems = jest.fn(() => {
    calledFunctions.push('loadItems');

    return responseSymbol;
  });
  const changeListState = jest.fn(() => {
    calledFunctions.push('changeListState');
  });
  const loadListSuccess = jest.fn();
  const loadListError = jest.fn();

  const listState = {
    ...listInitialState,
    requestId: 4,
  };

  const page = setup({
    listId: 'testId',

    loadItems,
    onBeforeRequest,

    listState,

    listActions: {
      ...listActions,
      changeListState,
      loadListSuccess,
      loadListError,
    },

    componentProps: {
      testProperty: 'testValue',
    },
  });

  await page.requestItems('testAction', mappedState);

  expect(calledFunctions).toEqual([
    'changeListState',
    'onBeforeRequest',
    'loadItems',
  ]);
});

test('should call requestItems on render', async () => {
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.componentDidMount();

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe('loadItemsOnInit');
  expect(requestItems.mock.calls[0][1]).toBe(null);
});

test('should not call loadList and requestItems on render when autoload is false', async () => {
  const loadList = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
      autoload: false,
      requestId: 3,
    },

    listActions: {
      ...listActions,
      loadList,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.componentDidMount();

  expect(loadList.mock.calls.length).toBe(0);
  expect(requestItems.mock.calls.length).toBe(0);
});

test('should update component on componentProps change', async () => {
  const page = setup({
    componentProps: {
      testProperty: 'testValue',
    },
  });

  expect(
    page.instance().shouldComponentUpdate({
      ...defaultProps,
      componentProps: {
        testProperty: 'testValue2',
      },
    }),
  ).toBe(true);
});

test('should update component on list state change', async () => {
  const page = setup({
    listState: listInitialState,
  });

  expect(
    page.instance().shouldComponentUpdate({
      ...defaultProps,
      listState: {
        ...listInitialState,
      },
    }),
  ).toBe(true);
});

test('should not update component if on componentProps and list state are same', async () => {
  const page = setup({
    listState: listInitialState,

    componentProps: {
      testProperty: 'testValue',
    },
  });

  expect(
    page.instance().shouldComponentUpdate({
      ...defaultProps,

      listState: listInitialState,

      componentProps: {
        testProperty: 'testValue',
      },
    }),
  ).toBe(false);
});

test('should load items from props', async () => {
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('loadItems')();

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe('loadItems');
  expect(requestItems.mock.calls[0][1]).toBe(null);
});

test('should call getStateFromProps on component update', async () => {
  const stateSymbol = Symbol('mapped state');

  const getStateFromProps = jest.fn(() => stateSymbol);
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    componentProps: {
      testProperty: 'testValue1',
      sort: {
        param: 'param1',
        asc: true,
      },
    },

    reduxFilterlistParams: {
      ...defaultProps.reduxFilterlistParams,

      getStateFromProps,

      shouldRecountState: () => true,
    },

    requestItemsMock: requestItems,
  });

  await page.setPropsAndUpdate({
    componentProps: {
      testProperty: 'testValue2',
      sort: {
        param: 'param2',
        asc: false,
      },
    },
  });

  expect(getStateFromProps.mock.calls.length).toBe(1);
  expect(getStateFromProps.mock.calls[0][0]).toEqual({
    testProperty: 'testValue2',
    sort: {
      param: 'param2',
      asc: false,
    },
  });

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe('setStateFromProps');
  expect(requestItems.mock.calls[0][1]).toEqual(stateSymbol);
});

test('should not call getStateFromProps on component update if shouldRecountState is not defined', async () => {
  const getStateFromProps = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    componentProps: {
      testProperty: 'testValue1',
      sort: {
        param: 'param1',
        asc: true,
      },
    },

    reduxFilterlistParams: {
      ...defaultProps.reduxFilterlistParams,

      getStateFromProps,
    },

    requestItemsMock: requestItems,
  });

  await page.setPropsAndUpdate({
    componentProps: {
      testProperty: 'testValue2',
      sort: {
        param: 'param2',
        asc: false,
      },
    },
  });

  expect(getStateFromProps.mock.calls.length).toBe(0);
  expect(requestItems.mock.calls.length).toBe(0);
});

test('should not call getStateFromProps on component update if shouldRecountState returns false', async () => {
  const getStateFromProps = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    componentProps: {
      testProperty: 'testValue1',
      sort: {
        param: 'param1',
        asc: true,
      },
    },

    reduxFilterlistParams: {
      ...defaultProps.reduxFilterlistParams,

      getStateFromProps,
      shouldRecountState: () => false,
    },

    requestItemsMock: requestItems,
  });

  await page.setPropsAndUpdate({
    componentProps: {
      testProperty: 'testValue2',
      sort: {
        param: 'param2',
        asc: false,
      },
    },
  });

  expect(getStateFromProps.mock.calls.length).toBe(0);
  expect(requestItems.mock.calls.length).toBe(0);
});

test('should call setFilterValue from props', async () => {
  const stateSymbol = Symbol('mapped state');

  const setFilterValue = jest.fn(() => stateSymbol);
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listStateMappers: {
      ...listStateMappers,
      setFilterValue,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('setFilterValue')('testFilter', 'testValue');

  expect(setFilterValue.mock.calls.length).toBe(1);
  expect(setFilterValue.mock.calls[0][0]).toBe(listInitialState);
  expect(setFilterValue.mock.calls[0][1]).toBe('testFilter');
  expect(setFilterValue.mock.calls[0][2]).toBe('testValue');

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe('setFilterValue');
  expect(requestItems.mock.calls[0][1]).toBe(stateSymbol);
});

test('should apply filter from props', async () => {
  const stateSymbol = Symbol('mapped state');

  const applyFilter = jest.fn(() => stateSymbol);
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listStateMappers: {
      ...listStateMappers,
      applyFilter,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('applyFilter')('testFilter');

  expect(applyFilter.mock.calls.length).toBe(1);
  expect(applyFilter.mock.calls[0][0]).toBe(listInitialState);
  expect(applyFilter.mock.calls[0][1]).toBe('testFilter');

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe('applyFilter');
  expect(requestItems.mock.calls[0][1]).toBe(stateSymbol);
});

test('should set and apply filter from props', async () => {
  const stateSymbol = Symbol('mapped state');

  const setAndApplyFilter = jest.fn(() => stateSymbol);
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listStateMappers: {
      ...listStateMappers,
      setAndApplyFilter,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('setAndApplyFilter')('testFilter', 'testValue');

  expect(setAndApplyFilter.mock.calls.length).toBe(1);
  expect(setAndApplyFilter.mock.calls[0][0]).toBe(listInitialState);
  expect(setAndApplyFilter.mock.calls[0][1]).toBe('testFilter');
  expect(setAndApplyFilter.mock.calls[0][2]).toBe('testValue');

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe('setAndApplyFilter');
  expect(requestItems.mock.calls[0][1]).toBe(stateSymbol);
});

test('should reset filter from props', async () => {
  const stateSymbol = Symbol('mapped state');

  const resetFilter = jest.fn(() => stateSymbol);
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listStateMappers: {
      ...listStateMappers,
      resetFilter,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('resetFilter')('testFilter');

  expect(resetFilter.mock.calls.length).toBe(1);
  expect(resetFilter.mock.calls[0][0]).toBe(listInitialState);
  expect(resetFilter.mock.calls[0][1]).toBe('testFilter');

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe('resetFilter');
  expect(requestItems.mock.calls[0][1]).toBe(stateSymbol);
});

test('should set multiple filters from props', async () => {
  const stateSymbol = Symbol('mapped state');

  const setFiltersValues = jest.fn(() => stateSymbol);
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listStateMappers: {
      ...listStateMappers,
      setFiltersValues,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('setFiltersValues')({
    filter1: 'value1',
    filter2: 'value2',
  });

  expect(setFiltersValues.mock.calls.length).toBe(1);
  expect(setFiltersValues.mock.calls[0][0]).toBe(listInitialState);
  expect(setFiltersValues.mock.calls[0][1]).toEqual({
    filter1: 'value1',
    filter2: 'value2',
  });

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe('setFiltersValues');
  expect(requestItems.mock.calls[0][1]).toBe(stateSymbol);
});

test('should apply multiple filters from props', async () => {
  const stateSymbol = Symbol('mapped state');

  const applyFilters = jest.fn(() => stateSymbol);
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listStateMappers: {
      ...listStateMappers,
      applyFilters,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('applyFilters')(['filter1', 'filter2']);

  expect(applyFilters.mock.calls.length).toBe(1);
  expect(applyFilters.mock.calls[0][0]).toBe(listInitialState);
  expect(applyFilters.mock.calls[0][1]).toEqual(['filter1', 'filter2']);

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe('applyFilters');
  expect(requestItems.mock.calls[0][1]).toBe(stateSymbol);
});

test('should set and apply multiple filters from props', async () => {
  const stateSymbol = Symbol('mapped state');

  const setAndApplyFilters = jest.fn(() => stateSymbol);
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listStateMappers: {
      ...listStateMappers,
      setAndApplyFilters,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('setAndApplyFilters')({
    filter1: 'value1',
    filter2: 'value2',
  });

  expect(setAndApplyFilters.mock.calls.length).toBe(1);
  expect(setAndApplyFilters.mock.calls[0][0]).toBe(listInitialState);
  expect(setAndApplyFilters.mock.calls[0][1]).toEqual({
    filter1: 'value1',
    filter2: 'value2',
  });

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe('setAndApplyFilters');
  expect(requestItems.mock.calls[0][1]).toBe(stateSymbol);
});

test('should reset multiple filters from props', async () => {
  const stateSymbol = Symbol('mapped state');

  const resetFilters = jest.fn(() => stateSymbol);
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listStateMappers: {
      ...listStateMappers,
      resetFilters,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('resetFilters')(['filter1', 'filter2']);

  expect(resetFilters.mock.calls.length).toBe(1);
  expect(resetFilters.mock.calls[0][0]).toBe(listInitialState);
  expect(resetFilters.mock.calls[0][1]).toEqual(['filter1', 'filter2']);

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe('resetFilters');
  expect(requestItems.mock.calls[0][1]).toBe(stateSymbol);
});

test('should reset all filters from props', async () => {
  const stateSymbol = Symbol('mapped state');

  const resetAllFilters = jest.fn(() => stateSymbol);
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listStateMappers: {
      ...listStateMappers,
      resetAllFilters,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('resetAllFilters')();

  expect(resetAllFilters.mock.calls.length).toBe(1);
  expect(resetAllFilters.mock.calls[0][0]).toBe(listInitialState);

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe('resetAllFilters');
  expect(requestItems.mock.calls[0][1]).toBe(stateSymbol);
});

test('should set sorting from props', async () => {
  const stateSymbol = Symbol('mapped state');

  const setSorting = jest.fn(() => stateSymbol);
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listStateMappers: {
      ...listStateMappers,
      setSorting,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('setSorting')('id', true);

  expect(setSorting.mock.calls.length).toBe(1);
  expect(setSorting.mock.calls[0][0]).toBe(listInitialState);
  expect(setSorting.mock.calls[0][1]).toBe('id');
  expect(setSorting.mock.calls[0][2]).toBe(true);

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe('setSorting');
  expect(requestItems.mock.calls[0][1]).toBe(stateSymbol);
});

test('should reset sorting from props', async () => {
  const stateSymbol = Symbol('mapped state');

  const resetSorting = jest.fn(() => stateSymbol);
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listStateMappers: {
      ...listStateMappers,
      resetSorting,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('resetSorting')();

  expect(resetSorting.mock.calls.length).toBe(1);
  expect(resetSorting.mock.calls[0][0]).toBe(listInitialState);

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe('resetSorting');
  expect(requestItems.mock.calls[0][1]).toBe(stateSymbol);
});

test('should insert item to list from props', async () => {
  const insertItem = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
      requestId: 3,
    },

    listActions: {
      ...listActions,
      insertItem,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('insertItem')(1, {
    id: 4,
  }, {
    additional: 4,
  });

  expect(insertItem.mock.calls.length).toBe(1);
  expect(insertItem.mock.calls[0][0]).toBe('testId');
  expect(insertItem.mock.calls[0][1]).toBe(1);
  expect(insertItem.mock.calls[0][2]).toEqual({
    id: 4,
  });
  expect(insertItem.mock.calls[0][3]).toEqual({
    additional: 4,
  });

  expect(requestItems.mock.calls.length).toBe(0);
});

test('should delete list item from props', async () => {
  const deleteItem = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
      requestId: 3,
    },

    listActions: {
      ...listActions,
      deleteItem,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('deleteItem')(1, {
    additional: 4,
  });

  expect(deleteItem.mock.calls.length).toBe(1);
  expect(deleteItem.mock.calls[0][0]).toBe('testId');
  expect(deleteItem.mock.calls[0][1]).toBe(1);
  expect(deleteItem.mock.calls[0][2]).toEqual({
    additional: 4,
  });

  expect(requestItems.mock.calls.length).toBe(0);
});

test('should update list item from props', async () => {
  const updateItem = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
      requestId: 3,
    },

    listActions: {
      ...listActions,
      updateItem,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('updateItem')(1, {
    id: 4,
  }, {
    additional: 4,
  });

  expect(updateItem.mock.calls.length).toBe(1);
  expect(updateItem.mock.calls[0][0]).toBe('testId');
  expect(updateItem.mock.calls[0][1]).toBe(1);
  expect(updateItem.mock.calls[0][2]).toEqual({
    id: 4,
  });
  expect(updateItem.mock.calls[0][3]).toEqual({
    additional: 4,
  });

  expect(requestItems.mock.calls.length).toBe(0);
});
