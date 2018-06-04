import React from 'react';
import { shallow } from 'enzyme';
import checkPropTypes from 'check-prop-types';

import ReduxFilterlistWrapper from '../ReduxFilterlistWrapper';
import { RequestCanceledError, LoadListError } from '../errors';

import { filterlistPropTypes } from '../propTypes';

import listInitialState from '../listInitialState';

const WrappedComponent = () => (
  <div />
);

const listActions = {
  registerList: () => {},
  destroyList: () => {},

  loadList: () => {},
  loadListSuccess: () => {},
  loadListError: () => {},

  setStateFromProps: () => {},

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

  insertItem: () => {},
  deleteItem: () => {},
  updateItem: () => {},
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

  requestItems(requestId, actionType) {
    if (this.props.requestItemsMock) {
      this.props.requestItemsMock(requestId, actionType);
    }
  }

  manualRequestItems(requestId, actionType) {
    return super.requestItems(requestId, actionType);
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

  requestItems(requestId, actionType) {
    return this.wrapper.instance().manualRequestItems(requestId, actionType);
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

test('should request items successfully', async () => {
  const loadItems = jest.fn(() => 'test response');
  const loadListSuccess = jest.fn();
  const loadListError = jest.fn();

  const listState = {
    ...listInitialState,
    requestId: 4,
  };

  const page = setup({
    listId: 'testId',

    loadItems,

    listState,

    listActions: {
      ...listActions,
      loadListSuccess,
      loadListError,
    },

    componentProps: {
      testProperty: 'testValue',
    },
  });

  await page.requestItems(3);

  expect(loadItems.mock.calls.length).toBe(1);
  expect(loadItems.mock.calls[0][0]).toBe(listState);
  expect(loadItems.mock.calls[0][1]).toEqual({
    testProperty: 'testValue',
  });

  expect(loadListSuccess.mock.calls.length).toBe(1);
  expect(loadListSuccess.mock.calls[0][0]).toBe('testId');
  expect(loadListSuccess.mock.calls[0][1]).toBe('test response');

  expect(loadListError.mock.calls.length).toBe(0);
});

test('should request items with error', async () => {
  const loadItems = jest.fn(() => {
    throw new LoadListError('test error');
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

    listState,

    listActions: {
      ...listActions,
      loadListSuccess,
      loadListError,
    },

    componentProps: {
      testProperty: 'testValue',
    },
  });

  await page.requestItems(3);

  expect(loadItems.mock.calls.length).toBe(1);
  expect(loadItems.mock.calls[0][0]).toBe(listState);
  expect(loadItems.mock.calls[0][1]).toEqual({
    testProperty: 'testValue',
  });

  expect(loadListSuccess.mock.calls.length).toBe(0);

  expect(loadListError.mock.calls.length).toBe(1);
  expect(loadListError.mock.calls[0][0]).toBe('testId');
  expect(loadListError.mock.calls[0][1]).toBe('test error');
});

test('should cancel request', async () => {
  const loadItems = jest.fn(() => {
    throw new RequestCanceledError();
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

    listState,

    listActions: {
      ...listActions,
      loadListSuccess,
      loadListError,
    },

    componentProps: {
      testProperty: 'testValue',
    },
  });

  await page.requestItems(3);

  expect(loadItems.mock.calls.length).toBe(1);
  expect(loadItems.mock.calls[0][0]).toBe(listState);
  expect(loadItems.mock.calls[0][1]).toEqual({
    testProperty: 'testValue',
  });

  expect(loadListSuccess.mock.calls.length).toBe(0);
  expect(loadListError.mock.calls.length).toBe(0);
});

test('should not call loadItems, loadListSuccess and loadListError if request id in list state is bigger than incremented request id from arguemnt', async () => {
  const loadItems = jest.fn();
  const loadListSuccess = jest.fn();
  const loadListError = jest.fn();

  const listState = {
    ...listInitialState,
    requestId: 4,
  };

  const page = setup({
    listId: 'testId',

    loadItems,

    listState,

    listActions: {
      ...listActions,
      loadListSuccess,
      loadListError,
    },

    componentProps: {
      testProperty: 'testValue',
    },
  });

  await page.requestItems(2);

  expect(loadItems.mock.calls.length).toBe(0);
  expect(loadListSuccess.mock.calls.length).toBe(0);
  expect(loadListError.mock.calls.length).toBe(0);
});

test('should not call loadListSuccess and loadListError if request id incremented during request called', async () => {
  const listState = {
    ...listInitialState,
    requestId: 4,
  };

  let page;
  const loadItems = jest.fn(() => {
    page.setProps({
      listState: {
        ...listState,
        requestId: 5,
      },
    });
  });
  const loadListSuccess = jest.fn();
  const loadListError = jest.fn();

  page = setup({
    listId: 'testId',

    loadItems,

    listState,

    listActions: {
      ...listActions,
      loadListSuccess,
      loadListError,
    },

    componentProps: {
      testProperty: 'testValue',
    },
  });

  await page.requestItems(3);

  expect(loadItems.mock.calls.length).toBe(1);

  expect(loadListSuccess.mock.calls.length).toBe(0);
  expect(loadListError.mock.calls.length).toBe(0);
});

test('should throw error on request items', async () => {
  const loadItems = jest.fn(() => {
    throw new Error('custom error');
  });

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
      requestId: 4,
    },

    loadItems,
  });

  let isThrown = false;
  try {
    await page.requestItems(3);
  } catch (e) {
    isThrown = true;
  }

  expect(isThrown).toBe(true);
});

