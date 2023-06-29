import { db } from "../../../config/database"
import { Transaction } from "./model"
import { GetAllError, GetByIdError } from "../../../utils/customErrors"

export class TransactionRepository {

    public async getAllTransactions(): Promise<Transaction[]> {
        try{
            return db.select('*').from('transaction')
        } catch (error){
            throw new GetAllError("Failed getting all transactions", 'transaction')
        }
    }

    public async getByIdTransaction(id: number): Promise<Transaction> {
        try{
            const transaction = await db("transaction").where({transaction_id: id}).first()
            return transaction
        } catch (error){
            throw new GetByIdError("Failed getting transaction by id", 'transaction')
        }
    }

}