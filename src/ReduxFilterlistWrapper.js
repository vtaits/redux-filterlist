import {Component, createElement} from 'react'

class ReduxFilterlistWrapper extends Component {
  constructor(props) {
    super(props)
  }

  loadItems() {
    const {
      listId,
      loadItems,
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
    const {
      listId,
      params,
    } = this.props

    this.props.listActions.registerList(listId, params)
  }

  componentDidMount() {
    this.loadItems()
  }

  componentWillUnmount() {
    const {
      listId,
    } = this.props

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
      listState,
      loadItems: this.loadItems,
    }
  }

  render() {
    const {
      WrappedComponent,
    } = this.props

    return createElement(WrappedComponent, this.collectComponentProps())
  }
}

export default ReduxFilterlistWrapper
