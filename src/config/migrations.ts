import logger from "../utils/logger";
import configDb from "../db/knexfile";
import { knex } from "knex";



async function runMigrations() {
    const dbMigration = knex(configDb) 
    try {
        await dbMigration.migrate.latest()
        logger.info("Migrations ran successfully") 
    } catch (error) {
        logger.error(error)
    } finally {
        await dbMigration.destroy()
    }
}

export {runMigrations}