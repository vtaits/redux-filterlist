import { mount } from 'enzyme';
import sinon from 'sinon';

import React from 'react';
import checkPropTypes from 'check-prop-types';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux';

import _reduxFilterlist from '../reduxFilterlist';
import ReduxFilterlistWrapper from '../ReduxFilterlistWrapper';
import collectListInitialState from '../collectListInitialState';

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
  resetSorting,

  insertItem,
  deleteItem,
  updateItem,
} from '../actions';

import { filterlistPropTypes } from '../propTypes';

import reducer from '../reducer';
import _mockStore from '../test-utils/mockStore';

const mockStore = _mockStore.bind(null, combineReducers({
  reduxFilterlist: reducer,
}));

const TestWrapperComponent = () => (
  <div />
);

const TestChildComponent = () => (
  <div />
);

const reduxFilterlist = _reduxFilterlist.bind(null, ReduxFilterlistWrapper);

function waitForSpyCall(spy) {
  return new Promise((resolve) => {
    const iteration = () => {
      if (spy.returnValues.length > 0) {
        resolve();

        return;
      }

      setTimeout(iteration);
    };

    setTimeout(iteration);
  });
}

test('should render wrapper and child components without error', () => {
  const Container = reduxFilterlist({
    listId: 'test',
    loadItems: () => Promise.resolve({
      items: [{
        id: 1,
      }, {
        id: 2,
      }, {
        id: 3,
      }],
      additional: {
        count: 3,
      },
    }),
  })(TestChildComponent);

  const wrapper = mount(
    <Provider store={mockStore({
      reduxFilterlist: {},
    })}
    >
      <Container />
    </Provider>,
  );

  expect(wrapper.find(ReduxFilterlistWrapper).length).toBe(1);
  expect(wrapper.find(TestChildComponent).length).toBe(1);
});

test('should throw an exception if listId is not defined', () => {
  expect(() => {
    const Container = reduxFilterlist({
      loadItems: () => Promise.resolve({
        items: [{
          id: 1,
        }, {
          id: 2,
        }, {
          id: 3,
        }],
        additional: {
          count: 3,
        },
      }),
    })(TestChildComponent);

    mount(
      <Provider store={mockStore({
        reduxFilterlist: {},
      })}
      >
        <Container />
      </Provider>,
    );
  })
    .toThrowError('listId is required');
});

test('should throw an exception if loadItems is not defined', () => {
  expect(() => {
    const Container = reduxFilterlist({
      listId: 'test',
    })(TestChildComponent);

    mount(
      <Provider store={mockStore({
        reduxFilterlist: {},
      })}
      >
        <Container />
      </Provider>,
    );
  })
    .toThrowError('loadItems is required');
});

test('should throw an exception if loadItems is not a function', () => {
  expect(() => {
    const Container = reduxFilterlist({
      listId: 'test',
      loadItems: 123,
    })(TestChildComponent);

    mount(
      <Provider store={mockStore({
        reduxFilterlist: {},
      })}
      >
        <Container />
      </Provider>,
    );
  })
    .toThrowError('loadItems should be a function');
});

test('should throw an exception if onBeforeRequest defined and not a function', () => {
  expect(() => {
    const Container = reduxFilterlist({
      listId: 'test',
      loadItems: () => Promise.resolve({
        items: [],
        additional: null,
      }),
      onBeforeRequest: 123,
    })(TestChildComponent);

    mount(
      <Provider store={mockStore({
        reduxFilterlist: {},
      })}
      >
        <Container />
      </Provider>,
    );
  })
    .toThrowError('onBeforeRequest should be a function');
});

test('should provide the correct props', () => {
  const Container = reduxFilterlist({
    listId: 'test',
    loadItems: () => Promise.resolve({
      items: [{
        id: 1,
      }, {
        id: 2,
      }, {
        id: 3,
      }],
      additional: {
        count: 3,
      },
    }),
  })(TestChildComponent);

  const wrapper = mount(
    <Provider store={mockStore({
      reduxFilterlist: {},
    })}
    >
      <Container />
    </Provider>,
  );

  const props = wrapper.find(TestChildComponent).props();

  expect(Object.keys(props).sort())
    .toEqual([
      'applyFilter',
      'applyFilters',
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
      'catchRejects',
      'error',
      'filters',
      'initialFilters',
      'isDefaultSortAsc',
      'items',
      'loading',
      'requestId',
      'saveFiltersOnResetAll',
      'sort',
    ]);

  expect(checkPropTypes(filterlistPropTypes({}), props, 'prop', 'TestChildComponent'))
    .toBeFalsy();
});

