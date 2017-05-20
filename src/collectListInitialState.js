import listInitialState from './listInitialState'

export default function collectListInitialState(params) {
  return {
    ...listInitialState,
    sort: params.sort || listInitialState.sort,
    isDefaultSortAsc: params.hasOwnProperty('isDefaultSortAsc') ?
      params.isDefaultSortAsc :
      listInitialState.isDefaultSortAsc,
    alwaysResetFilters: params.alwaysResetFilters ||
      listInitialState.alwaysResetFilters,
    initialFilters: params.initialFilters || listInitialState.initialFilters,
    filters: params.appliedFilters || listInitialState.filters,
    appliedFilters: params.appliedFilters ||
      listInitialState.appliedFilters,
    catchRejects: params.catchRejects || listInitialState.catchRejects,
  }
}
