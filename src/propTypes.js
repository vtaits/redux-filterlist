import PropTypes from 'prop-types';

export const listIdPropTypes = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
]);

const sortShape = PropTypes.shape({
  param: PropTypes.string,
  asc: PropTypes.bool.isRequired,
});

export const listStatePropTypes = (listStateConfig) => {
  if (typeof listStateConfig !== 'object') {
    throw new Error('List state config should be an object');
  }

  if (listStateConfig === null) {
    throw new Error('List state config can\'t be null');
  }

  const {
    item = PropTypes.any,
    filters = PropTypes.object,
    additional = PropTypes.any,
    error = PropTypes.any,
  } = listStateConfig;

  return PropTypes.shape({
    autoload: PropTypes.bool.isRequired,
    sort: sortShape.isRequired,
    initialFilters: PropTypes.object.isRequired,
    filters: filters.isRequired,
    appliedFilters: filters.isRequired,
    loading: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(item).isRequired,
    additional,
    error,
    requestId: PropTypes.number.isRequired,
  });
};

export const filterlistPropTypes = listStateConfig => ({
  listId: listIdPropTypes.isRequired,
  listState: listStatePropTypes(listStateConfig).isRequired,

  loadItems: PropTypes.func.isRequired,

  setFilterValue: PropTypes.func.isRequired,
  applyFilter: PropTypes.func.isRequired,
  setAndApplyFilter: PropTypes.func.isRequired,
  resetFilter: PropTypes.func.isRequired,

  setFiltersValues: PropTypes.func.isRequired,
  applyFilters: PropTypes.func.isRequired,
  setAndApplyFilters: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,

  resetAllFilters: PropTypes.func.isRequired,

  setSorting: PropTypes.func.isRequired,
  resetSorting: PropTypes.func.isRequired,

  insertItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
});

export const reduxFilterlistParamsShape = PropTypes.shape({
  autoload: PropTypes.bool,
  sort: sortShape,
  isDefaultSortAsc: PropTypes.bool,
  alwaysResetFilters: PropTypes.object,
  additional: PropTypes.any,
  initialFilters: PropTypes.object,
  filters: PropTypes.object,
  appliedFilters: PropTypes.object,
  saveFiltersOnResetAll: PropTypes.arrayOf(PropTypes.string),
  saveItemsWhileLoad: PropTypes.bool,

  shouldRecountState: PropTypes.func,
  getStateFromProps: PropTypes.func,
});