test('should provide props from wrapper component to child component', () => {
  const Container = reduxFilterlist({
    listId: 'test',
    loadItems: () => Promise.resolve({
      items: [{
        id: 1,
      }, {
        id: 2,
      }, {
        id: 3,
      }],
      additional: {
        count: 3,
      },
    }),
  })(TestChildComponent);

  const wrapper = mount(
    <Provider store={mockStore({
      reduxFilterlist: {},
    })}
    >
      <Container
        testProperty="testValue"
        params={{
          testParam: 'testValue',
        }}
      />
    </Provider>,
  );

  const props = wrapper.find(TestChildComponent).props();

  expect(props.testProperty).toEqual('testValue');
  expect(props.params).toEqual({
    testParam: 'testValue',
  });
});

test('should provide the correct list state', () => {
  const Container = _reduxFilterlist(TestWrapperComponent, {
    listId: 'test',
    loadItems: () => Promise.resolve({
      items: [{
        id: 1,
      }, {
        id: 2,
      }, {
        id: 3,
      }],
      additional: {
        count: 3,
      },
    }),
  })(TestChildComponent);

  const wrapper = mount(
    <Provider store={mockStore({
      reduxFilterlist: {
        test: {
          sort: {
            param: 'test',
            asc: true,
          },
          initialFilters: {},
          filters: {},
          appliedFilters: {},
          loading: false,
          items: [1, 2, 3],
          additional: null,
          error: null,
        },
      },
    })}
    >
      <Container />
    </Provider>,
  );

  const listState = wrapper.find(TestWrapperComponent).props().listState;

  expect(listState).toEqual({
    sort: {
      param: 'test',
      asc: true,
    },
    initialFilters: {},
    filters: {},
    appliedFilters: {},
    loading: false,
    items: [1, 2, 3],
    additional: null,
    error: null,
  });
});

test('should provide the correct list state at init', () => {
  const params = {
    initialFilters: {
      filter: '',
    },
    sort: {
      param: 'param',
      asc: false,
    },
    appliedFilters: {
      filter: 'value',
    },
    alwaysResetFilters: {
      page: 1,
    },
  };

  const Container = _reduxFilterlist(TestWrapperComponent, {
    ...params,
    listId: 'test',
    loadItems: () => Promise.resolve({
      items: [{
        id: 1,
      }, {
        id: 2,
      }, {
        id: 3,
      }],
      additional: {
        count: 3,
      },
    }),
  })(TestChildComponent);

  const wrapper = mount(
    <Provider store={mockStore({
      reduxFilterlist: {
      },
    })}
    >
      <Container />
    </Provider>,
  );

  const listState = wrapper.find(TestWrapperComponent).props().listState;

  expect(listState).toEqual(collectListInitialState(params));
});

test('should provide redefine decorator params by component props', () => {
  const decoratorParams = {
    initialFilters: {
      filter: '',
    },
    sort: {
      param: 'param',
      asc: false,
    },
    appliedFilters: {
      filter: 'value',
    },
    alwaysResetFilters: {
      page: 1,
    },
    additional: {
      count: 0,
    },
  };

  const componentProps = {
    initialFilters: {
      filter2: '',
    },
    appliedFilters: {
      filter2: 'value2',
    },
    additional: {
      count: 10,
    },
  };

  const resultParams = {
    ...decoratorParams,
    ...componentProps,
  };

  const Container = _reduxFilterlist(TestWrapperComponent, {
    ...decoratorParams,
    listId: 'test',
    loadItems: () => Promise.resolve({
      items: [{
        id: 1,
      }, {
        id: 2,
      }, {
        id: 3,
      }],
      additional: {
        count: 3,
      },
    }),
  })(TestChildComponent);

  const wrapper = mount(
    <Provider store={mockStore({
      reduxFilterlist: {
      },
    })}
    >
      <Container
        {...componentProps}
      />
    </Provider>,
  );

  const listState = wrapper.find(TestWrapperComponent).props().listState;

  expect(listState).toEqual(collectListInitialState(resultParams));
});

test('should dispatch registerList on init', () => {
  const Container = reduxFilterlist({
    listId: 'test',
    loadItems: () => Promise.resolve({
      items: [{
        id: 1,
      }, {
        id: 2,
      }, {
        id: 3,
      }],
      additional: {
        count: 3,
      },
    }),

    initialFilters: {
      filter: '',
    },
    appliedFilters: {
      filter: 'value',
    },
    sort: {
      param: 'param',
      asc: false,
    },
  })(TestChildComponent);

  const store = mockStore({
    reduxFilterlist: {},
  });

  mount(
    <Provider store={store}>
      <Container />
    </Provider>,
  );

  expect(store.getActions()[0]).toEqual(
    registerList('test', {
      initialFilters: {
        filter: '',
      },
      appliedFilters: {
        filter: 'value',
      },
      sort: {
        param: 'param',
        asc: false,
      },
    }),
  );
});

