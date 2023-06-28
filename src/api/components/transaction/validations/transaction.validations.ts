import Joi from 'joi'

const createTransactionSchema = Joi.object({
    wallet_id: Joi.number().required(),
    type: Joi.string().required(),
    amount: Joi.number().min(2000).required(),
})

export { createTransactionSchema }