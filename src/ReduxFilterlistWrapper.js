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
      initialFilters: PropTypes.object.isRequired,
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
      applyFilter: PropTypes.func.isRequired,
      setAndApplyFilter: PropTypes.func.isRequired,
      resetFilter: PropTypes.func.isRequired,

      setFiltersValues: PropTypes.func.isRequired,
      applyFilters: PropTypes.func.isRequired,
      setAndApplyFilters: PropTypes.func.isRequired,
    }).isRequired,

    WrappedComponent: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
  }

  requestItems() {
    const {
      listId,
      loadItems,
      listState,
      listActions,
      WrappedComponent,
      params,
      ...props
    } = this.props

    return loadItems(listState, props)
      .then((response) => {
        listActions.loadListSuccess(listId, response)
      }, (response) => {
        listActions.loadListError(listId, response)

        return Promise.reject(response)
      })
  }

  loadItems = () => {
    const {
      listId,
      listActions,
    } = this.props

    listActions.loadList(listId)

    return this.requestItems()
  }

  applyFilter = (filterName) => {
    const {
      listId,
      listActions,
    } = this.props

    listActions.applyFilter(listId, filterName)

    return this.requestItems()
  }

  setAndApplyFilter = (filterName, value) => {
    const {
      listId,
      listActions,
    } = this.props

    listActions.setAndApplyFilter(listId, filterName, value)

    return this.requestItems()
  }

  resetFilter = (filterName) => {
    const {
      listId,
      listActions,
    } = this.props

    listActions.resetFilter(listId, filterName)

    return this.requestItems()
  }

  applyFilters = (filtersNames) => {
    const {
      listId,
      listActions,
    } = this.props

    listActions.applyFilters(listId, filtersNames)

    return this.requestItems()
  }

  setAndApplyFilters = (values) => {
    const {
      listId,
      listActions,
    } = this.props

    listActions.setAndApplyFilters(listId, values)

    return this.requestItems()
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
      applyFilter: this.applyFilter,
      setAndApplyFilter: this.setAndApplyFilter,
      resetFilter: this.resetFilter,

      setFiltersValues: listActions.setFiltersValues.bind(null, listId),
      applyFilters: this.applyFilters,
      setAndApplyFilters: this.setAndApplyFilters,
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