test('should dispatch destroyList on unmount', () => {
  const Container = reduxFilterlist({
    listId: 'test',
    loadItems: () => Promise.resolve({
      items: [{
        id: 1,
      }, {
        id: 2,
      }, {
        id: 3,
      }],
      additional: {
        count: 3,
      },
    }),

    appliedFilters: {
      filter: 'value',
    },
    sort: {
      param: 'param',
      asc: false,
    },
  })(TestChildComponent);

  const store = mockStore({
    reduxFilterlist: {},
  });

  const wrapper = mount(
    <Provider store={store}>
      <Container />
    </Provider>,
  );

  store.clearActions();

  wrapper.unmount();

  expect(store.getActions()[0]).toEqual(
    destroyList('test'),
  );
});

test('should call loadItems once on render and provide correct values', () => {
  const spy = sinon.spy(() => Promise.resolve({
    items: [{
      id: 1,
    }, {
      id: 2,
    }, {
      id: 3,
    }],
    additional: {
      count: 3,
    },
  }));

  const Container = reduxFilterlist({
    listId: 'test',
    loadItems: spy,
  })(TestChildComponent);

  const store = mockStore({
    reduxFilterlist: {
    },
  });

  mount(
    <Provider store={store}>
      <Container
        testProperty="testValue"
      />
    </Provider>,
  );

  const listState = store.getState().reduxFilterlist.test;

  return waitForSpyCall(spy)
    .then(() => {
      expect(spy.callCount).toBe(1);
      expect(spy.args[0][0]).toBe(listState);
      expect(spy.args[0][1]).toEqual({
        testProperty: 'testValue',
      });
    });
});

test('should load items on init', () => {
  const spy = sinon.spy(() => Promise.resolve({
    items: [{
      id: 1,
    }, {
      id: 2,
    }, {
      id: 3,
    }],
    additional: {
      count: 3,
    },
  }));

  const Container = reduxFilterlist({
    listId: 'test',
    loadItems: spy,
  })(TestChildComponent);

  const store = mockStore({
    reduxFilterlist: {},
  });

  mount(
    <Provider store={store}>
      <Container />
    </Provider>,
  );

  return waitForSpyCall(spy)
    .then(() => spy.returnValues[0])
    .then(() => {
      const actions = store.getActions();

      return expect(actions.slice(1, actions.length)).toEqual([
        loadList('test'),
        loadListSuccess('test', {
          items: [{
            id: 1,
          }, {
            id: 2,
          }, {
            id: 3,
          }],
          additional: {
            count: 3,
          },
        }),
      ]);
    }, () => {
      throw new Error('Must resolve');
    });
});

test('should call onBeforeRequest on init', () => {
  const loadItemsSpy = sinon.spy(() => Promise.resolve({
    items: [{
      id: 1,
    }, {
      id: 2,
    }, {
      id: 3,
    }],
    additional: {
      count: 3,
    },
  }));

  const onBeforeRequestSpy = sinon.spy(() => {});

  const Container = reduxFilterlist({
    listId: 'test',
    loadItems: loadItemsSpy,
    onBeforeRequest: onBeforeRequestSpy,
  })(TestChildComponent);

  const store = mockStore({
    reduxFilterlist: {},
  });

  mount(
    <Provider store={store}>
      <Container
        testProperty="testValue"
      />
    </Provider>,
  );

  const listState = store.getState().reduxFilterlist.test;

  return waitForSpyCall(loadItemsSpy)
    .then(() => loadItemsSpy.returnValues[0])
    .then(() => {
      expect(onBeforeRequestSpy.callCount).toEqual(1);
      expect(onBeforeRequestSpy.args[0][0]).toBe(listState);
      expect(onBeforeRequestSpy.args[0][1]).toEqual({
        testProperty: 'testValue',
      });
    }, () => {
      throw new Error('Must resolve');
    });
});

test('should call render of child component only after list state of props change', () => {
  const loadItemsSpy = sinon.spy(() => Promise.resolve({
    items: [{
      id: 1,
    }, {
      id: 2,
    }, {
      id: 3,
    }],
    additional: {
      count: 3,
    },
  }));

  const TestChildComponentSpy = sinon.spy(TestChildComponent);

  const Container = reduxFilterlist({
    listId: 'test',
    loadItems: loadItemsSpy,
  })(TestChildComponentSpy);

  const store = mockStore({
    reduxFilterlist: {},
  });

  const PropsProviderComponent = (props) => (
    <Provider store={store}>
      <Container {...props} />
    </Provider>
  );

  const wrapper = mount(
    <PropsProviderComponent
      testObjProperty={{
        testProperty: 'testValue1',
      }}
    />,
  );

  expect(TestChildComponentSpy.callCount).toEqual(2);

  wrapper.setProps({
    testObjProperty: {
      testProperty: 'testValue1',
    },
  });

  expect(TestChildComponentSpy.callCount).toEqual(2);

  wrapper.setProps({
    testObjProperty: {
      testProperty: 'testValue2',
    },
  });

  expect(TestChildComponentSpy.callCount).toEqual(3);

  return waitForSpyCall(loadItemsSpy)
    .then(() => loadItemsSpy.returnValues[0])
    .then(() => {
      expect(TestChildComponentSpy.callCount).toEqual(4);
    });
});

