export const CHECK = 'CHECK'

export function check(carId, checked) {
  return {
    type: CHECK,
    payload: {
      carId,
      checked,
    },
  }
}
