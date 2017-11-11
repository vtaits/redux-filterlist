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

Examples are [here](https://github.com/vtaits/redux-filterlist/tree/master/examples).

## Api

### reduxFilterlist

`reduxFilterlist` is a decorator that provides list state and actions to component.

```
import {reduxFilterlist} from 'redux-filterlist'

reduxFilterlist({
  ...params,
})(List)
```

Params:

| Name | Required | Type | Description |
| ---- | -------- | ---- | ----------- |
| listId | true | String or Number | the name of list and the key to where list's state will be mounted under the `redux-filterlist` reducer |
| loadItems | true | Function | should return Promise that resolves with Object { items: [/* Array of loaded data */], additional: {} /* Additional info (total count etc.), can be null if not needed */ } and rejects with Object { error /* any, can be null if not needed */, additional } |
| additional | false | any | Additional info (total count etc.) setted by default |
| sort | false | Object | default sorting state of the list, should be an Object { param /* string, column id */ , asc /* boolean, asc or desc */ } |
| isDefaultSortAsc | false | Boolean | default `asc` param after change sorting column (true by default) |
| appliedFilters | false | Object | filters and their values that applied by default. Should be { filterName1: filterValue, filter2Name: filter2Value, ... } |
| initialFilters | false | Object | filters and their values that sets after filter reset. Should be { filterName1: filterValue, filter2Name: filter2Value, ... } |
| alwaysResetFilters | false | Object | filters and their values that sets after every filters or sorting change. Should be { filterName1: filterValue, filter2Name: filter2Value, ... } |
| saveFiltersOnResetAll | false | Array | filters names that not reset after `resetAllFilters` call. Should be [filterName1, filter2Name, ...] |
| catchRejects | false | Boolean | by default if list loads with error, wrapper component catches Promise.reject inside. If `catchRejects` is true, wrapped component can catch this reject |
| saveItemsWhileLoad | false | Boolean | by default items are cleared if filters or sorting changed. If `saveItemsWhileLoad` is true, previous list items are saved while load request is pending |
| onBeforeRequest | false | Function(listState, props) | hook that called before each items request |

All params except for `listId`, `loadItems` and `onBeforeRequest` can be redefined with component props.

### List state

| Param | Description | Type |
| ----- | ----------- | ---- |
| loading | is list loading in this moment | Boolean |
| items | loaded items | Array |
| additional | additional info that can be recieved together with items | any |
| error | error that can be received if list not loaded | any |
| sort | sorting state of the list | Object { param, asc } |
| filters | current filters state on page (intermediate inputs values etc.) | Object { filterName1: filterValue, filter2Name: filter2Value, ... } |
| appliedFilters | applied filters | Object { filterName1: filterValue, filter2Name: filter2Value, ... } |
| isDefaultSortAsc | param from decorator | Boolean |
| initialFilters | param from decorator | Object |
| alwaysResetFilters | param from decorator | Object |
| saveFiltersOnResetAll | param from decorator | Array |
| catchRejects | param from decorator | Boolean |
| requestId | **internal** | Integer |

### Component props

| Property | Type | Arguments | Description |
| -------- | ---- | --------- | ----------- |
| listId | String or Number | | param from decorator |
| listState | Object | | current state of list |
| loadItems | Function | | loads more items to page |
| setFilterValue | Function | filterName, value | sets filter intermediate value |
| applyFilter | Function | filterName | applies filter intermediate value, clears list and loads items |
| setAndApplyFilter | Function | filterName, value | sets filter values, applies that, clears list and loads items |
| resetFilter | Function | filterName | resets filter value to it initial value, applies that, clears list and loads items |
| setFiltersValues | Function | Object { filterName1: filterValue, filter2Name: filter2Value, ... } | sets multiple filters intermediate values |
| applyFilters | Function | Array [filterName1, filter2Name, ...] | applies multiple filters intermediate values, clears list and loads items |
| setAndApplyFilters | Function | Object { filterName1: filterValue, filter2Name: filter2Value, ... } | sets multiple filters values, applies them, clears list and loads items |
| resetFilters | Function | Array [filterName1, filter2Name, ...] | resets filters values to them initial values, applies them, clears list and loads items |
| resetAllFilters | Function | | resets all filters (without `saveFiltersOnResetAll`) values to them initial values, applies them, clears list and loads items |
| setSorting | Function | param, asc | sets sorting column. If asc defined and Boolean, sets it. Otherwise, if this column differs from previous sorting column, asc will be setted with `isDefaultSortAsc` param from decorator. Otherwise, it will be reverse `asc` param from previous state. |
| resetSorting | Function | | resets sorting. Sort param will be setted with null, asc will be setted with `isDefaultSortAsc` param from decorator. |
| deleteItem | Function | index, additional | delete item with specified index from list. If `additional` defined, sets it. |
| updateItem | Function | index, item, additional | update item by specified index. If `additional` defined, sets it. |

### reducer

Stores lists states.

```
import {reducer as reduxFilterlistReducer} from 'redux-filterlist'
```

Should be mounted to **reduxFilterlist** in root reducer.

```
const reducers = combineReducers({
  ...otherReducers,
  reduxFilterlist: reduxFilterlistReducer,
})

const store = createStoreWithMiddleware(reducers)
```

### reducer.plugin

Returns a list reducer that will also pass each action through additional reducers specified. In first argument takes an object with keys is lists ids and values is additional reducers that calls after each action dispatch if list mounted.

Should be mounted to **reduxFilterlist** in root reducer instead of original reducer.

```
const reducers = combineReducers({
  ...otherReducers,
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

const store = createStoreWithMiddleware(reducers)
```

### filterlistPropTypes

PropTypes of decorated component.

```
import {reduxFilterlist, filterlistPropTypes} from 'redux-filterlist'

const List = (props) => {
  ...
}

List.propTypes = {
  ...filterlistPropTypes({}),
  ...otherPropTypes,
}

reduxFilterlist({
  ...params,
})(List)
```

#### Customization of list PropTypes

```
import {reduxFilterlist, filterlistPropTypes} from 'redux-filterlist'
import PropTypes from 'prop-types';

const List = (props) => {
  ...
}

List.propTypes = {
  ...filterlistPropTypes({
    // PropTypes for all items from list state
    // PropTypes.any by default
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),

    // PropTypes for `additional` from list state
    // PropTypes.any by default
    additional: PropTypes.shape({
      count: PropTypes.number.isRequired,
    }),

    // PropTypes for `error` from list state
    // PropTypes.any by default
    error: PropTypes.shape({
      status: PropTypes.oneOf([
        403,
        404,
      ]).isRequired,

      message: PropTypes.string.isRequired,
    }),

    // PropTypes from `filters` and `appliedFilters` from list state
    // PropTypes.object by default
    filters: PropTypes.shape({
      page: PropTypes.number.isRequired,
      pageSize: PropTypes.number.isRequired,
      query: PropTypes.string,
    }),
  }),
  ...otherPropTypes,
}

reduxFilterlist({
  ...params,
})(List)
```

## Testing

For unit testing you can export component and decorated component separately, e.g.

```
import { reduxFilterlist } from 'redux-filterlist';

export class ListComponent extends Component {
  ...
}

export default reduxFilterlist({
  ...params
})(ListComponent);
```

Then, in you test file you can simulate various states using `filterlistProps`.

```
import { shallow } from 'enzyme';

import { filterlistProps } from 'redux-filterlist/lib/fixtures'; // <---------

import { ListComponent } from '../list';

test('should render without crash', () => {
  shallow(
    <ListComponent
      {...filterlistProps}
    />
  );
});

test('should render preloader in loading state', () => {
  const wrapper = shallow(
    <ListComponent
      {...filterlistProps}
      listState={{
        ...filterlistProps.listState,
        loading: true,
      }}
    />
  );

  // check if preloader is rendered
});

test('should render items', () => {
  const wrapper = shallow(
    <ListComponent
      {...filterlistProps}
      listState={{
        ...filterlistProps.listState,
        items: [
          // items of list
        ],
      }}
    />
  );

  // check rendered items
});

```

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

