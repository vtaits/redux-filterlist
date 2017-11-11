const listInitialState = {
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
  catchRejects: false,
  requestId: 0,
};

export default listInitialState;