test('should load items from props', () => {
  const spy = sinon.spy(() => Promise.resolve({
    items: [{
      id: 1,
    }, {
      id: 2,
    }, {
      id: 3,
    }],
    additional: {
      count: 3,
    },
  }));

  const Container = reduxFilterlist({
    listId: 'test',
    loadItems: spy,
  })(TestChildComponent);

  const store = mockStore({
    reduxFilterlist: {},
  });

  const wrapper = mount(
    <Provider store={store}>
      <Container />
    </Provider>,
  );

  return waitForSpyCall(spy)
    .then(() => spy.returnValues[0])
    .then(() => {
      store.clearActions();

      return wrapper.find(TestChildComponent).props().loadItems()
        .then(() => {
          const actions = store.getActions();

          expect(actions).toEqual([
            loadList('test'),
            loadListSuccess('test', {
              items: [{
                id: 1,
              }, {
                id: 2,
              }, {
                id: 3,
              }],
              additional: {
                count: 3,
              },
            }),
          ]);
        }, () => {
          throw new Error('Must resolve');
        });
    }, () => {
      throw new Error('Must resolve');
    });
});

test('should set load error on init', () => {
  const spy = sinon.spy(() => Promise.reject({
    error: 'Error',
    additional: null,
  }));

  const Container = reduxFilterlist({
    listId: 'test',
    loadItems: spy,
  })(TestChildComponent);

  const store = mockStore({
    reduxFilterlist: {},
  });

  mount(
    <Provider store={store}>
      <Container />
    </Provider>,
  );

  return waitForSpyCall(spy)
    .then(() => spy.returnValues[0])
    .then(() => {
      throw new Error('Must reject');
    }, () => {
      const actions = store.getActions();

      expect(actions.slice(1, actions.length)).toEqual([
        loadList('test'),
        loadListError('test', {
          error: 'Error',
          additional: null,
        }),
      ]);
    });
});

test('should set load error calling loadItems from props', () => {
  let callsCount = 0;
  const spy = sinon.spy(() => {
    if (callsCount === 0) {
      ++callsCount;

      return Promise.resolve({
        items: [{
          id: 1,
        }, {
          id: 2,
        }, {
          id: 3,
        }],
        additional: {
          count: 3,
        },
      });
    }

    return Promise.reject({
      error: 'Error',
      additional: null,
    });
  });

  const Container = reduxFilterlist({
    listId: 'test',
    loadItems: spy,
    catchRejects: true,
  })(TestChildComponent);

  const store = mockStore({
    reduxFilterlist: {},
  });

  const wrapper = mount(
    <Provider store={store}>
      <Container />
    </Provider>,
  );

  return waitForSpyCall(spy)
    .then(() => spy.returnValues[0])
    .then(() => {
      store.clearActions();

      return wrapper.find(TestChildComponent).props().loadItems()
        .then(() => {
          throw new Error('Must reject');
        }, () => {
          const actions = store.getActions();

          expect(actions).toEqual([
            loadList('test'),
            loadListError('test', {
              error: 'Error',
              additional: null,
            }),
          ]);
        });
    }, () => {
      throw new Error('Must resolve');
    });
});

test('should set load error calling loadItems from props without catchRejects', () => {
  let callsCount = 0;
  const spy = sinon.spy(() => {
    if (callsCount === 0) {
      ++callsCount;

      return Promise.resolve({
        items: [{
          id: 1,
        }, {
          id: 2,
        }, {
          id: 3,
        }],
        additional: {
          count: 3,
        },
      });
    }

    return Promise.reject({
      error: 'Error',
      additional: null,
    });
  });

  const Container = reduxFilterlist({
    listId: 'test',
    loadItems: spy,
    catchRejects: false,
  })(TestChildComponent);

  const store = mockStore({
    reduxFilterlist: {},
  });

  const wrapper = mount(
    <Provider store={store}>
      <Container />
    </Provider>,
  );

  return waitForSpyCall(spy)
    .then(() => spy.returnValues[0])
    .then(() => {
      store.clearActions();

      return wrapper.find(TestChildComponent).props().loadItems()
        .then(() => {
          const actions = store.getActions();

          expect(actions).toEqual([
            loadList('test'),
            loadListError('test', {
              error: 'Error',
              additional: null,
            }),
          ]);
        }, () => {
          throw new Error('Must resolve');
        });
    }, () => {
      throw new Error('Must resolve');
    });
});