test('should call onBeforeRequest before loadItems', async () => {
  let lastCalledFn = null;
  const onBeforeRequest = jest.fn(() => {
    lastCalledFn = 'onBeforeRequest';
  });

  const loadItems = jest.fn(() => {
    lastCalledFn = 'loadItems';
  });

  const listState = {
    ...listInitialState,
    requestId: 4,
  };

  const page = setup({
    listId: 'testId',

    listState,
    onBeforeRequest,
    loadItems,

    componentProps: {
      testProperty: 'testValue',
    },
  });

  await page.requestItems(3, 'testType');

  expect(onBeforeRequest.mock.calls.length).toBe(1);
  expect(onBeforeRequest.mock.calls[0][0]).toBe(listState);
  expect(onBeforeRequest.mock.calls[0][1]).toEqual({
    testProperty: 'testValue',
  });
  expect(onBeforeRequest.mock.calls[0][2]).toBe('testType');

  expect(loadItems.mock.calls.length).toBe(1);
  expect(loadItems.mock.calls[0][0]).toBe(listState);
  expect(loadItems.mock.calls[0][1]).toEqual({
    testProperty: 'testValue',
  });

  expect(lastCalledFn).toBe('loadItems');
});

test('should call loadList and requestItems on render', async () => {
  const loadList = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
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

  expect(loadList.mock.calls.length).toBe(1);
  expect(loadList.mock.calls[0][0]).toBe('testId');

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe(3);
  expect(requestItems.mock.calls[0][1]).toBe('loadItemsOnInit');
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
  const loadList = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
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

  await page.getWrappedComponent().prop('loadItems')();

  expect(loadList.mock.calls.length).toBe(1);
  expect(loadList.mock.calls[0][0]).toBe('testId');

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe(3);
  expect(requestItems.mock.calls[0][1]).toBe('loadItems');
});

test('should call setStateFromProps on component update', async () => {
  const setStateFromProps = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
      requestId: 3,
    },

    listActions: {
      ...listActions,
      setStateFromProps,
    },

    componentProps: {
      testProperty: 'testValue1',
      sort: {
        param: 'param1',
        asc: true,
      },
    },

    reduxFilterlistParams: {
      ...defaultProps.reduxFilterlistParams,

      getStateFromProps: ({
        testProperty,
        sort,
      }) => ({
        appliedFilters: {
          testProperty,
        },
        sort,
      }),

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

  expect(setStateFromProps.mock.calls.length).toBe(1);
  expect(setStateFromProps.mock.calls[0][0]).toBe('testId');
  expect(setStateFromProps.mock.calls[0][1]).toEqual({
    testProperty: 'testValue2',
  });
  expect(setStateFromProps.mock.calls[0][2]).toEqual({
    param: 'param2',
    asc: false,
  });

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe(3);
  expect(requestItems.mock.calls[0][1]).toBe('setStateFromProps');
});

