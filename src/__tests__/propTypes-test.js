import PropTypes from 'prop-types';
import checkPropTypes from 'check-prop-types';

import {
  listIdPropTypes,
  listStatePropTypes,
  filterlistPropTypes,
} from '../propTypes';

import listInitialState from '../listInitialState';

describe('listIdPropTypes', () => {
  test('should accept number as list id', () => {
    expect(checkPropTypes(
      {
        id: listIdPropTypes,
      },
      {
        id: 1,
      },
      'prop',
      'TestComponentName',
    ))
      .toBeFalsy();
  });

  test('should accept string as list id', () => {
    expect(checkPropTypes(
      {
        id: listIdPropTypes,
      },
      {
        id: '1',
      },
      'prop',
      'TestComponentName',
    ))
      .toBeFalsy();
  });
});

describe('listStatePropTypes', () => {
  test('should throw an exception if list state config is not an object', () => {
    expect(() => {
      listStatePropTypes(123);
    })
      .toThrowError('List state config should be an object');
  });

  test('should throw an exception if list state config is null', () => {
    expect(() => {
      listStatePropTypes(null);
    })
      .toThrowError('List state config can\'t be null');
  });

  test('should accept listInitialState', () => {
    expect(checkPropTypes(
      {
        listState: listStatePropTypes({}),
      },
      {
        listState: listInitialState,
      },
      'prop',
      'TestComponentName',
    ))
      .toBeFalsy();
  });

  test('should accept custom items', () => {
    expect(checkPropTypes(
      {
        listState: listStatePropTypes({
          item: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            value: PropTypes.shape({
              label: PropTypes.string.isRequired,
            }).isRequired,
          }),
        }),
      },
      {
        listState: {
          ...listInitialState,
          items: [{
            id: 1,
            name: 'test string',
            value: {
              label: 'label of test object',
            },
          }],
        },
      },
      'prop',
      'TestComponentName',
    ))
      .toBeFalsy();
  });

  test('should accept custom additional', () => {
    expect(checkPropTypes(
      {
        listState: listStatePropTypes({
          additional: PropTypes.shape({
            count: PropTypes.number.isRequired,
            amazingParam: PropTypes.string.isRequired,
          }),
        }),
      },
      {
        listState: {
          ...listInitialState,
          additional: {
            count: 123,
            amazingParam: 'test',
          },
        },
      },
      'prop',
      'TestComponentName',
    ))
      .toBeFalsy();
  });

  test('should accept custom error', () => {
    expect(checkPropTypes(
      {
        listState: listStatePropTypes({
          error: PropTypes.shape({
            status: PropTypes.number.isRequired,
            message: PropTypes.string.isRequired,
          }),
        }),
      },
      {
        listState: {
          ...listInitialState,
          error: {
            status: 500,
            message: 'Test error',
          },
        },
      },
      'prop',
      'TestComponentName',
    ))
      .toBeFalsy();
  });

  test('should accept custom filters', () => {
    expect(checkPropTypes(
      {
        listState: listStatePropTypes({
          filters: PropTypes.shape({
            strFilter: PropTypes.string,
            numberFilter: PropTypes.number,
            requiredNumberFilter: PropTypes.number.isRequired,
          }),
        }),
      },
      {
        listState: {
          ...listInitialState,
          filters: {
            strFilter: '123',
            numberFilter: 123,
            requiredNumberFilter: 456,
          },
          appliedFilters: {
            requiredNumberFilter: 123,
          },
          error: {
            status: 500,
            message: 'Test error',
          },
        },
      },
      'prop',
      'TestComponentName',
    ))
      .toBeFalsy();
  });
});

describe('filterlistPropTypes', () => {
  test('should accept props of decorated component', () => {
    expect(checkPropTypes(
      filterlistPropTypes({}),
      {
        listId: 1,
        listState: listInitialState,

        loadItems: () => {},

        setFilterValue: () => {},
        applyFilter: () => {},
        setAndApplyFilter: () => {},
        resetFilter: () => {},

        setFiltersValues: () => {},
        applyFilters: () => {},
        setAndApplyFilters: () => {},
        resetFilters: () => {},

        resetAllFilters: () => {},

        setSorting: () => {},
        resetSorting: () => {},

        insertItem: () => {},
        deleteItem: () => {},
        updateItem: () => {},
      },
      'prop',
      'TestComponentName',
    ))
      .toBeFalsy();
  });
});