function initTestComponent(listId, loadItems, params) {
  const spy = sinon.spy(loadItems);

  const Container = reduxFilterlist({
    listId,
    loadItems: spy,

    ...params,
  })(TestChildComponent);

  const store = mockStore();

  const wrapper = mount(
    <Provider store={store}>
      <Container />
    </Provider>,
  );

  return waitForSpyCall(spy)
    .then(() => spy.returnValues[0])
    .then(() => {
      store.clearActions();

      return Promise.resolve({
        store,
        child: wrapper.find(TestChildComponent),
      });
    }, () => {
      throw new Error('Must resolve');
    });
}

test('should dispatch setFilterValue from props', () => initTestComponent('test', () => Promise.resolve({
  items: [{
    id: 1,
  }, {
    id: 2,
  }, {
    id: 3,
  }],
  additional: {
    count: 3,
  },
}), {})
    .then(({ child, store }) => {
      child.props().setFilterValue('testFilter', 'testValue');

      expect(store.getActions()[0]).toEqual(
        setFilterValue('test', 'testFilter', 'testValue'),
      );
    }));

test('should apply filter from props', () => initTestComponent('test', () => Promise.resolve({
  items: [{
    id: 1,
  }, {
    id: 2,
  }, {
    id: 3,
  }],
  additional: {
    count: 3,
  },
}), {})
    .then(({ child, store }) => {
      child.props().setFilterValue('testFilter', 'testValue');

      return child.props().applyFilter('testFilter')
        .then(() => {
          const actions = store.getActions();

          expect(actions).toEqual([
            setFilterValue('test', 'testFilter', 'testValue'),
            applyFilter('test', 'testFilter'),
            loadListSuccess('test', {
              items: [{
                id: 1,
              }, {
                id: 2,
              }, {
                id: 3,
              }],
              additional: {
                count: 3,
              },
            }),
          ]);
        }, () => {
          throw new Error('Must resolve');
        });
    }));

test('should set load error calling applyFilter from props', () => {
  let callsCount = 0;
  return initTestComponent('test', () => {
    if (callsCount === 0) {
      ++callsCount;

      return Promise.resolve({
        items: [{
          id: 1,
        }, {
          id: 2,
        }, {
          id: 3,
        }],
        additional: {
          count: 3,
        },
      });
    }

    return Promise.reject({
      error: 'Error',
      additional: null,
    });
  }, {
    catchRejects: true,
  })
    .then(({ child, store }) => {
      child.props().setFilterValue('testFilter', 'testValue');

      return child.props().applyFilter('testFilter')
        .then(() => {
          throw new Error('Must reject');
        }, () => {
          const actions = store.getActions();

          expect(actions).toEqual([
            setFilterValue('test', 'testFilter', 'testValue'),
            applyFilter('test', 'testFilter'),
            loadListError('test', {
              error: 'Error',
              additional: null,
            }),
          ]);
        });
    });
});

test('should set and apply filter from props', () => initTestComponent('test', () => Promise.resolve({
  items: [{
    id: 1,
  }, {
    id: 2,
  }, {
    id: 3,
  }],
  additional: {
    count: 3,
  },
}), {})
    .then(({ child, store }) => child.props().setAndApplyFilter('testFilter', 'testValue')
        .then(() => {
          const actions = store.getActions();

          expect(actions).toEqual([
            setAndApplyFilter('test', 'testFilter', 'testValue'),
            loadListSuccess('test', {
              items: [{
                id: 1,
              }, {
                id: 2,
              }, {
                id: 3,
              }],
              additional: {
                count: 3,
              },
            }),
          ]);
        }, () => {
          throw new Error('Must resolve');
        })));

test('should set load error calling setAndApplyFilter from props', () => {
  let callsCount = 0;
  return initTestComponent('test', () => {
    if (callsCount === 0) {
      ++callsCount;

      return Promise.resolve({
        items: [{
          id: 1,
        }, {
          id: 2,
        }, {
          id: 3,
        }],
        additional: {
          count: 3,
        },
      });
    }

    return Promise.reject({
      error: 'Error',
      additional: null,
    });
  }, {
    catchRejects: true,
  })
    .then(({ child, store }) => child.props().setAndApplyFilter('testFilter', 'testValue')
        .then(() => {
          throw new Error('Must reject');
        }, () => {
          const actions = store.getActions();

          expect(actions).toEqual([
            setAndApplyFilter('test', 'testFilter', 'testValue'),
            loadListError('test', {
              error: 'Error',
              additional: null,
            }),
          ]);
        }));
});

