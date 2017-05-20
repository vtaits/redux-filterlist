import React from 'react'

const buttonStyle = {
  display: 'inline-block',
  marginRight: '10px',
}

const clickableButtonStyle = Object.assign({}, buttonStyle, {
  color: 'blue',
  cursor: 'pointer',
})

const Paginator = ({
  count,
  perPage,
  current,

  setPage,
}) => {
  const pagesLength = Math.ceil(count / perPage)

  return (
    <div>
      {
        (() => {
          const res = []

          for (let i = 0; i < pagesLength; ++i) {
            const isCurrent = current === i + 1

            res.push(
              <div
                onClick={ isCurrent ? () => {} : setPage.bind(null, i + 1) }
                style={ isCurrent ? buttonStyle : clickableButtonStyle }
                key={ i }
              >
                { i + 1 }
              </div>
            )
          }

          return res
        })()
      }
    </div>
  )
}

export default Paginator
