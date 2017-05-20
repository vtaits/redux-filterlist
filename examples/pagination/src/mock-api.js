import fetchMock from 'fetch-mock'

import carsGenerator from './cars-generator'

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

  const offset = (page - 1) * perPage

  return withDelay({
    cars: cars.slice(offset, offset + perPage),
    count: cars.length,
  }, 2000)
})
