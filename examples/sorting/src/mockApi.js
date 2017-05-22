import fetchMock from 'fetch-mock'

import carsGenerator from './carsGenerator'

function withDelay(response, time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(response);
    }, time)
  })
}

const cars = carsGenerator(50)

fetchMock.get(/\/cars/, function(url) {
  const searchParams = new URLSearchParams(url.split('?')[1])

  const page = parseInt(searchParams.get('page'))
  const perPage = parseInt(searchParams.get('per_page'))

  const sort = searchParams.get('sort')
  const desc = sort && sort[0] === '-'
  const sortParam = sort && (desc ? sort.substring(1, sort.length) : sort)

  const sortedCars = sort ?
    cars.sort((car1, car2) => {
      if (car1[sortParam] > car2[sortParam]) {
        return desc ? -1 : 1
      }

      return desc ? 1 : -1
    }) :
    cars

  const offset = (page - 1) * perPage

  return withDelay({
    cars: sortedCars.slice(offset, offset + perPage),
    count: cars.length,
  }, 2000)
})