test('should not call setStateFromProps on component update if shouldRecountState is not defined', async () => {
  const setStateFromProps = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
      requestId: 3,
    },

    listActions: {
      ...listActions,
      setStateFromProps,
    },

    componentProps: {
      testProperty: 'testValue1',
      sort: {
        param: 'param1',
        asc: true,
      },
    },

    reduxFilterlistParams: {
      ...defaultProps.reduxFilterlistParams,

      getStateFromProps: ({
        testProperty,
        sort,
      }) => ({
        appliedFilters: {
          testProperty,
        },
        sort,
      }),
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

  expect(setStateFromProps.mock.calls.length).toBe(0);
  expect(requestItems.mock.calls.length).toBe(0);
});

test('should not call setStateFromProps on component update if shouldRecountState returns false', async () => {
  const setStateFromProps = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
      requestId: 3,
    },

    listActions: {
      ...listActions,
      setStateFromProps,
    },

    componentProps: {
      testProperty: 'testValue1',
      sort: {
        param: 'param1',
        asc: true,
      },
    },

    reduxFilterlistParams: {
      ...defaultProps.reduxFilterlistParams,

      getStateFromProps: ({
        testProperty,
        sort,
      }) => ({
        appliedFilters: {
          testProperty,
        },
        sort,
      }),
    },

    setStateFromProps: () => false,

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

  expect(setStateFromProps.mock.calls.length).toBe(0);
  expect(requestItems.mock.calls.length).toBe(0);
});

test('should call setFilterValue from props', async () => {
  const setFilterValue = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
      requestId: 3,
    },

    listActions: {
      ...listActions,
      setFilterValue,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('setFilterValue')('testFilter', 'testValue');

  expect(setFilterValue.mock.calls.length).toBe(1);
  expect(setFilterValue.mock.calls[0][0]).toBe('testId');
  expect(setFilterValue.mock.calls[0][1]).toBe('testFilter');
  expect(setFilterValue.mock.calls[0][2]).toBe('testValue');

  expect(requestItems.mock.calls.length).toBe(0);
});

test('should apply filter from props', async () => {
  const applyFilter = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
      requestId: 3,
    },

    listActions: {
      ...listActions,
      applyFilter,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('applyFilter')('testFilter');

  expect(applyFilter.mock.calls.length).toBe(1);
  expect(applyFilter.mock.calls[0][0]).toBe('testId');
  expect(applyFilter.mock.calls[0][1]).toBe('testFilter');

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe(3);
  expect(requestItems.mock.calls[0][1]).toBe('applyFilter');
});

test('should set and apply filter from props', async () => {
  const setAndApplyFilter = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
      requestId: 3,
    },

    listActions: {
      ...listActions,
      setAndApplyFilter,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('setAndApplyFilter')('testFilter', 'testValue');

  expect(setAndApplyFilter.mock.calls.length).toBe(1);
  expect(setAndApplyFilter.mock.calls[0][0]).toBe('testId');
  expect(setAndApplyFilter.mock.calls[0][1]).toBe('testFilter');
  expect(setAndApplyFilter.mock.calls[0][2]).toBe('testValue');

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe(3);
  expect(requestItems.mock.calls[0][1]).toBe('setAndApplyFilter');
});

test('should reset filter from props', async () => {
  const resetFilter = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
      requestId: 3,
    },

    listActions: {
      ...listActions,
      resetFilter,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('resetFilter')('testFilter');

  expect(resetFilter.mock.calls.length).toBe(1);
  expect(resetFilter.mock.calls[0][0]).toBe('testId');
  expect(resetFilter.mock.calls[0][1]).toBe('testFilter');

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe(3);
  expect(requestItems.mock.calls[0][1]).toBe('resetFilter');
});

