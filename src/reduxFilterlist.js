import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import collectListInitialState from './collectListInitialState'

import * as actions from './actions'

import ReduxFilterlistWrapper from './ReduxFilterlistWrapper'

export default function reduxFilterlist({
  listId,
  loadItems,
  ...params
}) {
  return function(WrappedComponent) {
    const mapStateToProps = ({
      reduxFilterlist: {
        [listId]: listState,
      },
    }) => ({
      listState: listState || collectListInitialState(params),

      listId,
      loadItems,
      params,
      WrappedComponent,
    })

    const mapDispatchToProps = (dispatch) => ({
      listActions: bindActionCreators(actions, dispatch),
    })

    return connect(mapStateToProps, mapDispatchToProps)(ReduxFilterlistWrapper)
  }
}
