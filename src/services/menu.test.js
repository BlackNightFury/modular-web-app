import { cartesianProductOf } from './menu'

describe('Getting all permuatations', () => {
  it('should return 4 permutations', () => {
    const inputArray = [['a'], ['b', 'c']]
    const results = []
    cartesianProductOf(inputArray, results, 0, [])
    expect(results).toEqual([['a'], ['a', 'b'], ['a', 'c']])
  })
})
