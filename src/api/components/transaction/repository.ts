import { db } from "../../../config/database"
import { Transaction, TransactionReq } from "./model"
import { CreateError, GetAllError, GetByIdError, UpdateError } from "../../../utils/customErrors"
import logger from "../../../utils/logger"

export class TransactionRepository {

    public async getAllTransactions(): Promise<Transaction[]> {
        try{
            return db.select('*').from('transaction')
        } catch (error){
            throw new GetAllError("Failed getting all transactions", 'transaction')
        }
    }

    public async getByIdTransaction(transaction_id: number): Promise<Transaction> {
        try{
            const transaction = await db("transaction").where({transaction_id}).first()
            return transaction
        } catch (error){
            throw new GetByIdError("Failed getting transaction by id", 'transaction')
        }
    }

    public async createTx( req: TransactionReq ): Promise<Transaction> {
        try{
            const [createTx]  = await db('transaction').insert(req).returning('*')
            return createTx
        } catch (error){

            logger.error(error)
            throw new CreateError("Failed to create transaction", 'transaction')
        }
    }
    
    public async updateTransaction(transaction_id: number, updates: Partial<Transaction>): Promise<void>{
        try{
            await db('transaction').where({transaction_id}).update(updates)
        } catch (error){
            console.error(error)
            throw new UpdateError("Failed updating transaction", 'transaction')
        }
    }

}