test('should reset filter from props', () => initTestComponent('test', () => Promise.resolve({
  items: [{
    id: 1,
  }, {
    id: 2,
  }, {
    id: 3,
  }],
  additional: {
    count: 3,
  },
}), {})
    .then(({ child, store }) => child.props().resetFilter('testFilter')
        .then(() => {
          const actions = store.getActions();

          expect(actions).toEqual([
            resetFilter('test', 'testFilter'),
            loadListSuccess('test', {
              items: [{
                id: 1,
              }, {
                id: 2,
              }, {
                id: 3,
              }],
              additional: {
                count: 3,
              },
            }),
          ]);
        }, () => {
          throw new Error('Must resolve');
        })));

test('should set load error calling resetFilter from props', () => {
  let callsCount = 0;
  return initTestComponent('test', () => {
    if (callsCount === 0) {
      ++callsCount;

      return Promise.resolve({
        items: [{
          id: 1,
        }, {
          id: 2,
        }, {
          id: 3,
        }],
        additional: {
          count: 3,
        },
      });
    }

    return Promise.reject({
      error: 'Error',
      additional: null,
    });
  }, {
    catchRejects: true,
  })
    .then(({ child, store }) => child.props().resetFilter('testFilter')
        .then(() => {
          throw new Error('Must reject');
        }, () => {
          const actions = store.getActions();

          expect(actions).toEqual([
            resetFilter('test', 'testFilter'),
            loadListError('test', {
              error: 'Error',
              additional: null,
            }),
          ]);
        }));
});

test('should set multiple filters from props', () => initTestComponent('test', () => Promise.resolve({
  items: [{
    id: 1,
  }, {
    id: 2,
  }, {
    id: 3,
  }],
  additional: {
    count: 3,
  },
}), {})
    .then(({ child, store }) => {
      child.props().setFiltersValues({
        filter1: 'value1',
        filter2: 'value2',
      });

      const actions = store.getActions();

      expect(actions).toEqual([
        setFiltersValues('test', {
          filter1: 'value1',
          filter2: 'value2',
        }),
      ]);
    }));

test('should apply multiple filters from props', () => initTestComponent('test', () => Promise.resolve({
  items: [{
    id: 1,
  }, {
    id: 2,
  }, {
    id: 3,
  }],
  additional: {
    count: 3,
  },
}), {})
    .then(({ child, store }) => child.props().applyFilters(['filter1', 'filter2'])
        .then(() => {
          const actions = store.getActions();

          expect(actions).toEqual([
            applyFilters('test', ['filter1', 'filter2']),
            loadListSuccess('test', {
              items: [{
                id: 1,
              }, {
                id: 2,
              }, {
                id: 3,
              }],
              additional: {
                count: 3,
              },
            }),
          ]);
        }, () => {
          throw new Error('Must resolve');
        })));

test('should set load error calling applyFilters from props', () => {
  let callsCount = 0;
  return initTestComponent('test', () => {
    if (callsCount === 0) {
      ++callsCount;

      return Promise.resolve({
        items: [{
          id: 1,
        }, {
          id: 2,
        }, {
          id: 3,
        }],
        additional: {
          count: 3,
        },
      });
    }

    return Promise.reject({
      error: 'Error',
      additional: null,
    });
  }, {
    catchRejects: true,
  })
    .then(({ child, store }) => child.props().applyFilters(['filter1', 'filter2'])
        .then(() => {
          throw new Error('Must reject');
        }, () => {
          const actions = store.getActions();

          expect(actions).toEqual([
            applyFilters('test', ['filter1', 'filter2']),
            loadListError('test', {
              error: 'Error',
              additional: null,
            }),
          ]);
        }));
});

test('should set and apply multiple filters from props', () => initTestComponent('test', () => Promise.resolve({
  items: [{
    id: 1,
  }, {
    id: 2,
  }, {
    id: 3,
  }],
  additional: {
    count: 3,
  },
}), {})
    .then(({ child, store }) => child.props().setAndApplyFilters({
      filter1: 'value1',
      filter2: 'value2',
    })
        .then(() => {
          const actions = store.getActions();

          expect(actions).toEqual([
            setAndApplyFilters('test', {
              filter1: 'value1',
              filter2: 'value2',
            }),
            loadListSuccess('test', {
              items: [{
                id: 1,
              }, {
                id: 2,
              }, {
                id: 3,
              }],
              additional: {
                count: 3,
              },
            }),
          ]);
        }, () => {
          throw new Error('Must resolve');
        })));

