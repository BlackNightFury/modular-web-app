const moment = require('moment')
const Base = require('db-migrate-base')
const { join } = require('path')

const { loadConfig } = require(`${join(__dirname, '../../../scripts/get-config.js')}`)
const { configureAmplify, gql } = require('../../scripts/configure-appsync')
const { listMigrationsQuery } = require('./queries')
const { createMigrationMutation } = require('./mutations')

global.verbose = true

// let type
let log
let internals = {}

//Based on this
//https://db-migrate.readthedocs.io/en/latest/Developers/contributing/#creating-your-own-driver

const GraphQLDriver = Base.extend({
  async init(config) {
    
    this._super(internals);
    this.config = config;
    
    this.configInfo = loadConfig(this.config.account, this.config.stage, 'application.yml')
  },

  close() { //callback
    log.info('close')
    // this.connection.end(callback);
  },

  createTable(tableName, options, callback) {
    log.info('No need to create a table in graphql')
    callback();
  },

  deleteMigration(migrationName, callback) {
    log.info('TODO : Delete migration')
    callback();
  },

  async addMigrationRecord (name, callback) {
    await configureAmplify(this.configInfo, this.config.tenant)
    
    const formattedDate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    log.info('Storing migration status in graphql', name, formattedDate)

    const data = {
      input : { id: name, createdAtClient: formattedDate, createdBy: "db-migrate", tenantId: this.config.tenant }
    }

    log.sql('Migration object to store', data)
    log.sql(data)
    const result = await gql(createMigrationMutation, data)
    log.sql('Stored', result)
    callback();
  },

  async allLoadedMigrations(callback) {
    log.info('Getting migrations from graphql')
    // console.log(this)
    await configureAmplify(this.configInfo, this.config.tenant)
    
    const migrations = await gql(listMigrationsQuery, { tenantId: this.config.tenant })
    log.sql(JSON.stringify(migrations))
    callback(null, migrations.data.listMigrations.items);
  },

});

module.exports = {
  connect(config, intern, callback) {
  
    internals = intern;
    ({ log } = internals.mod);
    console.log('log', log)
    // type = internals.mod.type;

    // console.log('connect arguments', arguments)

    callback(null, new GraphQLDriver(config));
  }
};
