import { TransactionReq } from "./model"
import {  Request, Response } from "express-serve-static-core"
import {  transactionValidation } from "./validations/transaction.validations"
import { TransactionService } from "./service"
import { WalletService } from "../wallet/service"
import logger from "../../../utils/logger"


export interface TransactionController{
    getAllTransactions( req: Request, res: Response ): void
    getTransactionById( req: Request, res: Response ): void
    createTx( req: Request, res: Response ): void
    updateTransaction( req: Request, res: Response ): void
}

export class TransactionControllerImp implements TransactionController{
    private transactionService: TransactionService
    private walletService: WalletService

    constructor(transactionService: TransactionService, walletService: WalletService){
        this.transactionService =  transactionService
        this.walletService =  walletService
    }

    public async getAllTransactions(req: Request, res: Response): Promise<void> {
        const transactions = await this.transactionService.getAllTransactions()
        res.json(transactions)
    }

    public async getTransactionById(req: Request, res: Response): Promise<void> {
        const id =  parseInt(req.params.tx_id)
        const transaction = await this.transactionService.getTransactionById(id)
        res.json(transaction)
    }

    public async  createTx(req: Request, res: Response): Promise<void> {
        const bodyReq: TransactionReq = req.body
        const walletDb = await this.walletService.getWalletById(bodyReq.wallet_id)
        const validations = transactionValidation(bodyReq, walletDb)?.details[0]
        if (validations){
            res.status(400).json(validations)
        } else{
            if (bodyReq.type=='directa'){
                this.transactionService.createTx(bodyReq)
                .then(
                    (transaction) => {
                        const walletDiscount = this.walletService.rechargeWallet(bodyReq.wallet_id, {amount: walletDb.amount-(bodyReq.amount)}, walletDb)
                        if (!walletDiscount){
                            logger.error(new Error("Failed Discount wallet amount"))
                            transaction =  this.transactionService.updateTx(transaction.transaction_id, {status: "rechazado"}, transaction)
                        }
                        res.status(201).json(transaction)
                    },
                    (error) =>{
                        res.status(400).json({
                            type: error.name,
                            message: "Failed Creating a Transaction"
                        })
                    }
                )
            } else if (bodyReq.type=='validada'){
                this.transactionService.createTxAsync(bodyReq)
                .then(
                    (transaction) => {
                        res.status(201).json(transaction)
                    },
                    (error) =>{
                        res.status(400).json({
                            type: error.name,
                            message: "Failed Creating a Transaction"
                        })
                    }
                )
            }
        }    
    } 


    public async updateTransaction(req: Request, res: Response): Promise<void> {
        const bodyReq = req.body
        const id = parseInt(req.params.tx_id)

        const transaction = await this.transactionService.getTransactionById(id)
        const transactionDb  = await this.transactionService.updateTx(id, bodyReq, transaction)
        res.status(200).json(transactionDb)

    }
}

