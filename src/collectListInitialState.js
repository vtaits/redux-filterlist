import listInitialState from './listInitialState';

export default function collectListInitialState(params) {
  return {
    ...listInitialState,
    sort: params.sort || listInitialState.sort,
    /* eslint-disable no-prototype-builtins */
    isDefaultSortAsc: params.hasOwnProperty('isDefaultSortAsc') ?
      params.isDefaultSortAsc :
      listInitialState.isDefaultSortAsc,
    /* eslint-enable no-prototype-builtins */
    alwaysResetFilters: params.alwaysResetFilters ||
      listInitialState.alwaysResetFilters,

    /* eslint-disable no-prototype-builtins */
    additional: params.hasOwnProperty('additional') ?
      params.additional :
      listInitialState.additional,
    /* eslint-enable no-prototype-builtins */

    initialFilters: params.initialFilters || listInitialState.initialFilters,
    filters: params.appliedFilters || listInitialState.filters,
    appliedFilters: params.appliedFilters ||
      listInitialState.appliedFilters,
    saveFiltersOnResetAll: params.saveFiltersOnResetAll ||
      listInitialState.saveFiltersOnResetAll,
    catchRejects: params.catchRejects || listInitialState.catchRejects,
  };
}
