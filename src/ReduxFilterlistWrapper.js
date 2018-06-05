import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash.isequal';

import {
  listIdPropTypes,
  listStatePropTypes,
  listStateMappersShape,
  reduxFilterlistParamsShape,
} from './propTypes';
import { LoadListError, RequestCanceledError } from './errors';
import * as allListStateMappers from './listStateMappers';

class ReduxFilterlistWrapper extends Component {
  static propTypes = {
    listId: listIdPropTypes.isRequired,

    loadItems: PropTypes.func.isRequired,
    onBeforeRequest: PropTypes.func,

    listState: listStatePropTypes({}).isRequired,

    listActions: PropTypes.shape({
      registerList: PropTypes.func.isRequired,
      destroyList: PropTypes.func.isRequired,

      setStateFromProps: PropTypes.func.isRequired,

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
      resetSorting: PropTypes.func.isRequired,

      insertItem: PropTypes.func.isRequired,
      deleteItem: PropTypes.func.isRequired,
      updateItem: PropTypes.func.isRequired,
    }).isRequired,

    WrappedComponent: PropTypes.func.isRequired,
    reduxFilterlistParams: reduxFilterlistParamsShape.isRequired,

    // eslint-disable-next-line react/forbid-prop-types
    componentProps: PropTypes.object.isRequired,

    listStateMappers: listStateMappersShape.isRequired,
  }

  static defaultProps = {
    onBeforeRequest: null,

    listStateMappers: allListStateMappers,
  }

  componentWillMount() {
    const {
      listId,
      reduxFilterlistParams,
      componentProps,
    } = this.props;

    this.props.listActions.registerList(listId, reduxFilterlistParams, componentProps);
  }

