import React from 'react'
import PropTypes from 'prop-types'

import {reduxFilterlist, filterlistPropTypes} from 'redux-filterlist'

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
  }),
}

export default reduxFilterlist({
  listId: 'loadingList',
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
