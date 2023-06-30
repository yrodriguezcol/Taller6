import { Router } from "express"
import { WalletController, WalletControllerImp } from "./controller"
import { WalletRepository } from "./repository"
import { WalletService, WalletServiceImp } from "./service"


const router = Router()
const walletRepository: WalletRepository = new WalletRepository()
const walletService: WalletService = new WalletServiceImp(walletRepository)
const walletController: WalletController =  new WalletControllerImp(walletService) 

// Create Wallet
router.post('/create', walletController.createWallet.bind(walletController))
// Recharge Wallet
router.patch('/:wallet_id/recharge', walletController.rechargeWallet.bind(walletController))
// Refund Wallet
router.patch('/:wallet_id/refund', walletController.refundWallet.bind(walletController))
// Tx amount limit
router.post('/:wallet_id/limit')

export default router