import React from 'react'

const style = {
  cursor: 'pointer',
  color: 'blue',
}

const Th = ({
  param,

  current,
  asc,

  children,

  setSorting,
}) => (
  <th
    onClick={ setSorting.bind(null, param) }
    style={ style }
  >
    { children }

    {
      param === current && (
        asc ?  '↓' : '↑'
      )
    }
  </th>
)

export default Th
