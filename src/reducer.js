import arrayInsert from 'array-insert';

import {
  REGISTER_LIST,
  DESTROY_LIST,

  LOAD_LIST,
  LOAD_LIST_SUCCESS,
  LOAD_LIST_ERROR,

  SET_STATE_FROM_PROPS,

  SET_FILTER_VALUE,
  APPLY_FILTER,
  SET_AND_APPLY_FILTER,
  RESET_FILTER,

  SET_FILTERS_VALUES,
  APPLY_FILTERS,
  SET_AND_APPLY_FILTERS,
  RESET_FILTERS,

  RESET_ALL_FILTERS,

  SET_SORTING,
  RESET_SORTING,

  INSERT_ITEM,
  DELETE_ITEM,
  UPDATE_ITEM,
} from './actionsTypes';

import collectListInitialState from './collectListInitialState';

function getListStateBeforeChangeFiltes(listState) {
  return {
    ...listState,
    filters: {
      ...listState.filters,
      ...listState.alwaysResetFilters,
    },
    appliedFilters: {
      ...listState.appliedFilters,
      ...listState.alwaysResetFilters,
    },
    loading: true,
    error: null,
    items: listState.saveItemsWhileLoad ? listState.items : [],
    shouldClean: true,
    requestId: listState.requestId + 1,
  };
}

function listReducer(listState, { type, payload }) {
  switch (type) {
    case REGISTER_LIST:
      if (listState) {
        return listState;
      }

      return collectListInitialState(payload.params);

    case LOAD_LIST:
      return {
        ...listState,
        loading: true,
        error: null,
        shouldClean: false,
        requestId: listState.requestId + 1,
      };

    case LOAD_LIST_SUCCESS:
      return {
        ...listState,
        loading: false,

        items: (listState.saveItemsWhileLoad && listState.shouldClean) ?
          payload.response.items :
          listState.items.concat(payload.response.items),

        additional: typeof payload.response.additional !== 'undefined' ?
          payload.response.additional :
          listState.additional,

        shouldClean: false,
      };

    case LOAD_LIST_ERROR:
      return {
        ...listState,
        loading: false,
        error: (payload.response && typeof payload.response.error !== 'undefined') ?
          payload.response.error :
          null,
        additional: (payload.response && typeof payload.response.additional !== 'undefined') ?
          payload.response.additional :
          listState.additional,

        shouldClean: false,
      };

    case SET_STATE_FROM_PROPS:
    {
      const resState = getListStateBeforeChangeFiltes(listState);

      if (payload.appliedFilters) {
        resState.filters = {
          ...resState.filters,
          ...payload.appliedFilters,
        };

        resState.appliedFilters = {
          ...resState.appliedFilters,
          ...payload.appliedFilters,
        };
      }

      if (payload.sort) {
        resState.sort = {
          ...resState.sort,
          ...payload.sort,
        };
      }

      return resState;
    }

    case SET_FILTER_VALUE:
      return {
        ...listState,
        filters: {
          ...listState.filters,
          [payload.filterName]: payload.value,
        },
      };

    case APPLY_FILTER:
      return (intermediateListState => ({
        ...intermediateListState,
        appliedFilters: {
          ...intermediateListState.appliedFilters,
          [payload.filterName]: listState.filters[payload.filterName],
        },
      }))(getListStateBeforeChangeFiltes(listState));

    case SET_AND_APPLY_FILTER:
      return (intermediateListState => ({
        ...intermediateListState,
        filters: {
          ...intermediateListState.filters,
          [payload.filterName]: payload.value,
        },
        appliedFilters: {
          ...intermediateListState.appliedFilters,
          [payload.filterName]: payload.value,
        },
      }))(getListStateBeforeChangeFiltes(listState));

    case RESET_FILTER:
      return (intermediateListState => ({
        ...intermediateListState,
        filters: {
          ...intermediateListState.filters,
          [payload.filterName]: listState.initialFilters[payload.filterName],
        },
        appliedFilters: {
          ...intermediateListState.appliedFilters,
          [payload.filterName]: listState.initialFilters[payload.filterName],
        },
      }))(getListStateBeforeChangeFiltes(listState));

    case SET_FILTERS_VALUES:
      return {
        ...listState,
        filters: {
          ...listState.filters,
          ...payload.values,
        },
      };

    case APPLY_FILTERS:
      return (intermediateListState => ({
        ...intermediateListState,
        appliedFilters: {
          ...intermediateListState.appliedFilters,
          ...payload.filtersNames
            .reduce((res, filterName) => {
              res[filterName] = listState.filters[filterName];

              return res;
            }, {}),
        },
      }))(getListStateBeforeChangeFiltes(listState));

    case SET_AND_APPLY_FILTERS:
      return (intermediateListState => ({
        ...intermediateListState,
        filters: {
          ...intermediateListState.filters,
          ...payload.values,
        },
        appliedFilters: {
          ...intermediateListState.appliedFilters,
          ...payload.values,
        },
      }))(getListStateBeforeChangeFiltes(listState));

    case RESET_FILTERS:
      return (intermediateListState => ({
        ...intermediateListState,
        filters: {
          ...intermediateListState.filters,
          ...payload.filtersNames
            .reduce((res, filterName) => {
              res[filterName] = listState.initialFilters[filterName];

              return res;
            }, {}),
        },
        appliedFilters: {
          ...intermediateListState.appliedFilters,
          ...payload.filtersNames
            .reduce((res, filterName) => {
              res[filterName] = listState.initialFilters[filterName];

              return res;
            }, {}),
        },
      }))(getListStateBeforeChangeFiltes(listState));

    case RESET_ALL_FILTERS:
      return (intermediateListState => ({
        ...intermediateListState,
        filters: {
          ...listState.alwaysResetFilters,
          ...listState.initialFilters,
          ...listState.saveFiltersOnResetAll
            .reduce((res, filterName) => {
              res[filterName] = listState.filters[filterName];

              return res;
            }, {}),
        },
        appliedFilters: {
          ...listState.alwaysResetFilters,
          ...listState.initialFilters,
          ...listState.saveFiltersOnResetAll
            .reduce((res, filterName) => {
              res[filterName] = listState.appliedFilters[filterName];

              return res;
            }, {}),
        },
      }))(getListStateBeforeChangeFiltes(listState));

    case SET_SORTING:
      return (intermediateListState => ({
        ...intermediateListState,
        sort: {
          param: payload.param,
          asc: payload.asc === null ?
            (
              listState.sort.param === payload.param ?
                !listState.sort.asc :
                listState.isDefaultSortAsc
            ) :
            payload.asc,
        },
      }))(getListStateBeforeChangeFiltes(listState));

    case RESET_SORTING:
      return (intermediateListState => ({
        ...intermediateListState,
        sort: {
          param: null,
          asc: listState.isDefaultSortAsc,
        },
      }))(getListStateBeforeChangeFiltes(listState));

    case INSERT_ITEM:
      return {
        ...listState,

        items: arrayInsert(listState.items, payload.itemIndex, payload.item),

        additional: typeof payload.additional !== 'undefined' ?
          payload.additional :
          listState.additional,
      };

    case DELETE_ITEM:
      return {
        ...listState,

        items: listState.items
          .filter((item, index) => index !== payload.itemIndex),

        additional: typeof payload.additional !== 'undefined' ?
          payload.additional :
          listState.additional,
      };

    case UPDATE_ITEM:
      return {
        ...listState,

        items: listState.items
          .map((item, index) => {
            if (index === payload.itemIndex) {
              return payload.item;
            }

            return item;
          }),

        additional: typeof payload.additional !== 'undefined' ?
          payload.additional :
          listState.additional,
      };

    default:
      return listState;
  }
}

