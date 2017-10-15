import React from 'react'
import PropTypes from 'prop-types'

import {reduxFilterlist, filterlistPropTypes} from 'redux-filterlist'

export const ListComponent = ({
  listState: {
    additional,
    items,
    loading,
  },
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
            <tr key={ id } className="car">
              <td className="car__id">{ id }</td>
              <td className="car__brand">{ brand }</td>
              <td className="car__owner">{ owner }</td>
              <td className="car__color">{ color }</td>
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
        <h3 id="preloader">
          Loading...
        </h3>
      )
    }
  </div>
)

ListComponent.propTypes = {
  ...filterlistPropTypes({
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
      brand: PropTypes.string.isRequired,
      owner: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),
  }),
}

export default reduxFilterlist({
  listId: 'unitTesting',
  loadItems: () => fetch('/cars')
    .then((response) => response.json())
    .then((cars) => ({
      items: cars,
      additional: {
        count: cars.length,
      },
    })),
})(ListComponent)
