import { TransactionReq } from "./model"
import {  Request, Response } from "express-serve-static-core"
import { createTransactionSchema, transactionValidation } from "./validations/transaction.validations"
import { TransactionService } from "./service"
import { WalletService } from "../wallet/service"


export interface TransactionController{
    getAllTransactions( req: Request, res: Response ): void
    getTransactionById( req: Request, res: Response ): void
    createTx( req: Request, res: Response ): void
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
            console.log("Entró")
            res.status(400).json(validations)
        } else{
            console.log(walletDb)
            this.transactionService.createTx(bodyReq)
                .then(
                    (wallet) => {
                        res.status(201).json(wallet)
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

