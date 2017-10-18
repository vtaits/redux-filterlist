import fetchMock from 'fetch-mock';

function withDelay(response, time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, time);
  });
}

const cars = [
  {
    id: 1,
    brand: 'Audi',
    owner: 'Tom',
    color: 'yellow',
  },
  {
    id: 2,
    brand: 'Mercedes',
    owner: 'Henry',
    color: 'white',
  },
  {
    id: 3,
    brand: 'BMW',
    owner: 'Alex',
    color: 'black',
  },
];

fetchMock.get('/cars', withDelay(cars, 2000));
