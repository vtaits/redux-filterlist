import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import listInitialState from './listInitialState'

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
      listState: listState || listInitialState,

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
