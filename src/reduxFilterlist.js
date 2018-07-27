import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ReduxFilterlistWrapper from './ReduxFilterlistWrapper';
import collectListInitialState from './collectListInitialState';

import * as actions from './actions';

export function createMappers(WrappedComponent, {
  listId,
  ...decoratorParams
}) {
  if (!listId) {
    throw new Error('listId is required');
  }

  const mapStateToProps = ({
    reduxFilterlist: {
      [listId]: listState,
    },
  }, componentProps) => {
    const reduxFilterlistParams = {
      ...decoratorParams,
      ...componentProps,
    };

    const {
      loadItems,
      onBeforeRequest,
    } = reduxFilterlistParams;

    if (!loadItems) {
      throw new Error('loadItems is required');
    }

    if (typeof loadItems !== 'function') {
      throw new Error('loadItems should be a function');
    }

    if (typeof onBeforeRequest !== 'undefined' &&
      typeof onBeforeRequest !== 'function') {
      throw new Error('onBeforeRequest should be a function');
    }

    return {
      listState: listState || collectListInitialState(reduxFilterlistParams, componentProps),

      componentProps,
      listId,
      loadItems,
      onBeforeRequest,
      reduxFilterlistParams,
      WrappedComponent,
    };
  };

  const mapDispatchToProps = dispatch => ({
    listActions: bindActionCreators(actions, dispatch),
  });

  return {
    mapStateToProps,
    mapDispatchToProps,
  };
}

export default function reduxFilterlist(params) {
  return (WrappedComponent) => {
    const {
      mapStateToProps,
      mapDispatchToProps,
    } = createMappers(WrappedComponent, params);

    return connect(mapStateToProps, mapDispatchToProps)(ReduxFilterlistWrapper);
  };
}
