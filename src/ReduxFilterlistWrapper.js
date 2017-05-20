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
      catchRejects: PropTypes.bool,
      requestId: PropTypes.number.isRequired,
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
      resetFilters: PropTypes.func.isRequired,

      resetAllFilters: PropTypes.func.isRequired,

      setSorting: PropTypes.func.isRequired,
    }).isRequired,

    WrappedComponent: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
  }

  requestItems(requestId) {
    const incrementedRequestId = requestId + 1

    // wait for props update
    return new Promise((resolve, reject) => {
      const iteration = () => {
        const requestId = this.props.listState.requestId

        if (requestId > incrementedRequestId) {
          reject({
            requestCanceled: true,
          })

          return
        }

        if (requestId === incrementedRequestId) {
          resolve()

          return
        }

        setTimeout(iteration)
      }

      setTimeout(iteration)
    })
      .then(() => {
        const {
          listId,
          loadItems,
          listState,
          listActions,
          WrappedComponent,
          params,
          ...props
        } = this.props

        if (incrementedRequestId !== listState.requestId) {
          return Promise.reject({
            requestCanceled: true,
          })
        }

        return loadItems(listState, props)
          .then((response) => {
            if (incrementedRequestId !== this.props.listState.requestId) {
              return Promise.reject({
                requestCanceled: true,
              })
            }

            listActions.loadListSuccess(listId, response)
          }, (response) => {
            if (incrementedRequestId !== this.props.listState.requestId) {
              return Promise.reject({
                requestCanceled: true,
              })
            }

            listActions.loadListError(listId, response)

            return Promise.reject(response)
          })
      })
      .catch((rejectData) => {
        if (this.props.listState.catchRejects) {
          return Promise.reject(rejectData)
        }
      })
  }

  loadItems = () => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props

    listActions.loadList(listId)

    return this.requestItems(requestId)
  }

  applyFilter = (filterName) => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props

    listActions.applyFilter(listId, filterName)

    return this.requestItems(requestId)
  }

  setAndApplyFilter = (filterName, value) => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props

    listActions.setAndApplyFilter(listId, filterName, value)

    return this.requestItems(requestId)
  }

  resetFilter = (filterName) => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props

    listActions.resetFilter(listId, filterName)

    return this.requestItems(requestId)
  }

  applyFilters = (filtersNames) => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props

    listActions.applyFilters(listId, filtersNames)

    return this.requestItems(requestId)
  }

  setAndApplyFilters = (values) => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props

    listActions.setAndApplyFilters(listId, values)

    return this.requestItems(requestId)
  }

  resetFilters = (filtersNames) => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props

    listActions.resetFilters(listId, filtersNames)

    return this.requestItems(requestId)
  }

  resetAllFilters = () => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props

    listActions.resetAllFilters(listId)

    return this.requestItems(requestId)
  }

  setSorting = (param, asc) => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props

    listActions.setSorting(listId, param, asc)

    return this.requestItems(requestId)
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
      resetFilters: this.resetFilters,

      resetAllFilters: this.resetAllFilters,

      setSorting: this.setSorting,
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
