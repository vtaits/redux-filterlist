import fetchMock from 'fetch-mock';

import carsGenerator from './carsGenerator';

function withDelay(response, time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, time);
  });
}

const cars = carsGenerator(50);

fetchMock.get(/\/cars/, (url) => {
  const searchParams = new URLSearchParams(url.split('?')[1]);

  const page = parseInt(searchParams.get('page'), 10);
  const perPage = parseInt(searchParams.get('per_page'), 10);

  const offset = (page - 1) * perPage;

  return withDelay({
    cars: cars.slice(offset, offset + perPage),
    count: cars.length,
  }, 2000);
});
