import {
  REGISTER_LIST,
  DESTROY_LIST,

  LOAD_LIST,
  LOAD_LIST_SUCCESS,
  LOAD_LIST_ERROR,

  SET_FILTER_VALUE,
  APPLY_FILTER,
  SET_AND_APPLY_FILTER,
  RESET_FILTER,

  SET_FILTERS_VALUES,
  APPLY_FILTERS,
} from './actionsTypes'

import collectListInitialState from './collectListInitialState'

function listReducer(listState, { type, payload }) {
  switch (type) {
    case REGISTER_LIST:
      if (listState) {
        throw new Error(`List with id "${ payload.listId }" is already registered`)
      }

      return collectListInitialState(payload.params)

    case LOAD_LIST:
      return {
        ...listState,
        loading: true,
        error: null,
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
        error: (payload.response && payload.response.hasOwnProperty('error')) ?
          payload.response.error :
          null,
        additional: (payload.response && payload.response.hasOwnProperty('additional')) ?
          payload.response.additional :
          listState.additional,
      }

    case SET_FILTER_VALUE:
      return {
        ...listState,
        filters: {
          ...listState.filters,
          [payload.filterName]: payload.value,
        },
      }

    case APPLY_FILTER:
      return {
        ...listState,
        appliedFilters: {
          ...listState.appliedFilters,
          [payload.filterName]: listState.filters[payload.filterName],
        },
        loading: true,
        error: null,
        items: [],
      }

    case SET_AND_APPLY_FILTER:
      return {
        ...listState,
        filters: {
          ...listState.filters,
          [payload.filterName]: payload.value,
        },
        appliedFilters: {
          ...listState.appliedFilters,
          [payload.filterName]: payload.value,
        },
        loading: true,
        error: null,
        items: [],
      }

    case RESET_FILTER:
      return {
        ...listState,
        filters: {
          ...listState.filters,
          [payload.filterName]: listState.initialFilters[payload.filterName],
        },
        appliedFilters: {
          ...listState.appliedFilters,
          [payload.filterName]: listState.initialFilters[payload.filterName],
        },
        loading: true,
        error: null,
        items: [],
      }

    case SET_FILTERS_VALUES:
      return {
        ...listState,
        filters: {
          ...listState.filters,
          ...payload.values,
        },
      }

    case APPLY_FILTERS:
      return {
        ...listState,
        appliedFilters: {
          ...listState.appliedFilters,
          ...payload.filtersNames
            .reduce((res, filterName) => {
              res[filterName] = listState.filters[filterName]

              return res
            }, {}),
        },
        loading: true,
        error: null,
        items: [],
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
  SET_FILTER_VALUE,
  APPLY_FILTER,
  SET_AND_APPLY_FILTER,
  RESET_FILTER,
  SET_FILTERS_VALUES,
  APPLY_FILTERS,
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
      return ((state) => {
        const listIdStr = payload.listId.toString()

        return Object.keys(state)
          .reduce((res, listId) => {
            if (listIdStr === listId) {
              return res
            }

            res[listId] = state[listId]

            return res
          }, {})
      })(state)

    default:
      return state
  }
}
