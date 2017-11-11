import React, { Component } from 'react';
import PropTypes from 'prop-types';

const style = {
  cursor: 'pointer',
  color: 'blue',
};

class Th extends Component {
  static propTypes = {
    param: PropTypes.string.isRequired,

    current: PropTypes.string,
    asc: PropTypes.bool.isRequired,

    children: PropTypes.node,

    setSorting: PropTypes.func.isRequired,
  }

  static defaultProps = {
    current: null,
    children: null,
  }

  setSorting = () => {
    const {
      param,

      setSorting,
    } = this.props;

    setSorting(param);
  }

  render() {
    const {
      param,

      current,
      asc,

      children,
    } = this.props;

    return (
      <th
        onClick={this.setSorting}
        style={style}
      >
        { children }

        {
          param === current && (
            asc ? '↓' : '↑'
          )
        }
      </th>
    );
  }
}

export default Th;
