import { getIssues, QA_RULE } from './qa'

export const removeDuplicateBarcode = options => {
  const qaIssues = getIssues()

  let filteredIssues = qaIssues
  const { justOne, id } = options
  if (!justOne) {
    filteredIssues = qaIssues.filter(
      issue => issue.type !== QA_RULE.DUPLICATE_BARCDE || issue.id !== id,
    )
  } else {
    const currentIssueIndex = qaIssues.findIndex(
      issue =>
        issue.type === QA_RULE.DUPLICATE_BARCDE && issue.details.find(detail => detail.id === id),
    )
    if (currentIssueIndex > -1) {
      filteredIssues[currentIssueIndex] = {
        ...filteredIssues[currentIssueIndex],
        details: filteredIssues[currentIssueIndex].details.filter(detail => detail.id !== id),
      }

      if (filteredIssues[currentIssueIndex].details.length < 2) {
        filteredIssues.splice(currentIssueIndex, 1)
      }
    }
  }
  localStorage.setItem('qaIssues', JSON.stringify(filteredIssues))
}

export const checkIfHasSameBarcode = (assetData, assetItem) => {
  const assetItemData = assetItem.facets
  const checkIfHas =
    assetData.barcode && assetItemData.barcode && assetData.barcode === assetItemData.barcode
  if (checkIfHas) {
    removeDuplicateBarcode({
      id: assetItem.id,
    })
  }
  return checkIfHas
}
