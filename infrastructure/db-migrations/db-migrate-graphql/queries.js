const listMigrationsQuery = `query listMigrations($tenantId: String!)  {
  listMigrations(filters : { tenantId: $tenantId }) {
  	items {
	  	name: id
	  	createdAt
	  	createdBy
  	}
  }
}`

module.exports = {
  listMigrationsQuery
}
