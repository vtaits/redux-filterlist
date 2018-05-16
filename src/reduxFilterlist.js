import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import collectListInitialState from './collectListInitialState';

import * as actions from './actions';

export default function reduxFilterlist(ReduxFilterlistWrapper, {
  listId,
  ...decoratorParams
}) {
  if (!listId) {
    throw new Error('listId is required');
  }

  return (WrappedComponent) => {
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
        listState: listState || collectListInitialState(reduxFilterlistParams),

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

    return connect(mapStateToProps, mapDispatchToProps)(ReduxFilterlistWrapper);
  };
}
