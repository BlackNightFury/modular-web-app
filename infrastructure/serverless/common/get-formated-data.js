const { Parser } = require('json2csv')

const getFormattedData = (data, format, fields) => {
  const json2csvParser = new Parser({ fields })
  switch (format) {
    case 'CSV':
      return json2csvParser.parse(data)
    default:
      throw new Error('Unsupported Format')
  }
}

module.exports = {
  getFormattedData,
}
