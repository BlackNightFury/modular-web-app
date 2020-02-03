import moment from 'moment'

export const getFormattedDateTimeString = (dateString, newFormat) =>
  moment(dateString).format(newFormat)

export const getLocalDateTimeFormat = type => {
  // Get user locale
  const locale = window.navigator.userLanguage || window.navigator.language
  // Set locale to moment
  moment.locale(locale)

  // Get locale data
  const localeData = moment.localeData()
  return localeData.longDateFormat(type)
}

export const getBrowserLocaledDateTimeString = (dateString, includeTime, isTimeFirst) => {
  const dateFormat = getLocalDateTimeFormat('L')
  const timeFormat = getLocalDateTimeFormat('LT')
  if (includeTime) {
    if (isTimeFirst) {
      return getFormattedDateTimeString(dateString, `${timeFormat} - ${dateFormat}`)
    }
    return getFormattedDateTimeString(dateString, `${dateFormat} ${timeFormat}`)
  }
  return getFormattedDateTimeString(dateString, dateFormat)
}
