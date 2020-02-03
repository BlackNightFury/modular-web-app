const reportAttributeMappings = {
  ASSET_MANAGEMENT_CAFM_EXPORT: {
    list: 'dataSource',
    item: {
      'Project Name': 'project.name',
      'Facility Name': 'facility.name',
      'Floor Name': 'floor.name',
      'Space Name': 'space.name',
      Quantity: 'facets.quantity',
      Barcode: 'facets.barcode',
      Manufacturer: 'facets.manufacturer',
      Condition: 'facets.condition.description',
      assetTypeTree: 'assetType.tree',
      assetSubType: 'assetType.description',
    },
    each: item => {
      item['Asset Type'] = item.assetTypeTree[1]
      item['Asset Subtype'] = item.assetSubType
      item.System = item.assetTypeTree[0]
      delete item.assetTypeTree
    },
  },
}

const reportAttributes = {
  ASSET_MANAGEMENT_CAFM_EXPORT: [
    'Asset Type',
    'Asset Subtype',
    'System',
    'Quantity',
    'Barcode',
    'Manufacturer',
    'Condition',
    'Project Name',
    'Facility Name',
    'Floor Name',
    'Space Name',
  ],
}

module.exports = {
  reportAttributeMappings,
  reportAttributes,
}
