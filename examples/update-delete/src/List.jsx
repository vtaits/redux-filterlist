import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {reduxFilterlist, filterlistPropTypes} from 'redux-filterlist'

import Item, { itemPropTypes } from './Item';

class List extends Component {
  state = {
    brand: '',
    owner: '',
    color: '',
  }

  setFormValue(fieldName, event) {
    this.setState({
      [fieldName]: event.target.value,
    });
  }

  setBrand = (event) => {
    this.setFormValue('brand', event);
  }

  setOwner = (event) => {
    this.setFormValue('owner', event);
  }

  setColor = (event) => {
    this.setFormValue('color', event);
  }

  addItem = (event) => {
    event.preventDefault();

    const {
      listState: {
        items,
        additional: {
          count,
        },
      },

      insertItem,
    } = this.props;

    const {
      brand,
      owner,
      color,
    } = this.state;

    const maxId = items.reduce((res, item) => Math.max(res, item.id), 0);

    const newItem = {
      id: maxId + 1,
      checked: false,
      brand,
      owner,
      color,
    };

    this.props.insertItem(0, newItem, {
      count: count + 1,
    });

    this.setState({
      brand: '',
      owner: '',
      color: '',
    });
  }

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

    const {
      brand,
      owner,
      color,
    } = this.state;

    return (
      <div>
        <form onSubmit={this.addItem}>
          <div>
            <label htmlFor="id_brand">
              Brand:
            </label>

            <input
              type="text"
              id="id_brand"
              name="brand"
              value={brand}
              onChange={this.setBrand}
            />
          </div>

          <div>
            <label htmlFor="id_owner">
              Owner:
            </label>

            <input
              type="text"
              id="id_owner"
              name="owner"
              value={owner}
              onChange={this.setOwner}
            />
          </div>

          <div>
            <label htmlFor="id_color">
              Color:
            </label>

            <input
              type="text"
              id="id_color"
              name="color"
              value={color}
              onChange={this.setColor}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            Add item
          </button>
        </form>

        <br />

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
