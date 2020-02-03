import { getAssetInfo } from './asset'
import { removeDuplicateBarcode, checkIfHasSameBarcode } from './duplicateBarcodeTest'
import { storeIssues, QA_RULE } from './qa'

export const qaHelper = (asset, allRecords, isRemoving, assetType) => {
  // for now we don't have qa for any other data except asset
  if (assetType !== 'asset') {
    return
  }
  // Especially when delete
  if (isRemoving) {
    switch (assetType) {
      case 'asset':
        removeDuplicateBarcode({
          justOne: true,
          id: asset.id,
        })
        break
      default:
        break
    }
    return
  }
  const assetData = asset.facets
  // Filter assets in the same facility
  const { facilityId, id } = asset
  const filtered = allRecords.assets.filter(
    assetItem => assetItem.facilityId === facilityId && assetItem.id !== id,
  )

  const duplicatedBarCode = [{ ...asset }]
  switch (assetType) {
    case 'asset':
      filtered.forEach(assetItem => {
        // Check Duplicated BarCode Issue
        if (checkIfHasSameBarcode(assetData, assetItem)) {
          duplicatedBarCode.push(assetItem)
        }
      })

      removeDuplicateBarcode({
        justOne: true,
        id: asset.id,
      })
      if (duplicatedBarCode.length >= 2) {
        storeIssues(
          asset.id,
          QA_RULE.DUPLICATE_BARCDE,
          duplicatedBarCode.map((item, index) => ({
            text: getAssetInfo(item, allRecords, index === 0, assetType),
            id: item.id,
          })),
          assetData.barcode,
        )
      }
      break
    default:
      break
  }
}

export const runQA = allRecords => {
  localStorage.removeItem('qaIssues')

  // run qa for facilities
  allRecords.facilities.forEach(asset => qaHelper(asset, allRecords, false, 'facility'))
  // run qa for floors
  allRecords.floors.forEach(asset => qaHelper(asset, allRecords, false, 'floor'))
  // run qa for spaces
  allRecords.spaces.forEach(asset => qaHelper(asset, allRecords, false, 'space'))
  // run qa for assets
  allRecords.assets
    .filter(asset => asset.spaceId)
    .forEach(asset => qaHelper(asset, allRecords, false, 'asset'))
  // run qa for virtual assets
  allRecords.assets
    .filter(asset => !asset.spaceId)
    .forEach(asset => qaHelper(asset, allRecords, false, 'va'))

  localStorage.setItem('qaIssuesTime', new Date().toISOString())
}
