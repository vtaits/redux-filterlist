import {Component, createElement} from 'react'
import PropTypes from 'prop-types'

class ReduxFilterlistWrapper extends Component {
  static propTypes = {
    listId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    loadItems: PropTypes.func.isRequired,
    listState: PropTypes.shape({
      sort: PropTypes.shape({
        param: PropTypes.string,
        asc: PropTypes.bool.isRequired,
      }).isRequired,
      filters: PropTypes.object.isRequired,
      appliedFilters: PropTypes.object.isRequired,
      loading: PropTypes.bool.isRequired,
      items: PropTypes.array.isRequired,
      additional: PropTypes.any,
      error: PropTypes.any,
    }).isRequired,
    listActions: PropTypes.shape({
      registerList: PropTypes.func.isRequired,
      destroyList: PropTypes.func.isRequired,

      loadList: PropTypes.func.isRequired,
      loadListSuccess: PropTypes.func.isRequired,
      loadListError: PropTypes.func.isRequired,

      setFilterValue: PropTypes.func.isRequired,
    }).isRequired,
    WrappedComponent: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
  }

  loadItems = () => {
    const {
      listId,
      loadItems,
      listState,
      listActions,
      WrappedComponent,
      params,
      ...props
    } = this.props

    listActions.loadList(listId)

    return loadItems(listState, props)
      .then((response) => {
        listActions.loadListSuccess(listId, response)
      }, (response) => {
        listActions.loadListError(listId, response)

        return Promise.reject(response)
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
      .catch(() => {})
  }

  componentWillUnmount() {
    const {
      listId,
    } = this.props

    this.props.listActions.destroyList(listId)
  }

  collectComponentProps() {
    const {
      listId,
      listState,
      listActions,
      WrappedComponent,
      params,
      ...props
    } = this.props

    return {
      ...props,
      listId,
      listState,
      loadItems: this.loadItems,
      setFilterValue: listActions.setFilterValue.bind(null, listId),
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
