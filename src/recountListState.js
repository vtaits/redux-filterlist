import shouldSetLoadingState from './shouldSetLoadingState';

export default function recountListState(listState, mapperResult) {
  const isLoadingState = shouldSetLoadingState(mapperResult);

  const newFilters = (mapperResult && mapperResult.filters) ||
    listState.filters;

  const newAppliedFilters = (mapperResult && mapperResult.appliedFilters) ||
    listState.appliedFilters;

  const newSort = (mapperResult && mapperResult.sort) || listState.sort;

  if (isLoadingState) {
    return {
      ...listState,

      filters: newFilters,
      appliedFilters: newAppliedFilters,
      sort: newSort,

      loading: true,
      error: null,

      items: mapperResult ?
        (listState.saveItemsWhileLoad ? listState.items : []) :
        listState.items,

      shouldClean: !!mapperResult,
      requestId: listState.requestId + 1,
    };
  }

  return {
    ...listState,

    filters: newFilters,
    appliedFilters: newAppliedFilters,
    sort: newSort,
  };
}
