export default function recountListStateBeforRequest(listState, mapperResult) {
  return {
    ...listState,

    filters: (mapperResult && mapperResult.filters) ||
      listState.filters,

    appliedFilters: (mapperResult && mapperResult.appliedFilters) ||
      listState.appliedFilters,

    sort: (mapperResult && mapperResult.sort) || listState.sort,

    loading: true,
    error: null,

    items: mapperResult ?
      (listState.saveItemsWhileLoad ? listState.items : []) :
      listState.items,

    shouldClean: !!mapperResult,
    requestId: listState.requestId + 1,
  };
}
