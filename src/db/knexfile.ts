import dotenv from 'dotenv'
import { Knex } from 'knex'

dotenv.config()

const configDb: Knex.Config ={
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: "changeme",
        database: 'wallet',
        port: 5433,
    },
    migrations: {
        directory: './src/db/migrations',
        tableName: 'knex_migrations',
    }

}

export default configDb
