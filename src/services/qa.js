export const QA_RULE = {
  DUPLICATE_BARCDE: 'Duplicate barcode number',
}

const QA_ISSUE_TYPE = {
  errors: [QA_RULE.DUPLICATE_BARCDE],
  warnings: [],
}

export const getIssues = () => {
  const qaIssues = localStorage.getItem('qaIssues')
  if (!qaIssues) {
    return []
  }
  return JSON.parse(qaIssues)
}

export const getIssuesTime = () => localStorage.getItem('qaIssuesTime')

export const getQAErrors = () => getIssues().filter(issue => issue.isError)
export const getQAWarnings = () => getIssues().filter(issue => !issue.isError)

export const storeIssues = (id, type, details, info) => {
  const qaIssues = getIssues()
  const isError = QA_ISSUE_TYPE.errors.findIndex(error => error === type) >= 0
  // Check if exists
  const currentIssueIndex = qaIssues.findIndex(issue => issue.id === id && issue.type === type)
  if (currentIssueIndex > -1) {
    qaIssues[currentIssueIndex] = { type, details, info, id, isError }
  } else {
    qaIssues.push({ type, details, info, id, isError })
  }

  localStorage.setItem('qaIssues', JSON.stringify(qaIssues))
}
