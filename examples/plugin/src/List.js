import React from 'react'
import PropTypes from 'prop-types'

import {reduxFilterlist, filterlistPropTypes} from 'redux-filterlist'

const List = ({
  listState: {
    additional,
    items,
    loading,
  },

  check,
}) => (
  <div>
    <table>
      <thead>
        <tr>
          <th />
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
            checked,
          }) => (
            <tr key={ id }>
              <td>
                <input
                  type='checkbox'
                  checked={ checked }
                  onChange={ check.bind(null, id, !checked) }
                />
              </td>

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
  </div>
)

List.propTypes = {
  ...filterlistPropTypes({
    item: PropTypes.shape({
      checked: PropTypes.bool.isRequired,
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
  listId: 'pluginList',
  loadItems: () => fetch('/cars')
    .then((response) => response.json())
    .then((cars) => ({
      items: cars.map((car) => ({
        ...car,
        checked: false,
      })),
      additional: {
        count: cars.length,
      },
    })),
})(List)
