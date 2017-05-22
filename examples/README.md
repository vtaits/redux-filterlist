# Examples

### List with loading

For create list with loading you can use `loadItems` function from component props.

```
const List = ({
  listState: {
    additional,
    items,
    loading,
  },

  loadItems, // <-------
}) => (
```

In jsx:

```
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
```

```
export default reduxFilterlist({
  listId: 'loadingList',
  loadItems: ({
    items,
  }) => fetch(`/cars?offset=${ items.length }&limit=1`) // If backend uses offset and limit params
    .then((response) => response.json())
    .then(({ cars, count }) => ({
      items: cars,
      additional: {
        count: count,
      },
    })),
})(List)
```

An example [here](https://github.com/vtaits/redux-filterlist/tree/master/examples/loading-list).

### List with pagination

For create list with pagination you can use `setAndApplyFilter` function from component props.

Let's create paginator component.

```
const buttonStyle = {
  display: 'inline-block',
  marginRight: '10px',
}

const clickableButtonStyle = Object.assign({}, buttonStyle, {
  color: 'blue',
  cursor: 'pointer',
})

const Paginator = ({
  count,
  perPage,
  current,

  setPage,
}) => {
  const pagesLength = Math.ceil(count / perPage)

  return (
    <div>
      {
        (() => {
          const res = []

          for (let i = 0; i < pagesLength; ++i) {
            const isCurrent = current === i + 1

            res.push(
              <div
                onClick={ isCurrent ? () => {} : setPage.bind(null, i + 1) }
                style={ isCurrent ? buttonStyle : clickableButtonStyle }
                key={ i }
              >
                { i + 1 }
              </div>
            )
          }

          return res
        })()
      }
    </div>
  )
}
```

Then add params to decorator:

```
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
```

`alwaysResetFilters` is filters values that set after each other filters or sorting change.

`appliedFilters` is filters that setted by default.

First argument of `loadItems` is current list state. Now we need `appliedFilters`.

Then add paginator and `items per page` select to component:

```
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
```

```
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
```

An example [here](https://github.com/vtaits/redux-filterlist/tree/master/examples/pagination).

### List with sorting

For create list with pagination you can use `setSorting` function from component props.

Let's create paginator component.

```
const thStyle = {
  cursor: 'pointer',
  color: 'blue',
}

const Th = ({
  param,

  current,
  asc,

  children,

  setSorting,
}) => (
  <th
    onClick={ setSorting.bind(null, param) }
    style={ thStyle }
  >
    { children }

    {
      param === current && (
        asc ?  '↓' : '↑'
      )
    }
  </th>
)
```

For comfort let's define function `constructUrl`

```
function constructUrl(url, searchObj) {
  if (!searchObj) {
    return url
  }

  const searchParams = new URLSearchParams()
  Object.keys(searchObj)
    .forEach((searchKey) => {
      const value = searchObj[searchKey]

      if (value) {
        searchParams.append(searchKey, value)
      }
    })

  const paramsStr = searchParams.toString()
  if (!paramsStr || paramsStr === '?') {
    return url
  }

  return `${ url }?${ paramsStr }`
}
```

Then add params to decorator:

```
export default reduxFilterlist({
  listId: 'sorting',
  alwaysResetFilters: {
    page: 1,
  },
  appliedFilters: {
    page: 1,
    perPage: 10,
  },
  loadItems: ({
    sort,
    appliedFilters: {
      page,
      perPage,
    },
  }) => {
    return fetch(constructUrl('/cars', {
      page,
      per_page: perPage,
      sort: `${ sort.param ? `${ sort.asc ? '' : '-' }${ sort.param }` : '' }`,
    }))
      .then((response) => response.json())
      .then(({ cars, count }) => ({
        items: cars,
        additional: {
          count: count,
        },
      }))
  },
})(List)
```

Then add sorting change to component.

```
const List = ({
  listState: {
    additional,
    items,
    loading,

    sort, // <---------

    appliedFilters: {
      page,
      perPage,
    },
  },

  setAndApplyFilter,
  setSorting, // <---------
}) => (
```

```
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
```

An example [here](https://github.com/vtaits/redux-filterlist/tree/master/examples/sorting).

### List with filters

For create list with pagination you can use `setFilterValue`, `applyFilter`, `setAndApplyFilter`, `resetFilter`, `setAndApplyFilters`, `resetFilters`, `applyFilters`, `resetAllFilters`, `setSorting` function from component props and `filters`, `appliedFilters` params from `listState`.

Let's create component

```
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
```

and decorate it

```
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
})(List)
```

An example [here](https://github.com/vtaits/redux-filterlist/tree/master/examples/filters).

### List with plugin

Let's add checkboxes that store state in listState.

First define toggle checkbox action.

```
export const CHECK = 'CHECK'

export function check(carId, checked) {
  return {
    type: CHECK,
    payload: {
      carId,
      checked,
    },
  }
}
```

Then provide it to component.

```
import {connect} from 'react-redux'

import List from './List'

import {check} from './actions'

const mapStateToProps = () => ({})

const mapDispatchToProps = {
  check,
}

export default connect(mapStateToProps, mapDispatchToProps)(List)
```

Then plugin reducer.

```
import {CHECK} from './actions'

const reducers = combineReducers({
  reduxFilterlist: reduxFilterlistReducer.plugin({
    pluginList: (state, {type, payload}) => {
      switch (type) {
        case CHECK:
          return {
            ...state,
            items: state.items.map((car) => {
              if (car.id === payload.carId) {
                return {
                  ...car,
                  checked: payload.checked,
                }
              }

              return car
            }),
          }

        default:
          return state
      }
    },
  }),
})
```

Then create decorated component.

```
import React from 'react'

import {reduxFilterlist} from 'redux-filterlist'

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
```

An example [here](https://github.com/vtaits/redux-filterlist/tree/master/examples/plugin).