test('should set multiple filters from props', async () => {
  const setFiltersValues = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
      requestId: 3,
    },

    listActions: {
      ...listActions,
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
  expect(setFiltersValues.mock.calls[0][0]).toBe('testId');
  expect(setFiltersValues.mock.calls[0][1]).toEqual({
    filter1: 'value1',
    filter2: 'value2',
  });

  expect(requestItems.mock.calls.length).toBe(0);
});

test('should apply multiple filters from props', async () => {
  const applyFilters = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
      requestId: 3,
    },

    listActions: {
      ...listActions,
      applyFilters,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('applyFilters')(['filter1', 'filter2']);

  expect(applyFilters.mock.calls.length).toBe(1);
  expect(applyFilters.mock.calls[0][0]).toBe('testId');
  expect(applyFilters.mock.calls[0][1]).toEqual(['filter1', 'filter2']);

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe(3);
  expect(requestItems.mock.calls[0][1]).toBe('applyFilters');
});

test('should set and apply multiple filters from props', async () => {
  const setAndApplyFilters = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
      requestId: 3,
    },

    listActions: {
      ...listActions,
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
  expect(setAndApplyFilters.mock.calls[0][0]).toBe('testId');
  expect(setAndApplyFilters.mock.calls[0][1]).toEqual({
    filter1: 'value1',
    filter2: 'value2',
  });

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe(3);
  expect(requestItems.mock.calls[0][1]).toBe('setAndApplyFilters');
});

test('should reset multiple filters from props', async () => {
  const resetFilters = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
      requestId: 3,
    },

    listActions: {
      ...listActions,
      resetFilters,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('resetFilters')(['filter1', 'filter2']);

  expect(resetFilters.mock.calls.length).toBe(1);
  expect(resetFilters.mock.calls[0][0]).toBe('testId');
  expect(resetFilters.mock.calls[0][1]).toEqual(['filter1', 'filter2']);

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe(3);
  expect(requestItems.mock.calls[0][1]).toBe('resetFilters');
});

test('should reset all filters from props', async () => {
  const resetAllFilters = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
      requestId: 3,
    },

    listActions: {
      ...listActions,
      resetAllFilters,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('resetAllFilters')();

  expect(resetAllFilters.mock.calls.length).toBe(1);
  expect(resetAllFilters.mock.calls[0][0]).toBe('testId');

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe(3);
  expect(requestItems.mock.calls[0][1]).toBe('resetAllFilters');
});

test('should set sorting from props', async () => {
  const setSorting = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
      requestId: 3,
    },

    listActions: {
      ...listActions,
      setSorting,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('setSorting')('id', true);

  expect(setSorting.mock.calls.length).toBe(1);
  expect(setSorting.mock.calls[0][0]).toBe('testId');
  expect(setSorting.mock.calls[0][1]).toBe('id');
  expect(setSorting.mock.calls[0][2]).toBe(true);

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe(3);
  expect(requestItems.mock.calls[0][1]).toBe('setSorting');
});

test('should reset sorting from props', async () => {
  const resetSorting = jest.fn();
  const requestItems = jest.fn();

  const page = setup({
    listId: 'testId',

    listState: {
      ...listInitialState,
      requestId: 3,
    },

    listActions: {
      ...listActions,
      resetSorting,
    },

    componentProps: {
      testProperty: 'testValue',
    },

    requestItemsMock: requestItems,
  });

  await page.getWrappedComponent().prop('resetSorting')();

  expect(resetSorting.mock.calls.length).toBe(1);
  expect(resetSorting.mock.calls[0][0]).toBe('testId');

  expect(requestItems.mock.calls.length).toBe(1);
  expect(requestItems.mock.calls[0][0]).toBe(3);
  expect(requestItems.mock.calls[0][1]).toBe('resetSorting');
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
