import { Router } from "express"
import { WalletRepository } from "../wallet/repository"
import { WalletServiceImp } from "../wallet/service"
import { TransactionController, TransactionControllerImp } from "./controller"
import { TransactionRepository } from "./repository"
import { TransactionServiceImp } from "./service"

const router = Router()
const transactionRepository =  new TransactionRepository()
const transactionService = new TransactionServiceImp(transactionRepository)
const walletRepository =  new WalletRepository() 
const walletService = new WalletServiceImp(walletRepository) 

transactionService.startListenNotify()
const transactionController: TransactionController = new TransactionControllerImp(transactionService, walletService)
// Create Transaction
router.post('/create', transactionController.createTx.bind(transactionController))
// Update Transaction
router.patch('/:tx_id/update', transactionController.updateTransaction.bind(transactionController))
// list transactions
router.get('/list', transactionController.getAllTransactions.bind(transactionController))
// get transaction by id
router.get('/:tx_id', transactionController.getTransactionById.bind(transactionController))

export default router