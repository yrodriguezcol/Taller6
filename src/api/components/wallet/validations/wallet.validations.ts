import Joi, { func } from 'joi'
import { ValidationCondition, ValidationStruct, WalletDBRes} from '../model'

const rechargeWalletSchema = Joi.object({
    amount: Joi.number().required(),
})

const maxAmountWalletSchema = Joi.object({
    maxAmount: Joi.number().required(),
})

function rechargeValidation(reqBody: Object, type: string, walletDBRes?: WalletDBRes) {
    const {error, value } = rechargeWalletSchema.validate(reqBody)
    if (error){
        return error
    }
    const struct: ValidationStruct = {
        walletDb: walletDBRes,
        type: type,
        amount: value.amount,
        maxAmount:0
    }
    const validationProcess = {
        active: true,
        amountOver: true,
        maxAmount: false
    }
    return validations(struct, validationProcess)
}

function maxAmountValidation(reqBody: Object, type: string, walletDBRes?: WalletDBRes) {
    const {error, value } = maxAmountWalletSchema.validate(reqBody)
    if (error){
        return error
    }
    const struct: ValidationStruct = {
        walletDb: walletDBRes,
        type: type,
        amount: 0,
        maxAmount: value.maxAmount
    }
    const validationProcess = {
        active: true,
        maxAmount: true,
        amount: false
    }
    return validations(struct, validationProcess)
}

function validations(validationStruct: ValidationStruct, validationProcess: ValidationCondition ){
    if (validationStruct.walletDb){
        if (validationStruct.walletDb.status!='Active'  && validationProcess.active){
            return {
                details:[
                    { message: "wallet is not active"}
                ]
            }
        }
        if ( validationStruct.walletDb.amount + validationStruct.amount > 5000000 && validationStruct.type == 'Recharge' && validationProcess.amountOver){
            return {
                details:[
                    { message: "Amount to recharge wallet is too high"}
                ]
            }
        }
        if ((validationStruct.maxAmount > 5000000 || validationStruct.maxAmount <= 0) && validationProcess.maxAmount){
            return {
                details:[
                    { message: "Transaction limit is incorrect"}
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

export { rechargeWalletSchema, rechargeValidation, maxAmountValidation }