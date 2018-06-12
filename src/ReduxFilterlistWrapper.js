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

import recountListState from './recountListState';
import shouldSetLoadingState from './shouldSetLoadingState';

class ReduxFilterlistWrapper extends Component {
  static propTypes = {
    listId: listIdPropTypes.isRequired,

    loadItems: PropTypes.func.isRequired,
    onBeforeRequest: PropTypes.func,

    listState: listStatePropTypes({}).isRequired,

    listActions: PropTypes.shape({
      registerList: PropTypes.func.isRequired,
      destroyList: PropTypes.func.isRequired,

      changeListState: PropTypes.func.isRequired,

      loadListSuccess: PropTypes.func.isRequired,
      loadListError: PropTypes.func.isRequired,

      insertItem: PropTypes.func.isRequired,
      deleteItem: PropTypes.func.isRequired,
      updateItem: PropTypes.func.isRequired,
    }).isRequired,

    WrappedComponent: PropTypes.func.isRequired,
    reduxFilterlistParams: reduxFilterlistParamsShape.isRequired,

    // eslint-disable-next-line react/forbid-prop-types
    componentProps: PropTypes.object.isRequired,

    listStateMappers: listStateMappersShape,
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
      await this.setStateFromProps();
    }
  }

  componentWillUnmount() {
    const {
      listId,
    } = this.props;

    this.props.listActions.destroyList(listId);
  }

  setStateFromProps = async () => {
    const {
      reduxFilterlistParams: {
        getStateFromProps,
      },

      componentProps,
    } = this.props;

    const mappedState = getStateFromProps(componentProps);

    await this.requestItems('setStateFromProps', mappedState);
  }

  setAndApplyFilter = async (filterName, value) => {
    const {
      listState,

      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.setAndApplyFilter(listState, filterName, value);

    await this.requestItems('setAndApplyFilter', mappedState);
  }

  setFilterValue = async (filterName, value) => {
    const {
      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.setFilterValue(listState, filterName, value);

    await this.requestItems('setFilterValue', mappedState);
  }

  setFiltersValues = async (values) => {
    const {
      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.setFiltersValues(listState, values);

    await this.requestItems('setFiltersValues', mappedState);
  }

  setAndApplyFilters = async (values) => {
    const {
      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.setAndApplyFilters(listState, values);

    await this.requestItems('setAndApplyFilters', mappedState);
  }

  setSorting = async (param, asc) => {
    const {
      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.setSorting(listState, param, asc);

    await this.requestItems('setSorting', mappedState);
  }

  resetSorting = async () => {
    const {
      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.resetSorting(listState);

    await this.requestItems('resetSorting', mappedState);
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
      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.resetAllFilters(listState);

    await this.requestItems('resetAllFilters', mappedState);
  }

  resetFilters = async (filtersNames) => {
    const {
      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.resetFilters(listState, filtersNames);

    await this.requestItems('resetFilters', mappedState);
  }

  applyFilters = async (filtersNames) => {
    const {
      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.applyFilters(listState, filtersNames);

    await this.requestItems('applyFilters', mappedState);
  }

  resetFilter = async (filterName) => {
    const {
      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.resetFilter(listState, filterName);

    await this.requestItems('resetFilter', mappedState);
  }

  applyFilter = async (filterName) => {
    const {
      listState,
      listStateMappers,
    } = this.props;

    const mappedState = listStateMappers.applyFilter(listState, filterName);

    await this.requestItems('applyFilter', mappedState);
  }

  loadItems = async () => {
    await this.requestItems('loadItems', null);
  }

  loadItemsOnInit = async () => {
    await this.requestItems('loadItemsOnInit', null);
  }

  async requestItems(actionType, mappedState) {
    const {
      componentProps,
      listId,
      loadItems,
      listState,
      listActions,
      onBeforeRequest,
    } = this.props;

    const nextListState = recountListState(listState, mappedState);

    listActions.changeListState(listId, nextListState, actionType);

    if (!shouldSetLoadingState(mappedState)) {
      return;
    }

    if (onBeforeRequest) {
      onBeforeRequest(nextListState, componentProps, actionType);
    }

    let response;
    let error;
    let isSuccess;
    try {
      const successResponse = await loadItems(nextListState, componentProps);
      response = successResponse;
      isSuccess = true;
    } catch (catchedError) {
      error = catchedError;
      isSuccess = false;
    }

    if (isSuccess) {
      listActions.loadListSuccess(listId, response, nextListState.requestId);
      return;
    }

    if (error instanceof RequestCanceledError) {
      return;
    }

    if (error instanceof LoadListError) {
      listActions.loadListError(listId, error.errors, nextListState.requestId);
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
