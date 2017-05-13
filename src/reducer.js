import {
  REGISTER_LIST,
  DESTROY_LIST,

  LOAD_LIST,
  LOAD_LIST_SUCCESS,
  LOAD_LIST_ERROR,
} from './actionsTypes'

import listInitialState from './listInitialState'

function listReducer(listState = listInitialState, { type, payload }) {
  switch (type) {
    case REGISTER_LIST:
      return {
        ...listState,
        sort: payload.params.sort || listInitialState.sort,
        filters: payload.params.filters || listInitialState.filters,
        appliedFilters: payload.params.appliedFilters ||
          listInitialState.appliedFilters,
      }

    case LOAD_LIST:
      return {
        ...listState,
        loading: true,
      }

    case LOAD_LIST_SUCCESS:
      return {
        ...listState,
        loading: false,
        items: listState.items
          .concat(payload.response.items),
        additional: payload.response.hasOwnProperty('additional') ?
          payload.response.additional :
          listState.additional,
      }

    case LOAD_LIST_ERROR:
      return {
        ...listState,
        loading: false,
      }

    default:
      return listState
  }
}

const listsActions = [
  REGISTER_LIST,
  LOAD_LIST,
  LOAD_LIST_SUCCESS,
  LOAD_LIST_ERROR,
]

export default function rootReducer(state = {}, action) {
  const {
    type,
    payload,
  } = action

  if (listsActions.includes(type)) {
    return {
      ...state,
      [payload.listId]: listReducer(state[payload.listId], action),
    }
  }

  switch (type) {
    case DESTROY_LIST:
      return (({
        [payload.listId]: listForRemove,
        ...lists,
      }) => lists)(state)

    default:
      return state
  }
}
