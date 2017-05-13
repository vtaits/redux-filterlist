import {Component, createElement} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import listInitialState from './listInitialState'

import * as actions from './actions'

export default function reduxFilterlist({
  listId,
  loadItems,
  ...params
}) {
  return function (WrappedComponent) {
    class ReduxFilterlistWrapper extends Component {
      constructor(props) {
        super(props)
      }

      loadItems() {
        const {
          listState,
          listActions,
          ...props
        } = this.props

        listActions.loadList(listId)

        return loadItems(listState, props)
          .then((response) => {
            listActions.loadListSuccess(listId, response)
          }, (response) => {
            listActions.loadListError(listId, response)
          })
      }

      componentWillMount() {
        this.props.listActions.registerList(listId, params)
      }

      componentDidMount() {
        this.loadItems()
      }

      componentWillUnmount() {
        this.props.listActions.destroyList(listId)
      }

      collectComponentProps() {
        const {
          listState,
          listActions,
          ...props
        } = this.props

        return {
          ...props,
          listState: listState || listInitialState,
          loadItems: this.loadItems,
        }
      }

      render() {
        return createElement(WrappedComponent, this.collectComponentProps())
      }
    }

    const mapStateToProps = ({
      reduxFilterlist: {
        [listId]: listState,
      },
    }) => ({
      listState,
    })

    const mapDispatchToProps = (dispatch) => ({
      listActions: bindActionCreators(actions, dispatch),
    })

    return connect(mapStateToProps, mapDispatchToProps)(ReduxFilterlistWrapper)
  }
}
