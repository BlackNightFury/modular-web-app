const { Client } = require('elasticsearch')
const sql = require('mssql')
const _ = require('lodash')
const yaml = require('js-yaml')
const fs = require('fs')
const { join } = require('path')
const middleware = require('./middleware').simple
const { getHierarchyFromCache } = require('./get-hierarchy-from-cache')

const questionEnrichmentFile = './etc/static_data/question-enrichment.yml'

const facetTypeRegExs = {
  NullableInt: '^[0-9]+$',
  String: '(.*?)',
  NullableDateTime: '(.*?)',
  NullableBool: '(.*?)',
  NullableDecimal: '^([0-9]*[.])?[0-9]+$',
  NullableFloat: '^([0-9]*[.])?[0-9]+$',
}

const facetValidationMsgs = {
  NullableInt: 'Must be a number',
  String: 'Must be a string',
  NullableDateTime: 'Must be a datetime',
  NullableBool: 'Must be a true or false',
  NullableDecimal: 'Must be a decimal',
  NullableFloat: 'Must be a float',
}

const facetExampleValues = {
    NullableInt: '5',
    NullableDateTime: '2019-1-1',
    NullableBool: true,
    NullableDecimal: '19',
    NullableFloat: '19',
}

const keyGenerator = text =>
  text
    .replace(/ *\([^)]*\) */g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()

const removeNewLineCharacter = text => text && text.replace(/(\r\n|\n|\r)/gm, '')
const mapLookupTypes = data =>
  // console.log(data);
  _.uniq(
    _.reduce(
      data,
      (systemMemo, system) =>
        // console.log(system.type);
        systemMemo.concat(
          _.reduce(
            system.types,
            (typeMemo, type) =>
              // console.log(type.type);
              typeMemo.concat(
                _.reduce(
                  type.subtypes,
                  (subtypeMemo, subtype) =>
                    // console.log(subtype.type);
                    subtypeMemo.concat(
                      _(subtype.facets)
                        .map('LookUpTypeName')
                        .compact()
                        .value(),
                    ),
                  [],
                ),
              ),
            [],
          ),
        ),
      [],
    ),
  )

const generateGroup = (
  MANDATORY_FIELDS,
  INTEGER_FIELDS,
  mapping,
  facets,
  lookupsDictionary,
  hierarchyId,
  allowMultiple,
) => {
  try {
    if (facets)
      return facets
        .sort((a, b) => a.order - b.order)
        .map(facet => {
          const newFacet = {
            key: (mapping[facet.text] && mapping[facet.text].key) || keyGenerator(facet.text),
            label: (mapping[facet.text] && mapping[facet.text].label) || facet.text,
            type: facet.type,
            order: facet.order,
            help:
              (mapping[facet.text] && mapping[facet.text].help) ||
              (facet.text.match(/\(([^)]+)\)/) && facet.text.match(/\(([^)]+)\)/)[1]),
            group: (mapping[facet.text] && mapping[facet.text].group) || 'Others',
            validation: {
              allowByPass: MANDATORY_FIELDS.findIndex(obj => facet.text.indexOf(obj) === 0) !== -1,
              mandatory: !facet.notRequired,
            },
            element: (mapping[facet.text] && mapping[facet.text].element) || 'facets',
            copy:
              !mapping[facet.text] || mapping[facet.text].copy === undefined
                ? true
                : mapping[facet.text].copy,
          }
          if (newFacet.label === 'Quantity') {
            newFacet.allowMultiple = allowMultiple
          }
          if (facet.validation) {
            newFacet.validation = {
              ...newFacet.validation,
              isRegEx: facet.validation[0] === '^',
              value: facet.validation[0] === '^' ? facet.validation : null,
            }
          }
          if (!facet.LookupTypeId && newFacet.validation && !newFacet.validation.isRegEx) {
            const facetType = (INTEGER_FIELDS.findIndex(obj => facet.text.indexOf(obj) === 0) !== -1)? 'NullableInt' : facet.AssetColumnType
            const facetTypeRegEx = facetTypeRegExs[facetType]
            newFacet.validation = {
              ...newFacet.validation,
              isRegEx: facetTypeRegEx && facetTypeRegEx[0] === '^',
              value : facetTypeRegEx,
              errorMessage: facetValidationMsgs[facetType],
              example: facetExampleValues[facetType]
            }
          }
          if (facet.LookUpTypeName) {
            const values = lookupsDictionary[facet.LookUpTypeName]
              .filter(
                obj => (obj.description && !obj.hierarchy_id) || obj.hierarchy_id === hierarchyId,
              )
              .map(obj => ({
                description: removeNewLineCharacter(obj.description),
                code: removeNewLineCharacter(obj.code) || removeNewLineCharacter(obj.description),
                legacyId: obj[facet.LookUpTypeName.replace('lu', 'id')],
              }))
            if (values.length > 0) {
              newFacet.options = values
            }
          }
          return newFacet
        })

    console.error('generateGroup no facets.')
    return []
  } catch (e) {
    console.error('generateGroup errored.', e)
    console.error('generateGroup error facets.', facets)
    console.error('generateGroup error lookupsDictionary.', lookupsDictionary)
    console.error('generateGroup error mapping.', mapping)
    throw e
  }
}

