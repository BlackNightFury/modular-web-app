const makeURL = url => url.replace(/\s+/g, '-').toLowerCase()
export const checkIfFacilityCompleted = (formResponses, facilities, facilityNameEncoded) => {
  const currentFacility = facilities.find(
    facility => makeURL(facility.name) === facilityNameEncoded,
  )
  const currentFacilityId = currentFacility ? currentFacility.id : ''
  return (
    formResponses.findIndex(formResponse => {
      const { facilityId, type, status } = JSON.parse(formResponse.response)
      return (
        currentFacilityId === facilityId && type === 'facility-completion' && status === 'Complete'
      )
    }) > -1
  )
}

export default {}
