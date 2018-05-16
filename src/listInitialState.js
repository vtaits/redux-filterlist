const listInitialState = {
  autoload: true,
  sort: {
    param: null,
    asc: true,
  },
  isDefaultSortAsc: true,
  alwaysResetFilters: {},
  initialFilters: {},
  filters: {},
  appliedFilters: {},
  saveFiltersOnResetAll: [],
  saveItemsWhileLoad: false,
  loading: false,
  items: [],
  additional: null,
  error: null,
  shouldClean: false,
  requestId: 0,
};

export default listInitialState;
