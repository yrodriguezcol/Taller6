import Joi from 'joi'
import { WalletDBRes } from '../../wallet/model'

enum txType {
    Validada = "validada",
    Directa = 'directa',
    Ingreso = 'ingreso'
}

const createTransactionSchema = Joi.object({
    wallet_id: Joi.number().required(),
    type: Joi.string().valid(...Object.values(txType)).required(),
    amount: Joi.number().required(),
})

function transactionValidation(reqBody: Object, walletDBRes?: WalletDBRes) {
    const {error, value } = createTransactionSchema.validate(reqBody)
    if (error){
        return error
    }
    if (walletDBRes){
        if (value.amount < walletDBRes.min_amount || value.amount > (walletDBRes.max_amount==null? 5000000 : walletDBRes.max_amount) ){
            return {
                details:[
                    { message: "Transaction amount exceeds the limits"}
                ]
            }
        }
        if (value.amount > walletDBRes.amount ){
            return {
                details:[
                    { message: "Wallet has insufficient funds"}
                ]
            }
        }
    }else{
        return {
            details:[
                { message: "wallet does not exist"}
            ]
        }
    }
}

export { createTransactionSchema, transactionValidation }