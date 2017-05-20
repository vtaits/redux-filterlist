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

  const brand = (searchParams.get('brand') || '').toLowerCase()
  const owner = (searchParams.get('owner') || '').toLowerCase()

  const hideYellow = !!searchParams.get('hideYellow')
  const hideRed = !!searchParams.get('hideRed')
  const hideBlue = !!searchParams.get('hideBlue')

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

  const filteredCars = sortedCars.filter((car) => {
    if (brand && !car.brand.toLowerCase().includes(brand)) {
      return false
    }

    if (owner && !car.owner.toLowerCase().includes(owner)) {
      return false
    }

    if (hideYellow && car.color === 'yellow') {
      return false
    }

    if (hideBlue && car.color === 'blue') {
      return false
    }

    if (hideRed && car.color === 'red') {
      return false
    }

    return true
  })

  const offset = (page - 1) * perPage

  return withDelay({
    cars: filteredCars.slice(offset, offset + perPage),
    count: filteredCars.length,
  }, 2000)
})
