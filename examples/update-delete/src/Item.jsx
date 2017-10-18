import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const itemPropTypes = PropTypes.shape({
  checked: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  brand: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
});

export default class Item extends Component {
  static propTypes = {
    item: itemPropTypes.isRequired,
    index: PropTypes.number.isRequired,

    toggleChecked: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,
  }

  toggleChecked = () => {
    const {
      index,

      toggleChecked,
    } = this.props;

    toggleChecked(index);
  }

  deleteItem = () => {
    const {
      index,

      deleteItem,
    } = this.props;

    deleteItem(index);
  }

  render() {
    const {
      item: {
        id,
        brand,
        owner,
        color,
        checked,
      },
    } = this.props;

    return (
      <tr>
        <td>
          <input
            type='checkbox'
            checked={checked}
            onChange={this.toggleChecked}
          />
        </td>

        <td>{ id }</td>
        <td>{ brand }</td>
        <td>{ owner }</td>
        <td>{ color }</td>

        <td>
          <button
            onClick={this.deleteItem}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  }
}
