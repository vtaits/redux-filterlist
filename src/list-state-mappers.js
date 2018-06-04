export function setFilterValue(listState, filterName, value) {
  return {
    filters: {
      ...listState.filters,
      [filterName]: value,
    },

    appliedFilters: null,
    sort: null,
  };
}

export function applyFilter(listState, filterName) {
  return {
    filters: {
      ...listState.filters,
      ...listState.alwaysResetFilters,
    },

    appliedFilters: {
      ...listState.appliedFilters,
      ...listState.alwaysResetFilters,
      [filterName]: listState.filters[filterName],
    },

    sort: null,
  };
}

export function setAndApplyFilter(listState, filterName, value) {
  return {
    filters: {
      ...listState.filters,
      ...listState.alwaysResetFilters,
      [filterName]: value,
    },

    appliedFilters: {
      ...listState.appliedFilters,
      ...listState.alwaysResetFilters,
      [filterName]: value,
    },

    sort: null,
  };
}

export function resetFilter(listState, filterName) {
  return {
    filters: {
      ...listState.filters,
      ...listState.alwaysResetFilters,
      [filterName]: listState.initialFilters[filterName],
    },

    appliedFilters: {
      ...listState.appliedFilters,
      ...listState.alwaysResetFilters,
      [filterName]: listState.initialFilters[filterName],
    },

    sort: null,
  };
}

export function setFiltersValues(listState, values) {
  return {
    filters: {
      ...listState.filters,
      ...values,
    },

    appliedFilters: null,
    sort: null,
  };
}

export function applyFilters(listState, filtersNames) {
  return {
    filters: {
      ...listState.filters,
      ...listState.alwaysResetFilters,
    },

    appliedFilters: {
      ...listState.appliedFilters,
      ...listState.alwaysResetFilters,
      ...filtersNames
        .reduce((res, filterName) => {
          res[filterName] = listState.filters[filterName];

          return res;
        }, {}),
    },

    sort: null,
  };
}

export function setAndApplyFilters(listState, values) {
  return {
    filters: {
      ...listState.filters,
      ...listState.alwaysResetFilters,
      ...values,
    },

    appliedFilters: {
      ...listState.appliedFilters,
      ...listState.alwaysResetFilters,
      ...values,
    },

    sort: null,
  };
}

export function resetFilters(listState, filtersNames) {
  return {
    filters: {
      ...listState.filters,
      ...listState.alwaysResetFilters,
      ...filtersNames
        .reduce((res, filterName) => {
          res[filterName] = listState.initialFilters[filterName];

          return res;
        }, {}),
    },

    appliedFilters: {
      ...listState.appliedFilters,
      ...listState.alwaysResetFilters,
      ...filtersNames
        .reduce((res, filterName) => {
          res[filterName] = listState.initialFilters[filterName];

          return res;
        }, {}),
    },

    sort: null,
  };
}

export function resetAllFilters(listState, filtersNames) {
  return {
    filters: {
      ...listState.alwaysResetFilters,
      ...listState.initialFilters,
      ...listState.saveFiltersOnResetAll
        .reduce((res, filterName) => {
          res[filterName] = listState.filters[filterName];

          return res;
        }, {}),
    },

    appliedFilters: {
      ...listState.alwaysResetFilters,
      ...listState.initialFilters,
      ...listState.saveFiltersOnResetAll
        .reduce((res, filterName) => {
          res[filterName] = listState.appliedFilters[filterName];

          return res;
        }, {}),
    },

    sort: null,
  };
}

export function setSorting(listState, param, asc) {
  return {
    filters: {
      ...listState.filters,
      ...listState.alwaysResetFilters,
    },

    appliedFilters: {
      ...listState.appliedFilters,
      ...listState.alwaysResetFilters,
    },

    sort: {
      param,
      asc: typeof asc === 'boolean' ?
        asc :
        (
          listState.sort.param === param ?
            !asc :
            listState.isDefaultSortAsc
        ),
    },
  };
}

export function resetSorting(listState, param, asc) {
  return {
    filters: {
      ...listState.filters,
      ...listState.alwaysResetFilters,
    },

    appliedFilters: {
      ...listState.appliedFilters,
      ...listState.alwaysResetFilters,
    },

    sort: {
      param: null,
      asc: listState.isDefaultSortAsc,
    },
  };
}
