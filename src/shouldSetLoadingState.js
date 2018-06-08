export default function shouldSetLoadingState(mapperResult) {
  return !mapperResult ||
    !!mapperResult.appliedFilters ||
    !!mapperResult.sort;
}
