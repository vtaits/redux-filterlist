import { combineReducers, createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { reducer as reduxFilterlistReducer } from 'redux-filterlist';

const createStoreWithMiddleware = applyMiddleware(
  logger,
)(createStore);

const reducers = combineReducers({
  reduxFilterlist: reduxFilterlistReducer,
});

const store = createStoreWithMiddleware(reducers);

export default store;
