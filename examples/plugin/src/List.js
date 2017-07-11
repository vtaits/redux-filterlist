import React from 'react'

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
  ...filterlistPropTypes,
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