  async componentDidMount() {
    if (this.props.listState.autoload) {
      await this.loadItemsOnInit();
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.listState !== this.props.listState ||
      !isEqual(nextProps.componentProps, this.props.componentProps);
  }

  async componentDidUpdate(prevProps) {
    const {
      shouldRecountState,
      getStateFromProps,
    } = this.props.reduxFilterlistParams;

    if (
      getStateFromProps &&
      shouldRecountState &&
      shouldRecountState(this.props.componentProps, prevProps.componentProps)
    ) {
      const {
        appliedFilters,
        sort,
      } = getStateFromProps(this.props.componentProps);

      await this.setStateFromProps(appliedFilters, sort);
    }
  }

  componentWillUnmount() {
    const {
      listId,
    } = this.props;

    this.props.listActions.destroyList(listId);
  }

  setStateFromProps = async (appliedFilters, sort) => {
    const {
      listId,
      listActions,
      listState,

      reduxFilterlistParams: {
        getStateFromProps,
      },

      componentProps,
    } = this.props;

    const mappedState = getStateFromProps(componentProps);

    listActions.setStateFromProps(listId, appliedFilters, sort);

    await this.requestItems(listState.requestId, 'setStateFromProps', mappedState);
  }

  setAndApplyFilter = async (filterName, value) => {
    const {
      listId,
      listActions,
      listState,

      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.setAndApplyFilter(listState, filterName, value);
    
    listActions.setAndApplyFilter(listId, filterName, value);

    await this.requestItems(listState.requestId, 'setAndApplyFilter', mappedState);
  }

  setFilterValue = async (filterName, value) => {
    const {
      listId,
      listActions,

      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.setFilterValue(listState, filterName, value);
    
    listActions.setFilterValue(listId, filterName, value);

    // await this.requestItems(listState.requestId, 'setFilterValue', mappedState);
  }

  setFiltersValues = async (values) => {
    const {
      listId,
      listActions,

      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.setFiltersValues(listState, values);
    
    listActions.setFiltersValues(listId, values);

    // await this.requestItems(listState.requestId, 'setFiltersValues', mappedState);
  }

  setAndApplyFilters = async (values) => {
    const {
      listId,
      listActions,

      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.setAndApplyFilters(listState, values);
    
    listActions.setAndApplyFilters(listId, values);

    await this.requestItems(listState.requestId, 'setAndApplyFilters', mappedState);
  }

  setSorting = async (param, asc) => {
    const {
      listId,
      listActions,

      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.setSorting(listState, param, asc);
    
    listActions.setSorting(listId, param, asc);

    await this.requestItems(listState.requestId, 'setSorting', mappedState);
  }

  resetSorting = async () => {
    const {
      listId,
      listActions,

      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.resetSorting(listState);

    listActions.resetSorting(listId);

    await this.requestItems(listState.requestId, 'resetSorting', mappedState);
  }

  insertItem = (itemIndex, item, additional) => {
    const {
      listId,
      listActions,
    } = this.props;

    listActions.insertItem(listId, itemIndex, item, additional);
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

  resetAllFilters = async () => {
    const {
      listId,
      listActions,

      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.resetAllFilters(listState);

    listActions.resetAllFilters(listId);

    await this.requestItems(listState.requestId, 'resetAllFilters', mappedState);
  }

  resetFilters = async (filtersNames) => {
    const {
      listId,
      listActions,

      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.resetFilters(listState, filtersNames);

    listActions.resetFilters(listId, filtersNames);

    await this.requestItems(listState.requestId, 'resetFilters', mappedState);
  }

  applyFilters = async (filtersNames) => {
    const {
      listId,
      listActions,

      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.applyFilters(listState, filtersNames);
    
    listActions.applyFilters(listId, filtersNames);

    await this.requestItems(listState.requestId, 'applyFilters', mappedState);
  }

  resetFilter = async (filterName) => {
    const {
      listId,
      listActions,

      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.resetFilter(listState, filterName);

    listActions.resetFilter(listId, filterName);

    await this.requestItems(listState.requestId, 'resetFilter', mappedState);
  }

  applyFilter = async (filterName) => {
    const {
      listId,
      listActions,

      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.applyFilter(listState, filterName);
    
    listActions.applyFilter(listId, filterName);

    await this.requestItems(listState.requestId, 'applyFilter', mappedState);
  }

  loadItems = async () => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props;

    listActions.loadList(listId);

    await this.requestItems(requestId, 'loadItems');
  }

  loadItemsOnInit = async () => {
    const {
      listId,
      listActions,
      listState: {
        requestId,
      },
    } = this.props;

    listActions.loadList(listId);

    await this.requestItems(requestId, 'loadItemsOnInit');
  }

  waitForRequestIdUpdate(incrementedRequestId) {
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
    });
  }

  async requestItems(requestId, actionType) {
    const incrementedRequestId = requestId + 1;

    try {
      await this.waitForRequestIdUpdate(incrementedRequestId);
    } catch (catchedError) {
      if (catchedError instanceof RequestCanceledError) {
        return;
      }

      throw catchedError;
    }

    const {
      componentProps,
      listId,
      loadItems,
      listState,
      listActions,
      onBeforeRequest,
    } = this.props;

    if (incrementedRequestId !== listState.requestId) {
      return;
    }

    if (onBeforeRequest) {
      onBeforeRequest(listState, componentProps, actionType);
    }

    let response;
    let error;
    let isSuccess;
    try {
      const successResponse = await loadItems(listState, componentProps);
      response = successResponse;
      isSuccess = true;
    } catch (catchedError) {
      error = catchedError;
      isSuccess = false;
    }

    if (incrementedRequestId !== this.props.listState.requestId) {
      return;
    }

    if (isSuccess) {
      listActions.loadListSuccess(listId, response);
      return;
    }

    if (error instanceof RequestCanceledError) {
      return;
    }

    if (error instanceof LoadListError) {
      listActions.loadListError(listId, error.errors);
      return;
    }

    throw error;
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
      resetSorting: this.resetSorting,

      insertItem: this.insertItem,
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
