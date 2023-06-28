import { TransactionReq } from "./model"
import { ParamsDictionary, Request, Response } from "express-serve-static-core"
import { createTransactionSchema } from "./validations/transaction.validations"
import { TransactionService } from "./service"


export interface TransactionController{
    getAllTransactions( req: Request, res: Response ): void
    getTransactionById( req: Request, res: Response ): void
}

export class TransactionControllerImp implements TransactionController{
    private transactionService: TransactionService

    constructor(transactionService: TransactionService){
        this.transactionService =  transactionService
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
}

