import listInitialState from './listInitialState';

export default function collectListInitialState(rawParams, componentProps) {
  const params = {
    ...rawParams,
  };

  if (rawParams.getStateFromProps) {
    const {
      appliedFilters,
      sort,
    } = rawParams.getStateFromProps(componentProps);

    if (appliedFilters) {
      params.appliedFilters = appliedFilters;
    }

    if (sort) {
      params.sort = sort;
    }
  }

  return {
    ...listInitialState,

    /* eslint-disable no-prototype-builtins */
    autoload: params.hasOwnProperty('autoload') ?
      params.autoload :
      listInitialState.autoload,

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
    saveItemsWhileLoad: params.saveItemsWhileLoad ||
      listInitialState.saveItemsWhileLoad,
  };
}
