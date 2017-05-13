import {
  REGISTER_LIST,
  DESTROY_LIST,

  LOAD_LIST,
  LOAD_LIST_SUCCESS,
  LOAD_LIST_ERROR,
} from './actionsTypes'

export function registerList(listId, params) {
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
