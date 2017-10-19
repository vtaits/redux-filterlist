import React, { Component } from 'react';
import PropTypes from 'prop-types';

const buttonStyle = {
  display: 'inline-block',
  marginRight: '10px',
};

const clickableButtonStyle = {
  ...buttonStyle,
  color: 'blue',
  cursor: 'pointer',
};

class PageButton extends Component {
  static propTypes = {
    pageNumber: PropTypes.number.isRequired,
    isCurrent: PropTypes.bool.isRequired,

    setPage: PropTypes.func.isRequired,
  }

  onClick = () => {
    const {
      pageNumber,
      isCurrent,

      setPage,
    } = this.props;

    if (isCurrent) {
      return;
    }

    setPage(pageNumber);
  }

  render() {
    const {
      pageNumber,
      isCurrent,
    } = this.props;

    return (
      <div
        onClick={this.onClick}
        style={isCurrent ? buttonStyle : clickableButtonStyle}
      >
        {pageNumber}
      </div>
    );
  }
}

export default PageButton;
