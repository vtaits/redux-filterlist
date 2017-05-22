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

Then add sorting change to component

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
