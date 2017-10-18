import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {reduxFilterlist, filterlistPropTypes} from 'redux-filterlist'

import Item, { itemPropTypes } from './Item';

class List extends Component {
  toggleChecked = (itemIndex) => {
    const {
      listState: {
        items,
      },

      updateItem,
    } = this.props;

    const item = items[itemIndex];

    const updatedItem = {
      ...item,
      checked: !item.checked,
    };

    updateItem(itemIndex, updatedItem);
  }

  deleteItem = (itemIndex) => {
    const {
      listState: {
        additional: {
          count,
        },
      },

      deleteItem,
    } = this.props;

    deleteItem(itemIndex, {
      count: count - 1,
    });
  }

  render() {
    const {
      listState: {
        additional,
        items,
        loading,
      },

      check,
    } = this.props;

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th />
              <th>id</th>
              <th>brand</th>
              <th>owner</th>
              <th>color</th>
            </tr>
          </thead>

          <tbody>
            {
              items.map((item, index) => (
                <Item
                  item={item}
                  index={index}
                  toggleChecked={this.toggleChecked}
                  deleteItem={this.deleteItem}
                  key={item.id}
                />
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
      </div>
    );
  }
}

List.propTypes = {
  ...filterlistPropTypes({
    item: itemPropTypes,

    additional: PropTypes.shape({
      count: PropTypes.number.isRequired,
    }),
  }),
}

export default reduxFilterlist({
  listId: 'updateDeleteList',
  loadItems: () => fetch('/cars')
    .then((response) => response.json())
    .then((cars) => ({
      items: cars.map((car) => ({
        ...car,
        checked: false,
      })),
      additional: {
        count: cars.length,
      },
    })),
})(List)