test('should set load error calling setAndApplyFilters from props', () => {
  let callsCount = 0;
  return initTestComponent('test', () => {
    if (callsCount === 0) {
      ++callsCount;

      return Promise.resolve({
        items: [{
          id: 1,
        }, {
          id: 2,
        }, {
          id: 3,
        }],
        additional: {
          count: 3,
        },
      });
    }

    return Promise.reject({
      error: 'Error',
      additional: null,
    });
  }, {
    catchRejects: true,
  })
    .then(({ child, store }) => child.props().setAndApplyFilters({
      filter1: 'value1',
      filter2: 'value2',
    })
        .then(() => {
          throw new Error('Must reject');
        }, () => {
          const actions = store.getActions();

          expect(actions).toEqual([
            setAndApplyFilters('test', {
              filter1: 'value1',
              filter2: 'value2',
            }),
            loadListError('test', {
              error: 'Error',
              additional: null,
            }),
          ]);
        }));
});

test('should reset multiple filters from props', () => initTestComponent('test', () => Promise.resolve({
  items: [{
    id: 1,
  }, {
    id: 2,
  }, {
    id: 3,
  }],
  additional: {
    count: 3,
  },
}), {})
    .then(({ child, store }) => child.props().resetFilters(['filter1', 'filter2'])
        .then(() => {
          const actions = store.getActions();

          expect(actions).toEqual([
            resetFilters('test', ['filter1', 'filter2']),
            loadListSuccess('test', {
              items: [{
                id: 1,
              }, {
                id: 2,
              }, {
                id: 3,
              }],
              additional: {
                count: 3,
              },
            }),
          ]);
        }, () => {
          throw new Error('Must resolve');
        })));

test('should set load error calling resetFilters from props', () => {
  let callsCount = 0;
  return initTestComponent('test', () => {
    if (callsCount === 0) {
      ++callsCount;

      return Promise.resolve({
        items: [{
          id: 1,
        }, {
          id: 2,
        }, {
          id: 3,
        }],
        additional: {
          count: 3,
        },
      });
    }

    return Promise.reject({
      error: 'Error',
      additional: null,
    });
  }, {
    catchRejects: true,
  })
    .then(({ child, store }) => child.props().resetFilters(['filter1', 'filter2'])
        .then(() => {
          throw new Error('Must reject');
        }, () => {
          const actions = store.getActions();

          expect(actions).toEqual([
            resetFilters('test', ['filter1', 'filter2']),
            loadListError('test', {
              error: 'Error',
              additional: null,
            }),
          ]);
        }));
});

test('should reset all filters from props', () => initTestComponent('test', () => Promise.resolve({
  items: [{
    id: 1,
  }, {
    id: 2,
  }, {
    id: 3,
  }],
  additional: {
    count: 3,
  },
}), {})
    .then(({ child, store }) => child.props().resetAllFilters()
        .then(() => {
          const actions = store.getActions();

          expect(actions).toEqual([
            resetAllFilters('test'),
            loadListSuccess('test', {
              items: [{
                id: 1,
              }, {
                id: 2,
              }, {
                id: 3,
              }],
              additional: {
                count: 3,
              },
            }),
          ]);
        }, () => {
          throw new Error('Must resolve');
        })));

test('should set load error calling resetAllFilters from props', () => {
  let callsCount = 0;
  return initTestComponent('test', () => {
    if (callsCount === 0) {
      ++callsCount;

      return Promise.resolve({
        items: [{
          id: 1,
        }, {
          id: 2,
        }, {
          id: 3,
        }],
        additional: {
          count: 3,
        },
      });
    }

    return Promise.reject({
      error: 'Error',
      additional: null,
    });
  }, {
    catchRejects: true,
  })
    .then(({ child, store }) => child.props().resetAllFilters()
        .then(() => {
          throw new Error('Must reject');
        }, () => {
          const actions = store.getActions();

          expect(actions).toEqual([
            resetAllFilters('test'),
            loadListError('test', {
              error: 'Error',
              additional: null,
            }),
          ]);
        }));
});

test('should call loadItemsSuccess once', () => initTestComponent('test', () => Promise.resolve({
  items: [{
    id: 1,
  }, {
    id: 2,
  }, {
    id: 3,
  }],
  additional: {
    count: 3,
  },
}), {})
    .then(({ child, store }) => Promise.all([
      child.props().loadItems().catch(() => {}),
      child.props().loadItems(),
    ])
        .then(() => {
          const actions = store.getActions();

          expect(actions).toEqual([
            loadList('test'),
            loadList('test'),
            loadListSuccess('test', {
              items: [{
                id: 1,
              }, {
                id: 2,
              }, {
                id: 3,
              }],
              additional: {
                count: 3,
              },
            }),
          ]);
        }, () => {
          throw new Error('Must resolve');
        })));

