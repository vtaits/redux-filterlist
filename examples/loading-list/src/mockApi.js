import fetchMock from 'fetch-mock'

function withDelay(response, time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(response);
    }, time)
  })
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
]

fetchMock.get(/\/cars/, function(url) {
  const searchParams = new URLSearchParams(url.split('?')[1])

  const offset = parseInt(searchParams.get('offset'))
  const limit = parseInt(searchParams.get('limit'))

  return withDelay({
    cars: cars.slice(offset, offset + limit),
    count: cars.length,
  }, 2000)
})
