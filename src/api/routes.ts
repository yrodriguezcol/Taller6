import { Router } from "express"
import transactionRoutes from './components/transaction/routes'
const router = Router()

router.use('/transaction', transactionRoutes)


export default router