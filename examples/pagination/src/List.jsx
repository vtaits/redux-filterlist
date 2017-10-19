import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {reduxFilterlist, filterlistPropTypes} from 'redux-filterlist';

import Paginator from './Paginator';

class List extends Component {
  static propTypes = {
    ...filterlistPropTypes({
      item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        brand: PropTypes.string.isRequired,
        owner: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
      }),

      additional: PropTypes.shape({
        count: PropTypes.number.isRequired,
        loaded: PropTypes.bool.isRequired,
      }).isRequired,

      filters: PropTypes.shape({
        page: PropTypes.number.isRequired,
        perPage: PropTypes.number.isRequired,
      }),
    }),
  }

  setPage = (page) => {
    const {
      setAndApplyFilter,
    } = this.props;

    setAndApplyFilter('page', page);
  }

  setPageLength = ({ target: { value }}) => {
    const {
      setAndApplyFilter,
    } = this.props;

    setAndApplyFilter('perPage', parseInt(value, 10));
  }

  render() {
    const {
      listState: {
        additional,
        items,
        loading,

        appliedFilters: {
          page,
          perPage,
        },
      },
    } = this.props;

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>brand</th>
              <th>owner</th>
              <th>color</th>
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
                <tr key={ id }>
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
          additional.loaded ? (
            <h4>
              Total: { additional.count }
            </h4>
          ) : (
            <h4>
              First request
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
            value={ perPage }
            onChange={this.setPageLength}
          >
            <option value='10'>10</option>
            <option value='20'>20</option>
            <option value='30'>30</option>
          </select>
        </p>

        {
          additional.loaded && (
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

export default reduxFilterlist({
  listId: 'pagination',
  alwaysResetFilters: {
    page: 1,
  },
  appliedFilters: {
    page: 1,
    perPage: 10,
  },
  additional: {
    count: 0,
    loaded: false,
  },
  loadItems: ({
    appliedFilters: {
      page,
      perPage,
    },
  }) => fetch(`/cars?page=${page}&per_page=${perPage}`)
    .then((response) => response.json())
    .then(({ cars, count }) => ({
      items: cars,
      additional: {
        count: count,
        loaded: true,
      },
    })),
})(List);
