import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash.isequal';

import { listIdPropTypes, listStatePropTypes } from './propTypes';
import { LoadListError, RequestCanceledError } from './errors';

class ReduxFilterlistWrapper extends Component {
  static propTypes = {
    listId: listIdPropTypes.isRequired,

    loadItems: PropTypes.func.isRequired,
    onBeforeRequest: PropTypes.func,

    listState: listStatePropTypes({}).isRequired,

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

      deleteItem: PropTypes.func.isRequired,
      updateItem: PropTypes.func.isRequired,
    }).isRequired,

    WrappedComponent: PropTypes.func.isRequired,
    reduxFilterlistParams: PropTypes.object.isRequired,

    componentProps: PropTypes.object.isRequired,
  }

  static defaultProps = {
    onBeforeRequest: null,
  }

  componentWillMount() {
    const {
      listId,
      reduxFilterlistParams,
    } = this.props;

    this.props.listActions.registerList(listId, reduxFilterlistParams);
  }

  componentDidMount() {
    this.loadItems()
      .catch(() => {});
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.listState !== this.props.listState ||
      !isEqual(nextProps.componentProps, this.props.componentProps);
  }

  componentWillUnmount() {
    const {
      listId,
    } = this.props;

    this.props.listActions.destroyList(listId);
  }

  setAndApplyFilter = (filterName, value) => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props;

    listActions.setAndApplyFilter(listId, filterName, value);

    return this.requestItems(requestId);
  }

  setFilterValue = (filterName, value) => {
    const {
      listId,
      listActions,
    } = this.props;

    listActions.setFilterValue(listId, filterName, value);
  }

  setFiltersValues = (values) => {
    const {
      listId,
      listActions,
    } = this.props;

    listActions.setFiltersValues(listId, values);
  }

  setAndApplyFilters = (values) => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props;

    listActions.setAndApplyFilters(listId, values);

    return this.requestItems(requestId);
  }

  setSorting = (param, asc) => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props;

    listActions.setSorting(listId, param, asc);

    return this.requestItems(requestId);
  }

  deleteItem = (itemIndex, additional) => {
    const {
      listId,
      listActions,
    } = this.props;

    listActions.deleteItem(listId, itemIndex, additional);
  }

  updateItem = (itemIndex, item, additional) => {
    const {
      listId,
      listActions,
    } = this.props;

    listActions.updateItem(listId, itemIndex, item, additional);
  }

  resetAllFilters = () => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props;

    listActions.resetAllFilters(listId);

    return this.requestItems(requestId);
  }

  resetFilters = (filtersNames) => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props;

    listActions.resetFilters(listId, filtersNames);

    return this.requestItems(requestId);
  }

  applyFilters = (filtersNames) => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props;

    listActions.applyFilters(listId, filtersNames);

    return this.requestItems(requestId);
  }

  resetFilter = (filterName) => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props;

    listActions.resetFilter(listId, filterName);

    return this.requestItems(requestId);
  }

  applyFilter = (filterName) => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props;

    listActions.applyFilter(listId, filterName);

    return this.requestItems(requestId);
  }

  loadItems = () => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props;

    listActions.loadList(listId);

    return this.requestItems(requestId);
  }

  requestItems(requestId) {
    const incrementedRequestId = requestId + 1;

    // wait for props update
    return new Promise((resolve, reject) => {
      const iteration = () => {
        const currentRequestId = this.props.listState.requestId;

        if (currentRequestId > incrementedRequestId) {
          reject(new RequestCanceledError());
        }

        if (currentRequestId === incrementedRequestId) {
          resolve();

          return;
        }

        setTimeout(iteration);
      };

      setTimeout(iteration);
    })
      .then(() => {
        const {
          componentProps,
          listId,
          loadItems,
          listState,
          listActions,
          onBeforeRequest,
        } = this.props;

        if (incrementedRequestId !== listState.requestId) {
          return Promise.reject(new RequestCanceledError());
        }

        if (onBeforeRequest) {
          onBeforeRequest(listState, componentProps);
        }

        return loadItems(listState, componentProps)
          .then((response) => {
            if (incrementedRequestId !== this.props.listState.requestId) {
              return Promise.reject(new RequestCanceledError());
            }

            listActions.loadListSuccess(listId, response);

            return Promise.resolve();
          }, (response) => {
            if (incrementedRequestId !== this.props.listState.requestId) {
              return Promise.reject(new RequestCanceledError());
            }

            listActions.loadListError(listId, response);

            return Promise.reject(new LoadListError(response));
          });
      })
      .catch((error) => {
        if (this.props.listState.catchRejects) {
          return Promise.reject(error);
        }

        return Promise.resolve();
      });
  }

  collectComponentProps() {
    const {
      componentProps,
      listId,
      listState,
    } = this.props;

    return {
      ...componentProps,

      listId,
      listState,
      loadItems: this.loadItems,

      setFilterValue: this.setFilterValue,
      applyFilter: this.applyFilter,
      setAndApplyFilter: this.setAndApplyFilter,
      resetFilter: this.resetFilter,

      setFiltersValues: this.setFiltersValues,
      applyFilters: this.applyFilters,
      setAndApplyFilters: this.setAndApplyFilters,
      resetFilters: this.resetFilters,

      resetAllFilters: this.resetAllFilters,

      setSorting: this.setSorting,

      deleteItem: this.deleteItem,
      updateItem: this.updateItem,
    };
  }

  render() {
    const {
      WrappedComponent,
    } = this.props;

    return createElement(WrappedComponent, this.collectComponentProps());
  }
}

export default ReduxFilterlistWrapper;
