import React from 'react'

import {reduxFilterlist} from 'redux-filterlist'

const List = ({
  listState: {
    additional,
    items,
    loading,
  },

  loadItems,
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
      (!additional || items.length < additional.count) && (
        <div>
          <button
            disabled={ loading }
            onClick={ loadItems }
          >
            Load more
          </button>
        </div>
      )
    }

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
  </div>
)

export default reduxFilterlist({
  listId: 'simple',
  loadItems: ({
    items,
  }) => fetch(`/cars?offset=${ items.length }&limit=1`)
    .then((response) => response.json())
    .then(({ cars, count }) => ({
      items: cars,
      additional: {
        count: count,
      },
    })),
})(List)
