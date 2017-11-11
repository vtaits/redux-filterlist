import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { reduxFilterlist, filterlistPropTypes } from 'redux-filterlist';

import Paginator from './Paginator';
import Th from './Th';

import constructUrl from './constructUrl';

class List extends Component {
  setPerPage = ({ target: { value } }) => {
    const {
      setAndApplyFilter,
    } = this.props;

    setAndApplyFilter('perPage', parseInt(value, 10));
  }

  setPage = (page) => {
    const {
      setAndApplyFilter,
    } = this.props;

    setAndApplyFilter('page', page);
  }

  render() {
    const {
      listState: {
        additional,
        items,
        loading,

        sort,

        appliedFilters: {
          page,
          perPage,
        },
      },

      setSorting,
      resetSorting,
    } = this.props;

    return (
      <div>
        <div>
          <button onClick={resetSorting}>
            Reset sorting
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <Th
                param="id"
                current={sort.param}
                asc={sort.asc}
                setSorting={setSorting}
              >
                id
              </Th>

              <Th
                param="brand"
                current={sort.param}
                asc={sort.asc}
                setSorting={setSorting}
              >
                brand
              </Th>

              <Th
                param="owner"
                current={sort.param}
                asc={sort.asc}
                setSorting={setSorting}
              >
                owner
              </Th>

              <Th
                param="color"
                current={sort.param}
                asc={sort.asc}
                setSorting={setSorting}
              >
                color
              </Th>
            </tr>
          </thead>

          <tbody>
            {
              items.map(({
                id,
                brand,
                owner,
                color,
              }) => (
                <tr key={id}>
                  <td>{ id }</td>
                  <td>{ brand }</td>
                  <td>{ owner }</td>
                  <td>{ color }</td>
                </tr>
              ))
            }
          </tbody>
        </table>


        {
          additional && (
            <h4>
              Total: { additional.count }
            </h4>
          )
        }

        {
          loading && (
            <h3>Loading...</h3>
          )
        }

        <p>
          Items per page:
          {' '}
          <select
            value={perPage}
            onChange={this.setPerPage}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
        </p>

        {
          additional && (
            <Paginator
              count={additional.count}
              perPage={perPage}
              current={page}

              setPage={this.setPage}
            />
          )
        }
      </div>
    );
  }
}

List.propTypes = {
  ...filterlistPropTypes({
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
      brand: PropTypes.string.isRequired,
      owner: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),

    additional: PropTypes.shape({
      count: PropTypes.number.isRequired,
    }),

    filters: PropTypes.shape({
      page: PropTypes.number.isRequired,
      perPage: PropTypes.number.isRequired,
    }),
  }),
};

export default reduxFilterlist({
  listId: 'sorting',
  alwaysResetFilters: {
    page: 1,
  },
  appliedFilters: {
    page: 1,
    perPage: 10,
  },
  loadItems: ({
    sort,
    appliedFilters: {
      page,
      perPage,
    },
  }) => fetch(constructUrl('/cars', {
    page,
    per_page: perPage,
    sort: `${sort.param ? `${sort.asc ? '' : '-'}${sort.param}` : ''}`,
  }))
    .then(response => response.json())
    .then(({ cars, count }) => ({
      items: cars,
      additional: {
        count,
      },
    })),
})(List);
