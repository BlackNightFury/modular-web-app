import { getFormattedDateTimeString, getBrowserLocaledDateTimeString } from './datetime'

describe('Get formatted datetime string', () => {
  it('should return default formatted datetime string', () => {
    const mockDateString = '2019-07-05 03:55'

    expect(getFormattedDateTimeString(mockDateString, 'DD/MM/YYYY HH:mm')).toEqual(
      '05/07/2019 03:55',
    )
  })
})

describe('Get formatted datetime string based on browser locale', () => {
  it('should return en_US localed string', () => {
    const mockDateString = '2019-07-05 03:55'
    window.navigator.userLanguage = 'en-US'
    expect(getBrowserLocaledDateTimeString(mockDateString, true)).toEqual('07/05/2019 3:55 AM')
  })

  it('should return en-GB localed string', () => {
    const mockDateString = '2019-07-05 03:55'
    window.navigator.userLanguage = 'en-GB'
    expect(getBrowserLocaledDateTimeString(mockDateString, true)).toEqual('05/07/2019 03:55')
  })
})
