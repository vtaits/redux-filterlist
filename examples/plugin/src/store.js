import {combineReducers, createStore, applyMiddleware} from 'redux'
import logger from 'redux-logger'
import {reducer as reduxFilterlistReducer} from 'redux-filterlist'

const createStoreWithMiddleware = applyMiddleware(
  logger,
)(createStore)

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

const store = createStoreWithMiddleware(reducers)

export default store
