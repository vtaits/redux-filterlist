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
  SET_AND_APPLY_FILTERS,
  RESET_FILTERS,

  RESET_ALL_FILTERS,

  SET_SORTING,
} from './actionsTypes'

import collectListInitialState from './collectListInitialState'

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
    items: [],
    requestId: listState.requestId + 1,
  }
}

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
        requestId: listState.requestId + 1,
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
      return ((intermediateListState) => ({
        ...intermediateListState,
        appliedFilters: {
          ...intermediateListState.appliedFilters,
          [payload.filterName]: listState.filters[payload.filterName],
        },
      }))(getListStateBeforeChangeFiltes(listState))

    case SET_AND_APPLY_FILTER:
      return ((intermediateListState) => ({
        ...intermediateListState,
        filters: {
          ...intermediateListState.filters,
          [payload.filterName]: payload.value,
        },
        appliedFilters: {
          ...intermediateListState.appliedFilters,
          [payload.filterName]: payload.value,
        },
      }))(getListStateBeforeChangeFiltes(listState))

    case RESET_FILTER:
      return ((intermediateListState) => ({
        ...intermediateListState,
        filters: {
          ...intermediateListState.filters,
          [payload.filterName]: listState.initialFilters[payload.filterName],
        },
        appliedFilters: {
          ...intermediateListState.appliedFilters,
          [payload.filterName]: listState.initialFilters[payload.filterName],
        },
      }))(getListStateBeforeChangeFiltes(listState))

    case SET_FILTERS_VALUES:
      return {
        ...listState,
        filters: {
          ...listState.filters,
          ...payload.values,
        },
      }

    case APPLY_FILTERS:
      return ((intermediateListState) => ({
        ...intermediateListState,
        appliedFilters: {
          ...intermediateListState.appliedFilters,
          ...payload.filtersNames
            .reduce((res, filterName) => {
              res[filterName] = listState.filters[filterName]

              return res
            }, {}),
        },
      }))(getListStateBeforeChangeFiltes(listState))

    case SET_AND_APPLY_FILTERS:
      return ((intermediateListState) => ({
        ...intermediateListState,
        filters: {
          ...intermediateListState.filters,
          ...payload.values,
        },
        appliedFilters: {
          ...intermediateListState.appliedFilters,
          ...payload.values,
        },
      }))(getListStateBeforeChangeFiltes(listState))

    case RESET_FILTERS:
      return ((intermediateListState) => ({
        ...intermediateListState,
        filters: {
          ...intermediateListState.filters,
          ...payload.filtersNames
            .reduce((res, filterName) => {
              res[filterName] = listState.initialFilters[filterName]

              return res
            }, {}),
        },
        appliedFilters: {
          ...intermediateListState.appliedFilters,
          ...payload.filtersNames
            .reduce((res, filterName) => {
              res[filterName] = listState.initialFilters[filterName]

              return res
            }, {}),
        },
      }))(getListStateBeforeChangeFiltes(listState))

    case RESET_ALL_FILTERS:
      return ((intermediateListState) => ({
        ...intermediateListState,
        filters: {
          ...listState.alwaysResetFilters,
          ...listState.initialFilters,
        },
        appliedFilters: {
          ...listState.alwaysResetFilters,
          ...listState.initialFilters,
        },
      }))(getListStateBeforeChangeFiltes(listState))

    case SET_SORTING:
      return ((intermediateListState) => ({
        ...intermediateListState,
        sort: {
          param: payload.param,
          asc: typeof payload.asc === 'undefined' ?
            (
              listState.sort.param === payload.param ?
                !listState.sort.asc :
                listState.isDefaultSortAsc
            ) :
            payload.asc,
        },
      }))(getListStateBeforeChangeFiltes(listState))

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
  SET_AND_APPLY_FILTERS,
  RESET_FILTERS,
  RESET_ALL_FILTERS,
  SET_SORTING,
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
