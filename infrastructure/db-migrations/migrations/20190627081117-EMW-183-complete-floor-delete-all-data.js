let dbm;
let type;
let seed;
const utilities = require('../common/utilities')

// //TODO - the intention for the prototype is that we want to clear
// //out the data in the environment, as was needed for EMW-183, but not in the production account
// //Care should be taken 

module.exports = {

  setup(options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
    console.log('dbm', dbm)
    console.log('type', type)
    console.log('seed', seed)
  },

  up(db) {
    console.log('TODO : Inside EMW-183 migration up')
    if (!utilities(db).clearDatabase()) {
      throw Error("Unable to clear database")
    }
    return null;
  },

  down(db) {
    console.log('Inside EMW-183 migration down')
    console.log('db', db)
    throw Error('We don\'t currently need to worry about down')
  },

  _meta : {
    "version": 1
  }
}
