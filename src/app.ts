import express from 'express'
import logger from './utils/logger'
import routes from './api/routes'
import { runMigrations } from './config/migrations'

const app = express()
const port = 8086


app.use(express.json())
app.use('/api/v1', routes)

runMigrations()

app.listen(port, () => {
   logger.info(`Server is listening on port ${port}`) 
})

