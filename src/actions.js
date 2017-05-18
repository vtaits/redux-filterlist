import {
  REGISTER_LIST,
  DESTROY_LIST,

  LOAD_LIST,
  LOAD_LIST_SUCCESS,
  LOAD_LIST_ERROR,

  SET_FILTER_VALUE,
} from './actionsTypes'

export function registerList(listId, params = {}) {
  return {
    type: REGISTER_LIST,
    payload: {
      listId,
      params,
    },
  }
}

export function destroyList(listId) {
  return {
    type: DESTROY_LIST,
    payload: {
      listId,
    },
  }
}

export function loadList(listId) {
  return {
    type: LOAD_LIST,
    payload: {
      listId,
    },
  }
}

export function loadListSuccess(listId, response) {
  if (!response) {
    throw new Error('Response is required')
  }

  if (!response.items) {
    throw new Error('Response items is required')
  }

  if (!(response.items instanceof Array)) {
    throw new Error('Response items should be array')
  }

  return {
    type: LOAD_LIST_SUCCESS,
    payload: {
      listId,
      response,
    },
  }
}

export function loadListError(listId, response) {
  return {
    type: LOAD_LIST_ERROR,
    payload: {
      listId,
      response,
    },
  }
}

export function setFilterValue(listId, filterName, value) {
  if (!filterName) {
    throw new Error('Filter name is required')
  }

  return {
    type: SET_FILTER_VALUE,
    payload: {
      listId,
      filterName,
      value,
    },
  }
}
