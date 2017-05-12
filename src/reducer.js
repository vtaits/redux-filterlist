import {
  REGISTER_FILTERLIST,
  DESTROY_FILTERLIST,
} from './actionsTypes'

const listInitialState = {
  sort: {
    param: null,
    asc: true,
  },
  filters: {},
  appliedFilters: {},
  loading: false,
  items: [],
}

function listReducer(listState = listInitialState, { type, payload }) {
  switch (type) {
    case REGISTER_FILTERLIST:
      return {
        ...listState,
        sort: payload.params.sort || listInitialState.sort,
      }

    default:
      return listState
  }
}

const listsActions = [
  REGISTER_FILTERLIST,
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
    case DESTROY_FILTERLIST:
      return (({
        [payload.listId]: listForRemove,
        ...lists,
      }) => lists)(state)

    default:
      return state
  }
}
