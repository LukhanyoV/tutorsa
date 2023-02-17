const pgp = require("pg-promise")({})
const config = {
    connectionString: "postgres://twkmabpc:uAn2Gkymi9uqDe3akyfZ7DLP2GINU_py@jelani.db.elephantsql.com/twkmabpc"
}
if(process.env.NODE_ENV !== 'production'){
    config.connectionString = "postgres://tutorsa:s3cur3@localhost:5432/tutorsa"
}
const db = pgp(config)
module.exports = db