const listsActions = [
  REGISTER_LIST,
  LOAD_LIST,
  LOAD_LIST_SUCCESS,
  LOAD_LIST_ERROR,
  SET_STATE_FROM_PROPS,
  SET_FILTER_VALUE,
  APPLY_FILTER,
  SET_AND_APPLY_FILTER,
  RESET_FILTER,
  SET_FILTERS_VALUES,
  APPLY_FILTERS,
  SET_AND_APPLY_FILTERS,
  RESET_FILTERS,
  RESET_ALL_FILTERS,
  SET_SORTING,
  RESET_SORTING,
  INSERT_ITEM,
  DELETE_ITEM,
  UPDATE_ITEM,
];

function rootReducer(state = {}, action) {
  const {
    type,
    payload,
  } = action;

  if (listsActions.includes(type)) {
    const currentState = state[payload.listId];

    if (!currentState && type !== REGISTER_LIST) {
      return state;
    }

    return {
      ...state,
      [payload.listId]: listReducer(state[payload.listId], action),
    };
  }

  switch (type) {
    case DESTROY_LIST:
    {
      const listIdStr = payload.listId.toString();

      return Object.keys(state)
        .reduce((res, listId) => {
          if (listIdStr === listId) {
            return res;
          }

          res[listId] = state[listId];

          return res;
        }, {});
    }

    default:
      return state;
  }
}

function pluginReducer(plugin, state, action) {
  const intermediateState = rootReducer(state, action);

  return Object.keys(plugin)
    .reduce((res, listId) => {
      if (intermediateState[listId]) {
        res[listId] = plugin[listId](intermediateState[listId], action);
      }

      return res;
    }, {
      ...intermediateState,
    });
}

export default function reducerWithPlugin(state, action) {
  return rootReducer(state, action);
}

reducerWithPlugin.plugin = (plugin) => {
  if (typeof plugin !== 'object') {
    throw new Error('Reducer plugin should be an obeject');
  }

  if (plugin === null) {
    throw new Error('Reducer plugin can\'t be null');
  }

  return pluginReducer.bind(null, plugin);
};
