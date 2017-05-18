import listInitialState from './listInitialState'

export default function collectListInitialState(params) {
  return {
    ...listInitialState,
    sort: params.sort || listInitialState.sort,
    initialFilters: params.initialFilters || listInitialState.initialFilters,
    filters: params.appliedFilters || listInitialState.filters,
    appliedFilters: params.appliedFilters ||
      listInitialState.appliedFilters,
  }
}
