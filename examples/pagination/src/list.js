import React from 'react'

import Paginator from './paginator'

import {reduxFilterlist} from 'redux-filterlist'

const List = ({
  listState: {
    additional,
    items,
    loading,

    appliedFilters: {
      page,
      perPage,
    },
  },

  setAndApplyFilter,
}) => (
  <div>
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>brand</th>
          <th>owner</th>
          <th>color</th>
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

export default reduxFilterlist({
  listId: 'pagination',
  alwaysResetFilters: {
    page: 1,
  },
  appliedFilters: {
    page: 1,
    perPage: 10,
  },
  loadItems: ({
    appliedFilters: {
      page,
      perPage,
    },
  }) => fetch(`/cars?page=${ page }&per_page=${ perPage }`)
    .then((response) => response.json())
    .then(({ cars, count }) => ({
      items: cars,
      additional: {
        count: count,
      },
    })),
})(List)
