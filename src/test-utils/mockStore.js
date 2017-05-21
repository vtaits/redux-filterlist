// hack for save actions as redux-mock-store
import {createStore, applyMiddleware} from 'redux'

function saveStoreActions(saveAction) {
  return function(next) {
    return function(action) {
      saveAction(action)

      return next(action)
    }
  }
}

export default function mockStore(reducers, initialState) {
  let actions = []

  const createStoreWithMiddleware = applyMiddleware(
    saveStoreActions.bind(null, (action) => actions.push(action)),
  )(createStore)

  const store = createStoreWithMiddleware(reducers, initialState)

  store.getActions = () => actions
  store.clearActions = () => actions = []

  return store
}
