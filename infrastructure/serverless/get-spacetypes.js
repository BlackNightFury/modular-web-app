const sql = require('mssql')
const middleware = require('./middleware').simple

const convertToJSON = async projectId => {
  let spaceTypes = []

  try {
    console.log(`getSpaceTypes getting space types for project ${projectId}. Connecting to database`)
    await sql.connect({
      database: process.env.database,
      user: process.env.user,
      password: process.env.password,
      server: process.env.server,
    })
    console.log(`getSpaceTypes getting space types for project ${projectId}. Connected to database`)
    
    try {
      const spaceQueryResult = await sql.query`SELECT DISTINCT(room_location_lu.description) FROM projects
      JOIN room_location_lu ON room_location_lu.hierarchy_id = projects.hierarchy_id
      WHERE project_id = ${projectId}`

      await sql.close()

      spaceTypes = spaceQueryResult.recordset.map(space => space.description)
      
    } catch (e) {
      console.log(`getSpaceTypes sql exception executing query`)
      console.log(e)
      await sql.close()
    }
  } catch (e) {
    console.log(`getSpaceTypes sql exception connecting to database`)
    console.log(e)
  }

  return spaceTypes
}

module.exports.getSpaceTypes = async event => {
  try {
    const { projects } = event
    const spaceTypes = {}

    for (let i = 0; i < projects.length; i += 1) {
      spaceTypes[projects[i]] = await convertToJSON(projects[i])
    }

    return spaceTypes
  } catch (err) {
    console.log(`getSpaceTypes exception`)
    console.log(err)
  }

  return []
}

module.exports.lambda = middleware(module.exports.getSpaceTypes)