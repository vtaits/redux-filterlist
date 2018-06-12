import arrayInsert from 'array-insert';

import {
  REGISTER_LIST,
  DESTROY_LIST,

  CHANGE_LIST_STATE,

  LOAD_LIST_SUCCESS,
  LOAD_LIST_ERROR,

  INSERT_ITEM,
  DELETE_ITEM,
  UPDATE_ITEM,
} from './actionsTypes';

import collectListInitialState from './collectListInitialState';

function listReducer(listState, { type, payload }) {
  switch (type) {
    case REGISTER_LIST:
      if (listState) {
        return listState;
      }

      return collectListInitialState(payload.params);

    case CHANGE_LIST_STATE:
      return payload.nextListState;

    case LOAD_LIST_SUCCESS:
      if (listState.requestId !== payload.requestId) {
        return listState;
      }

      return {
        ...listState,
        loading: false,

        items: (listState.saveItemsWhileLoad && listState.shouldClean) ?
          payload.response.items :
          listState.items.concat(payload.response.items),

        additional: typeof payload.response.additional !== 'undefined' ?
          payload.response.additional :
          listState.additional,

        shouldClean: false,
      };

    case LOAD_LIST_ERROR:
      if (listState.requestId !== payload.requestId) {
        return listState;
      }

      return {
        ...listState,
        loading: false,
        error: (payload.response && typeof payload.response.error !== 'undefined') ?
          payload.response.error :
          null,
        additional: (payload.response && typeof payload.response.additional !== 'undefined') ?
          payload.response.additional :
          listState.additional,

        shouldClean: false,
      };

    case INSERT_ITEM:
      return {
        ...listState,

        items: arrayInsert(listState.items, payload.itemIndex, payload.item),

        additional: typeof payload.additional !== 'undefined' ?
          payload.additional :
          listState.additional,
      };

    case DELETE_ITEM:
      return {
        ...listState,

        items: listState.items
          .filter((item, index) => index !== payload.itemIndex),

        additional: typeof payload.additional !== 'undefined' ?
          payload.additional :
          listState.additional,
      };

    case UPDATE_ITEM:
      return {
        ...listState,

        items: listState.items
          .map((item, index) => {
            if (index === payload.itemIndex) {
              return payload.item;
            }

            return item;
          }),

        additional: typeof payload.additional !== 'undefined' ?
          payload.additional :
          listState.additional,
      };

    default:
      return listState;
  }
}

const listsActions = [
  REGISTER_LIST,
  CHANGE_LIST_STATE,
  LOAD_LIST_SUCCESS,
  LOAD_LIST_ERROR,
  INSERT_ITEM,
  DELETE_ITEM,
  UPDATE_ITEM,
];

function rootReducer(state = {}, action) {
  const {
    type,
    payload,
  } = action;

  if (listsActions.includes(type)) {
    const currentState = state[payload.listId];

    if (!currentState && type !== REGISTER_LIST) {
      return state;
    }

    return {
      ...state,
      [payload.listId]: listReducer(state[payload.listId], action),
    };
  }

  switch (type) {
    case DESTROY_LIST:
    {
      const listIdStr = payload.listId.toString();

      return Object.keys(state)
        .reduce((res, listId) => {
          if (listIdStr === listId) {
            return res;
          }

          res[listId] = state[listId];

          return res;
        }, {});
    }

    default:
      return state;
  }
}

function pluginReducer(plugin, state, action) {
  const intermediateState = rootReducer(state, action);

  return Object.keys(plugin)
    .reduce((res, listId) => {
      if (intermediateState[listId]) {
        res[listId] = plugin[listId](intermediateState[listId], action);
      }

      return res;
    }, {
      ...intermediateState,
    });
}

export default function reducerWithPlugin(state, action) {
  return rootReducer(state, action);
}

reducerWithPlugin.plugin = (plugin) => {
  if (typeof plugin !== 'object') {
    throw new Error('Reducer plugin should be an obeject');
  }

  if (plugin === null) {
    throw new Error('Reducer plugin can\'t be null');
  }

  return pluginReducer.bind(null, plugin);
};
