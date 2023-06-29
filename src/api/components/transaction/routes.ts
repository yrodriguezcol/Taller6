import { Router } from "express"
import { TransactionController, TransactionControllerImp } from "./controller"
import { TransactionRepository } from "./repository"
import { TransactionServiceImp } from "./service"

const router = Router()
const transactionRepository =  new TransactionRepository()
const transactionService = new TransactionServiceImp(transactionRepository) 
const transactionController: TransactionController = new TransactionControllerImp(transactionService)
// Create Transaction
router.post('/create', )
// Update Transaction
router.patch('/:id_tx/update')
// list transactions
router.get('/list', transactionController.getAllTransactions.bind(transactionController))
// get transaction by id
router.get('/:tx_id', transactionController.getTransactionById.bind(transactionController))

export default router