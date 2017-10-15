import React from 'react'
import PropTypes from 'prop-types'

import Paginator from './Paginator'
import Th from './Th'

import {reduxFilterlist, filterlistPropTypes} from 'redux-filterlist'
import {setSearchParams} from 'url-search-utils'

import constructUrl from './constructUrl'

const List = ({
  listState: {
    additional,
    items,
    loading,

    sort,

    filters,

    appliedFilters: {
      page,
      perPage,
    },
  },

  setFilterValue,
  applyFilter,
  setAndApplyFilter,
  resetFilter,
  setAndApplyFilters,
  resetFilters,
  resetAllFilters,
  setSorting,
}) => (
  <div>
    <div>
      <p>
        Brand:
        {' '}
        <input
          value={ filters.brand || '' }
          onChange={ ({ target: { value }}) => setFilterValue('brand', value) }
        />
        {' '}
        <button onClick={ applyFilter.bind(null, 'brand') }>
          Apply
        </button>
        {' '}
        <button onClick={ resetFilter.bind(null, 'brand') }>
          Reset
        </button>
      </p>

      <p>
        Owner:
        {' '}
        <input
          value={ filters.owner || '' }
          onChange={ ({ target: { value }}) => setFilterValue('owner', value) }
        />
        {' '}
        <button onClick={ applyFilter.bind(null, 'owner') }>
          Apply
        </button>
        {' '}
        <button onClick={ resetFilter.bind(null, 'owner') }>
          Reset
        </button>
      </p>

      <div>
        <p>
          <label>
            <input
              type='checkbox'
              checked={ filters.hideYellow || false }
              onChange={ setAndApplyFilter.bind(null, 'hideYellow', !filters.hideYellow) }
            />

            Hide yellow
          </label>
        </p>

        <p>
          <label>
            <input
              type='checkbox'
              checked={ filters.hideRed || false }
              onChange={ setAndApplyFilter.bind(null, 'hideRed', !filters.hideRed) }
            />

            Hide red
          </label>
        </p>

        <p>
          <label>
            <input
              type='checkbox'
              checked={ filters.hideBlue || false }
              onChange={ setAndApplyFilter.bind(null, 'hideBlue', !filters.hideBlue) }
            />

            Hide blue
          </label>
        </p>

        <p>
          <button onClick={ setAndApplyFilters.bind(null, {
            hideYellow: true,
            hideRed: true,
            hideBlue: true,
          }) }>
            Check all checkboxes
          </button>
          {' '}
          <button onClick={ resetFilters.bind(null, ['hideYellow', 'hideRed', 'hideBlue']) }>
            Uncheck all checkboxes
          </button>
        </p>
      </div>
    </div>

    <p>
      <button onClick={ resetAllFilters }>
        Reset all filters
      </button>
    </p>

    <table>
      <thead>
        <tr>
          <Th
            param='id'
            current={ sort.param }
            asc={ sort.asc }
            setSorting={ setSorting }
          >
            id
          </Th>

          <Th
            param='brand'
            current={ sort.param }
            asc={ sort.asc }
            setSorting={ setSorting }
          >
            brand
          </Th>

          <Th
            param='owner'
            current={ sort.param }
            asc={ sort.asc }
            setSorting={ setSorting }
          >
            owner
          </Th>

          <Th
            param='color'
            current={ sort.param }
            asc={ sort.asc }
            setSorting={ setSorting }
          >
            color
          </Th>
        </tr>
      </thead>

      <tbody>
        {
          items.map(({
            id,
            brand,
            owner,
            color,
          }) => (
            <tr key={ id }>
              <td>{ id }</td>
              <td>{ brand }</td>
              <td>{ owner }</td>
              <td>{ color }</td>
            </tr>
          ))
        }
      </tbody>
    </table>


    {
      additional && (
        <h4>
          Total: { additional.count }
        </h4>
      )
    }

    {
      loading && (
        <h3>Loading...</h3>
      )
    }

    <p>
      Items per page:
      {' '}
      <select
        value={ perPage }
        onChange={ ({ target: { value }}) => setAndApplyFilter('perPage', parseInt(value)) }
      >
        <option value='10'>10</option>
        <option value='20'>20</option>
        <option value='30'>30</option>
      </select>
    </p>

    {
      additional && (
        <Paginator
          count={ additional.count }
          perPage={ perPage }
          current={ page }

          setPage={ setAndApplyFilter.bind(null, 'page') }
        />
      )
    }
  </div>
)

List.propTypes = {
  ...filterlistPropTypes({
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
      brand: PropTypes.string.isRequired,
      owner: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),

    additional: PropTypes.shape({
      count: PropTypes.number.isRequired,
    }),

    filters: PropTypes.shape({
      page: PropTypes.number.isRequired,
      perPage: PropTypes.number.isRequired,
      brand: PropTypes.string,
      owner: PropTypes.string,
      hideYellow: PropTypes.bool,
      hideRed: PropTypes.bool,
      hideBlue: PropTypes.bool,
    }),
  }),
}

export default reduxFilterlist({
  listId: 'filters',
  alwaysResetFilters: {
    page: 1,
  },
  appliedFilters: {
    page: 1,
    perPage: 10,
  },
  initialFilters: {
    perPage: 10,
  },
  saveFiltersOnResetAll: ['perPage'],
  loadItems: ({
    sort,
    appliedFilters,
  }) => {
    return fetch(constructUrl('/cars', Object.assign({}, appliedFilters, {
      per_page: appliedFilters.perPage,
      sort: `${ sort.param ? `${ sort.asc ? '' : '-' }${ sort.param }` : '' }`,
    })))
      .then((response) => response.json())
      .then(({ cars, count }) => ({
        items: cars,
        additional: {
          count: count,
        },
      }))
  },

  onBeforeRequest: (listState) => {
    setSearchParams({
      ...listState.appliedFilters,
      sort: `${ listState.sort.asc ? '' : '-' }${ listState.sort.param}`,
    })
  },
})(List)
