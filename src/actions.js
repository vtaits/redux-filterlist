import {
  REGISTER_LIST,
  DESTROY_LIST,

  LOAD_LIST,
  LOAD_LIST_SUCCESS,
  LOAD_LIST_ERROR,

  SET_FILTER_VALUE,
  APPLY_FILTER,
  SET_AND_APPLY_FILTER,
  RESET_FILTER,

  SET_FILTERS_VALUES,
  APPLY_FILTERS,
  SET_AND_APPLY_FILTERS,
  RESET_FILTERS,

  RESET_ALL_FILTERS,

  SET_SORTING,

  DELETE_ITEM,
  UPDATE_ITEM,
} from './actionsTypes';

export function registerList(listId, params = {}) {
  return {
    type: REGISTER_LIST,
    payload: {
      listId,
      params,
    },
  };
}

export function destroyList(listId) {
  return {
    type: DESTROY_LIST,
    payload: {
      listId,
    },
  };
}

export function loadList(listId) {
  return {
    type: LOAD_LIST,
    payload: {
      listId,
    },
  };
}

export function loadListSuccess(listId, response) {
  if (!response) {
    throw new Error('Response is required');
  }

  if (!response.items) {
    throw new Error('Response items is required');
  }

  if (!(response.items instanceof Array)) {
    throw new Error('Response items should be array');
  }

  return {
    type: LOAD_LIST_SUCCESS,
    payload: {
      listId,
      response,
    },
  };
}

export function loadListError(listId, response) {
  return {
    type: LOAD_LIST_ERROR,
    payload: {
      listId,
      response,
    },
  };
}

export function setFilterValue(listId, filterName, value) {
  if (!filterName) {
    throw new Error('Filter name is required');
  }

  return {
    type: SET_FILTER_VALUE,
    payload: {
      listId,
      filterName,
      value,
    },
  };
}

export function applyFilter(listId, filterName) {
  if (!filterName) {
    throw new Error('Filter name is required');
  }

  return {
    type: APPLY_FILTER,
    payload: {
      listId,
      filterName,
    },
  };
}

export function setAndApplyFilter(listId, filterName, value) {
  if (!filterName) {
    throw new Error('Filter name is required');
  }

  return {
    type: SET_AND_APPLY_FILTER,
    payload: {
      listId,
      filterName,
      value,
    },
  };
}

export function resetFilter(listId, filterName) {
  if (!filterName) {
    throw new Error('Filter name is required');
  }

  return {
    type: RESET_FILTER,
    payload: {
      listId,
      filterName,
    },
  };
}

export function setFiltersValues(listId, values) {
  if (!values) {
    throw new Error('Values is required');
  }

  return {
    type: SET_FILTERS_VALUES,
    payload: {
      listId,
      values,
    },
  };
}

export function applyFilters(listId, filtersNames) {
  if (!filtersNames) {
    throw new Error('Filters names is required');
  }

  if (!(filtersNames instanceof Array)) {
    throw new Error('Filters names should be an array');
  }

  return {
    type: APPLY_FILTERS,
    payload: {
      listId,
      filtersNames,
    },
  };
}

export function setAndApplyFilters(listId, values) {
  if (!values) {
    throw new Error('Values is required');
  }

  return {
    type: SET_AND_APPLY_FILTERS,
    payload: {
      listId,
      values,
    },
  };
}

export function resetFilters(listId, filtersNames) {
  if (!filtersNames) {
    throw new Error('Filters names is required');
  }

  if (!(filtersNames instanceof Array)) {
    throw new Error('Filters names should be an array');
  }

  return {
    type: RESET_FILTERS,
    payload: {
      listId,
      filtersNames,
    },
  };
}

export function resetAllFilters(listId) {
  return {
    type: RESET_ALL_FILTERS,
    payload: {
      listId,
    },
  };
}

export function setSorting(listId, param, asc) {
  if (!param) {
    throw new Error('Sorting param is required');
  }

  return {
    type: SET_SORTING,
    payload: {
      listId,
      param,
      asc: typeof asc === 'boolean' ? asc : null,
    },
  };
}

export function deleteItem(listId, itemIndex, additional) {
  return {
    type: DELETE_ITEM,
    payload: {
      listId,
      itemIndex,
      additional,
    },
  };
}

export function updateItem(listId, itemIndex, item, additional) {
  return {
    type: UPDATE_ITEM,
    payload: {
      listId,
      itemIndex,
      item,
      additional,
    },
  };
}
