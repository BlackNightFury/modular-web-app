const createMigrationMutation = `mutation CreateMigration($input: CreateMigrationInput!) {
  createMigration(input: $input) {
    name: id
    createdAtClient
    createdBy
  }
}
`

module.exports = {
  createMigrationMutation
}