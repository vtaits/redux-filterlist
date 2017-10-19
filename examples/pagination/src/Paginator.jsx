import React from 'react';

import PageButton from './PageButton';

const Paginator = ({
  count,
  perPage,
  current,

  setPage,
}) => {
  const pagesLength = Math.ceil(count / perPage);

  const pages = [];

  for (let i = 0; i < pagesLength; ++i) {
    pages.push(
      <PageButton
        pageNumber={i + 1}
        isCurrent={current === i + 1}
        setPage={setPage}
        key={i}
      />
    )
  }

  return (
    <div>
      {pages}
    </div>
  );
};

export default Paginator;
