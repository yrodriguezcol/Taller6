import Joi from 'joi'
import { WalletDBRes, WalletRechargeReq } from '../model'

const rechargeWalletSchema = Joi.object({
    amount: Joi.number().required(),
})

function rechargeValidation(reqBody: Object, walletDBRes: WalletDBRes) {
    const {error, value } = rechargeWalletSchema.validate(reqBody)
}

export { rechargeWalletSchema }