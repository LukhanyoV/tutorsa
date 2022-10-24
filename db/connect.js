const pgp = require("pg-promise")({})
const config = {
    connectionString: "postgres://twkmabpc:uAn2Gkymi9uqDe3akyfZ7DLP2GINU_py@jelani.db.elephantsql.com/twkmabpc"
}
const db = pgp(config)
module.exports = db