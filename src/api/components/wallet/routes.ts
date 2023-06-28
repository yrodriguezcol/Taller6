import { Router } from "express"

const router = Router()

// Create Wallet
router.post('/create', )
// Recharge Wallet
router.post('/:wallet_id/recharge')
// Refund Wallet
router.post('/:wallet_id/refund')
// Tx amount limit
router.post('/:wallet_id/limit')