import {
  REGISTER_FILTERLIST,
  DESTROY_FILTERLIST,
} from './actionsTypes'

export function registerList(listId, params) {
  return {
    type: REGISTER_FILTERLIST,
    payload: {
      listId,
      params,
    }
  }
}

export function destroyList(listId) {
  return {
    type: DESTROY_FILTERLIST,
    payload: {
      listId,
    }
  }
}