test('should set sorting from props', () => initTestComponent('test', () => Promise.resolve({
  items: [{
    id: 1,
  }, {
    id: 2,
  }, {
    id: 3,
  }],
  additional: {
    count: 3,
  },
}), {})
    .then(({ child, store }) => child.props().setSorting('id', true)
        .then(() => {
          const actions = store.getActions();

          expect(actions).toEqual([
            setSorting('test', 'id', true),
            loadListSuccess('test', {
              items: [{
                id: 1,
              }, {
                id: 2,
              }, {
                id: 3,
              }],
              additional: {
                count: 3,
              },
            }),
          ]);
        }, () => {
          throw new Error('Must resolve');
        })));

test('should set load error calling setSorting from props', () => {
  let callsCount = 0;
  return initTestComponent('test', () => {
    if (callsCount === 0) {
      ++callsCount;

      return Promise.resolve({
        items: [{
          id: 1,
        }, {
          id: 2,
        }, {
          id: 3,
        }],
        additional: {
          count: 3,
        },
      });
    }

    return Promise.reject({
      error: 'Error',
      additional: null,
    });
  }, {
    catchRejects: true,
  })
    .then(({ child, store }) => child.props().setSorting('id', true)
        .then(() => {
          throw new Error('Must reject');
        }, () => {
          const actions = store.getActions();

          expect(actions).toEqual([
            setSorting('test', 'id', true),
            loadListError('test', {
              error: 'Error',
              additional: null,
            }),
          ]);
        }));
});

test('should reset sorting from props', () => initTestComponent('test', () => Promise.resolve({
  items: [{
    id: 1,
  }, {
    id: 2,
  }, {
    id: 3,
  }],
  additional: {
    count: 3,
  },
}), {})
    .then(({ child, store }) => child.props().resetSorting()
        .then(() => {
          const actions = store.getActions();

          expect(actions).toEqual([
            resetSorting('test'),
            loadListSuccess('test', {
              items: [{
                id: 1,
              }, {
                id: 2,
              }, {
                id: 3,
              }],
              additional: {
                count: 3,
              },
            }),
          ]);
        }, () => {
          throw new Error('Must resolve');
        })));

test('should set load error calling resetSorting from props', () => {
  let callsCount = 0;
  return initTestComponent('test', () => {
    if (callsCount === 0) {
      ++callsCount;

      return Promise.resolve({
        items: [{
          id: 1,
        }, {
          id: 2,
        }, {
          id: 3,
        }],
        additional: {
          count: 3,
        },
      });
    }

    return Promise.reject({
      error: 'Error',
      additional: null,
    });
  }, {
    catchRejects: true,
  })
    .then(({ child, store }) => child.props().resetSorting()
        .then(() => {
          throw new Error('Must reject');
        }, () => {
          const actions = store.getActions();

          expect(actions).toEqual([
            resetSorting('test'),
            loadListError('test', {
              error: 'Error',
              additional: null,
            }),
          ]);
        }));
});

test('should insert item to list from props', () => initTestComponent('test', () => Promise.resolve({
  items: [{
    id: 1,
  }, {
    id: 2,
  }, {
    id: 3,
  }],
  additional: {
    count: 3,
  },
}), {})
  .then(({ child, store }) => {
    child.props().insertItem(1, {
      id: 4,
    }, {
      additional: 4,
    });

    const actions = store.getActions();

    expect(actions).toEqual([
      insertItem('test', 1, {
        id: 4,
      }, {
        additional: 4,
      }),
    ]);
  }, () => {
    throw new Error('Must resolve');
  }));

test('should delete list item from props', () => initTestComponent('test', () => Promise.resolve({
  items: [{
    id: 1,
  }, {
    id: 2,
  }, {
    id: 3,
  }],
  additional: {
    count: 3,
  },
}), {})
  .then(({ child, store }) => {
    child.props().deleteItem(1, {
      additional: 2,
    });

    const actions = store.getActions();

    expect(actions).toEqual([
      deleteItem('test', 1, {
        additional: 2,
      }),
    ]);
  }, () => {
    throw new Error('Must resolve');
  }));

test('should update list item from props', () => initTestComponent('test', () => Promise.resolve({
  items: [{
    id: 1,
  }, {
    id: 2,
  }, {
    id: 3,
  }],
  additional: {
    count: 3,
  },
}), {})
  .then(({ child, store }) => {
    child.props().updateItem(1, {
      id: 10,
    }, {
      additional: 2,
    });

    const actions = store.getActions();

    expect(actions).toEqual([
      updateItem('test', 1, {
        id: 10,
      }, {
        additional: 2,
      }),
    ]);
  }, () => {
    throw new Error('Must resolve');
  }));
