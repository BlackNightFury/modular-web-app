const DBMigrate = require('db-migrate')
const { argv } = require('yargs')

// console.log(process.argv)
// console.log(argv)
// process.exit()

process.env.DB_DRIVER=`${__dirname}/../db-migrate-graphql`;
process.env.MWA_ACCOUNT = argv.account;
process.env.MWA_ENVIRONMENT = argv.stage;
process.env.TENANT_ID = '672FB50-BE2B-405D-9526-CB81427B7B7E';

// console.log('applicationConfig', applicationConfig)

const options = {
	config : './config.json',
	env : 'env',
	// "migrations-dir": "./migrations",
	// "migrations-dir": "/../migrations",
	"migration-table": "db-migrate"
}

//getting an instance of dbmigrate
const dbmigrate = DBMigrate.getInstance(true, options)

//execute any of the API methods
dbmigrate.up()
	// dbmigrate.reset()
	// 	.then( () => dbmigrate.up() )