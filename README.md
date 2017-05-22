# redux-filterlist
A Higher Order Component using react-redux for creating lists with filters, sotring, paginatinon, endless scroll etc.

## Installation

```
npm install redux-filterlist --save
```

This package requiers next packages: react, redux, react-redux. Easy way to install:

```
npm install react redux react-redux --save
```

And next polyfills:

 - Promise
 - Array.prototype.includes

 An examples [here](https://github.com/vtaits/redux-filterlist/tree/master/examples).

## Getting Started

### Step #1

Connect `redux-filterlist` reducer.

```
import { createStore, combineReducers } from 'redux'
import { reducer as reduxFilterlistReducer } from 'redux-filterlist'

const reducers = {
  // ... your other reducers here ...
  reduxFilterlist: reduxFilterlistReducer,
}

const reducer = combineReducers(reducers)
const store = createStore(reducer)
```

### Step #2

Decorate your list component with `reduxFilterlist()`. This will provide your component with props that provide information about list state and functions to filtration, sorting, loading and others.

`loadItems` is function that should return Promise that resolves with Object { options: [/* Array of loaded data */], additional: {} /* Additional info (total count etc.), can be null if not needed */ }

```
import React from 'react'

import { reduxFilterlist } from 'redux-filterlist'

const List = ({
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
  </div>
)

/*
 * assuming the API returns something like this:
 *   const json = [
 *     {
 *       id: 1,
 *       brand: 'Audi',
 *       owner: 'Tom',
 *       color: 'yellow',
 *     },
 *     {
 *       id: 2,
 *       brand: 'Mercedes',
 *       owner: 'Henry',
 *       color: 'white',
 *     },
 *     {
 *       id: 3,
 *       brand: 'BMW',
 *       owner: 'Alex',
 *       color: 'black',
 *     },
 *   ]
 */

export default reduxFilterlist({
  listId: 'simple',
  loadItems: () => fetch('/cars')
    .then((response) => response.json())
    .then((cars) => ({
      items: cars,
      additional: {
        count: cars.length,
      },
    })),
})(List)
```

### Done

An example [here](https://github.com/vtaits/redux-filterlist/tree/master/examples/simple).

