import {
  REGISTER_LIST,
  DESTROY_LIST,

  CHANGE_LIST_STATE,

  LOAD_LIST_SUCCESS,
  LOAD_LIST_ERROR,

  INSERT_ITEM,
  DELETE_ITEM,
  UPDATE_ITEM,
} from './actionsTypes';

const acceptedListParams = [
  'autoload',
  'sort',
  'isDefaultSortAsc',
  'alwaysResetFilters',
  'additional',
  'initialFilters',
  'filters',
  'appliedFilters',
  'saveFiltersOnResetAll',
  'saveItemsWhileLoad',
];

export function registerList(listId, reduxFilterlistParams, componentProps) {
  const params = acceptedListParams.reduce((res, paramName) => {
    const paramValue = reduxFilterlistParams[paramName];

    if (typeof paramValue !== 'undefined') {
      res[paramName] = paramValue;
    }

    return res;
  }, {});

  if (reduxFilterlistParams.getStateFromProps) {
    const {
      appliedFilters,
      sort,
    } = reduxFilterlistParams.getStateFromProps(componentProps);

    if (appliedFilters) {
      params.appliedFilters = appliedFilters;
    }

    if (sort) {
      params.sort = sort;
    }
  }

  return {
    type: REGISTER_LIST,
    payload: {
      listId,
      params,
    },
  };
}

export function destroyList(listId) {
  return {
    type: DESTROY_LIST,
    payload: {
      listId,
    },
  };
}

export function changeListState(listId, nextListState, actionType) {
  return {
    type: CHANGE_LIST_STATE,

    payload: {
      listId,
      nextListState,
    },

    meta: {
      actionType,
    },
  };
}

export function loadListSuccess(listId, response, requestId) {
  if (!response) {
    throw new Error('Response is required');
  }

  if (!response.items) {
    throw new Error('Response items is required');
  }

  if (!(response.items instanceof Array)) {
    throw new Error('Response items should be array');
  }

  return {
    type: LOAD_LIST_SUCCESS,
    payload: {
      listId,
      response,
      requestId,
    },
  };
}

export function loadListError(listId, response, requestId) {
  return {
    type: LOAD_LIST_ERROR,
    payload: {
      listId,
      response,
      requestId,
    },
  };
}

export function insertItem(listId, itemIndex, item, additional) {
  return {
    type: INSERT_ITEM,
    payload: {
      listId,
      itemIndex,
      item,
      additional,
    },
  };
}

export function deleteItem(listId, itemIndex, additional) {
  return {
    type: DELETE_ITEM,
    payload: {
      listId,
      itemIndex,
      additional,
    },
  };
}

export function updateItem(listId, itemIndex, item, additional) {
  return {
    type: UPDATE_ITEM,
    payload: {
      listId,
      itemIndex,
      item,
      additional,
    },
  };
}