function loadHierarchyEnrichment(hierarchyId) {
  const configDir = './etc/static_data/hierarchy-enrichment/'
  const path = join(__dirname, configDir)

  try {
    const files = fs.readdirSync(path)

    const configFilename = files.filter(filename => filename.startsWith(`${hierarchyId}`))
    if (configFilename.length > 0) {
      const configFile = join(__dirname, configDir + configFilename[0])
      const file = fs.readFileSync(configFile, 'utf8')
      const doc = yaml.safeLoad(file)
      return doc
    }
    console.log('Config file not founded which starts with.', hierarchyId)
  } catch (e) {
    console.error('Config file not found.')
  }
  return {}
}

function loadFacetInfo() {
  const configFile = join(__dirname, questionEnrichmentFile)

  try {
    const file = fs.readFileSync(configFile, 'utf8')
    const doc = yaml.safeLoad(file)
    console.log(`loadFacetInfo loading config from ${configFile}`)
    return doc
  } catch (e) {
    console.error(`loadFacetInfo config file ${configFile} not found.`)
  }
  return {}
}

const convertToJSON = async (environment, tenantId, projectId) => {
  console.log(`convertToJSON getting hierarchy from cache for tenantId ${tenantId}`)

  let hierarchyFromCache = await getHierarchyFromCache(environment, tenantId)

  console.log(`convertToJSON got hierarchy from cache keys [${Object.keys(hierarchyFromCache)}]`)

  if (Object.keys(hierarchyFromCache).length) {
    console.log('returning hierarchy from cache')
    return hierarchyFromCache
  }
  try {
    console.log("convertToJSON didn't find hierarchy in cache, generating one")
    const facetInfo = loadFacetInfo()

    await sql.connect({
      database: process.env.database,
      user: process.env.user,
      password: process.env.password,
      server: process.env.server,
    })

    console.log('convertToJSON getting hierarchy from SQL')

    try {
      const queryResult = await sql.query`
        SELECT
          system.hierarchy_id 'hierarchy_id',
          system.description 'type',
          system.sys_id 'legacy_id',
          types.description 'type',
          types.type_id 'legacy_id',
          subtypes.subtype_id 'legacy_id',
          subtypes.description 'type',
          subtypes.virtual 'virtual',
          subtypes.lifecycle 'lifecycle',
          subtypes.replacement_cost 'replacement_cost',
          subtypes.MultipleQuantity 'allowMultiple',
          subtypes.sfg_code 'sfg_code',
          (
            SELECT
              qast.QuestionAssetTypeSubTypeId 'id',
              q.QuestionId 'question_id',
              q.Text 'text',
              q.AssetColumnMappingId,
              q.AssetColumnTypeId,
              act.Description AS 'AssetColumnType',
              q.LookupTypeId,
              pq.NotRequired 'notRequired',
              pq.QuestionOrder 'order',
              pq.ValidationData 'validation',
              qt.Description 'type',
              lut.LookUpTypeName
            FROM
              QuestionAssetTypeSubType qast
            LEFT JOIN
              Question q On q.QuestionId = qast.QuestionId
            JOIN
              ProjectQuestion pq ON pq.ProjectId = ${projectId} AND pq.QuestionId = q.QuestionId
            LEFT JOIN
              QuestionType qt ON q.QuestionTypeId = qt.QuestionTypeId
            LEFT JOIN
              LookUpType lut ON lut.LookUpTypeId = q.LookUpTypeId
            LEFT JOIN
              AssetColumnType act ON act.AssetColumnTypeId = q.AssetColumnTypeId
            WHERE
              subtypes.subtype_id = qast.SubTypeId
            FOR JSON PATH
          ) 'facets'
        FROM asset_system_lu system
        LEFT JOIN asset_type_lu types ON system.sys_id = types.sys_id
        LEFT JOIN asset_subtype_lu subtypes ON types.type_id = subtypes.type_id
        JOIN projects ON system.hierarchy_id = projects.hierarchy_id AND projects.project_id = ${projectId}
        FOR JSON AUTO --PATH, ROOT('systems')`

      const record = queryResult.recordset[0]
      const key = Object.keys(record)[0]
      const systems = JSON.parse(record[key])

      // console.log(JSON.stringify(record));

      const hierarchyId = systems.length > 0 ? systems[0].hierarchy_id : null

      console.log(
        `convertToJSON got hierarchy from SQL, key=${key}, systems=${systems.length}, hierarchyId=${hierarchyId}`,
      )

      // Make Lookups Dictionary
      const lookupsDictionary = {}
      const lookupTypeResult = mapLookupTypes(systems)
      // console.log(lookupTypeResult);

      console.log('convertToJSON getting lookup data from SQL', lookupTypeResult)

      const globalLookupPromises = lookupTypeResult.map(lookup =>
        sql
          .query(`SELECT * FROM ${lookup}`)
          .then(res => {
            lookupsDictionary[lookup] = res.recordset
            // console.log(_.keys(lookupsDictionary));
            return true
          })
          .catch(e => {
            console.error('convertToJSON error getting lookup data from SQL', e)
            lookupsDictionary[lookup] = []
          }),
      )
      await Promise.all(globalLookupPromises)

      console.log(
        `convertToJSON got all lookup data from SQL, generating hierarchy for ${
          systems.length
        } systems with lookups [${_.keys(lookupsDictionary)}]`,
      )

      // console.log(lookupTypeResult);
      // console.log(lookupsDictionary);

      // Make Hierarchy JSON
      const hierarchyJSON = systems.map(system => {
        try {
          return {
            type: system.type,
            legacyId: system.legacy_id,
            children: system.types.map(type => {
              const subtypes = type.subtypes.map(subtype => {
                try {
                  // console.log('convertToJSON mapping subtype', system, type, subtype)

                  //Lowercasing a null tree value, is failing. Treat it as 2 level as theirs no name
                  const tree = (!subtype.type) || (subtype.type.toLowerCase() === type.type.toLowerCase())
                    ? [system.type, type.type]
                    : [system.type, type.type, subtype.type];
                  
                  // console.log('convertToJSON mapped tree', tree)

                  const mapped = {
                    type: subtype.type,
                    tree,
                    legacyId: subtype.legacy_id,
                    virtual: subtype.virtual,
                    lifecycle: subtype.lifecycle,
                    replacementCost: subtype.replacement_cost,
                    rics: 'Boilers-Heat Generators-HVAC',
                    nrm: '5.5.1.1.2.3',
                    'sfg-20-ref': subtype.sfg_code || '05-10',
                    'sfg-20-version': '4',
                    facets: generateGroup(
                      facetInfo.mandatory_fields,
                      facetInfo.integer_fields,
                      facetInfo.mapping,
                      subtype.facets,
                      lookupsDictionary,
                      system.hierarchy_id,
                      subtype.allowMultiple,
                    ),
                  }

                  if (mapped.facets.length === 0) {
                    console.error('mapped asset type has no facets', mapped)
                  }
                  return mapped
                } catch (e) {
                  console.error(
                    `convertToJSON error mapping subtype ${[system.type, type.type, subtype.type]}`,
                    e,
                  )
                  throw e
                }
              })
              return type.subtypes[0].type &&
                type.type &&
                type.subtypes[0].type.toLowerCase() === type.type.toLowerCase()
                ? subtypes[0]
                : {
                    type: type.type,
                    legacyId: type.legacy_id,
                    children: subtypes,
                  }
            }),
          }
        } catch (e) {
          console.error(`convertToJSON error mapping system ${system.type}`, e)
          throw e
        }
      })

      console.log('convertToJSON hierarchy generated, getting manufacturers')

      const manufacturerQueryResult = await sql.query`SELECT DISTINCT(name) FROM manufacturer_lu`

      await sql.close()

      console.log('convertToJSON enriching hierarchy')

      const hierarchyEnrichment = loadHierarchyEnrichment(hierarchyId)

      console.log('convertToJSON found hierarchyEnrichment, persisting to ES')

      //store hierachy in ES
      const esClient = Client({
        host: process.env.ELASTICSEARCH_HOST,
        connectionClass: require('http-aws-es'),
      })
      const esIndex = `${environment}-shared`
      const esType = 'hierarchy'

      await esClient.index({
        index: esIndex,
        type: esType,
        refresh: true,
        body: {
          tenantId,
          hierarchy: hierarchyJSON,
          manufacturers: manufacturerQueryResult.recordset.map(manufacturer => manufacturer.name),
          hierarchyEnrichment,
        },
      })

      console.log('convertToJSON getting cached hierarchy from ES')

      //TODO : why are we getting it from the cache, when we have just inserted it?!
      hierarchyFromCache = await getHierarchyFromCache(environment, tenantId)

      console.log('convertToJSON returning cached hierarchy')

      return hierarchyFromCache
    } catch (e) {
      console.error('convertToJSON error 1', e)
      await sql.close()
      throw e
    }
  } catch (e) {
    console.error('convertToJSON error 2', e)
    throw e
  }

  //TODO : why is this helpful? It's better to error out, than return something that's totally not useful
  // the effect of this is that the app 'thinks' it got a valid response, caches it, and never checks again!
  // return { hierarchy: [], manufacturers: [], hierarchyEnrichment: {} }
}

module.exports.mapLookupTypes = mapLookupTypes

module.exports.getHierarchy = async event => {
  try {
    const { environment, projects } = event
    const hierarchyJSON = {}
    for (let i = 0; i < projects.length; i += 1) {
      const { tenantId, projectId } = projects[i]
      hierarchyJSON[projectId] = await convertToJSON(environment, tenantId, projectId)
    }

    return hierarchyJSON
  } catch (err) {
    console.error('getHierarchy error', err)
    throw err
  }

  //TODO : why is this helpful? It's better to error out, than return something that's totally not useful
  // the effect of this is that the app 'thinks' it got a valid response, caches it, and never checks again!
  // return { hierarchy: [], manufacturers: [], hierarchyEnrichment: {} }
}

module.exports.lambda = middleware(module.exports.getHierarchy)
