import PropTypes from 'prop-types'

export const listIdPropTypes = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
])

export const listStatePropTypes = PropTypes.shape({
  sort: PropTypes.shape({
    param: PropTypes.string,
    asc: PropTypes.bool.isRequired,
  }).isRequired,
  initialFilters: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  appliedFilters: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  additional: PropTypes.any,
  error: PropTypes.any,
  catchRejects: PropTypes.bool,
  requestId: PropTypes.number.isRequired,
})

export const filterlistPropTypes = {
  listId: listIdPropTypes.isRequired,
  listState: listStatePropTypes.isRequired,

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
}
