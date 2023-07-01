export interface WalletCreateReq {
    user_id: number
} 
export interface WalletDBInsert {
    user_id: number,
    min_amount: number,
    status: string,
    created_at: Date,
    updated_at: Date
}     

export interface  WalletDBRes {
    wallet_id: number,
    user_id: number,
    min_amount: number,
    max_amount: number,
    amount: number,
    status: string,
    created_at: Date,
    updated_at: Date
}

export interface  WalletRechargeRes {
    amount: number,
    updated_at: Date
}

export interface  WalletCreateRes {
    wallet_id: number,
    user_id: number,
    wallet_status: string,
    transaction_min_amount: number
}

export interface WalletRechargeReq {
    amount: number
}

export interface WalletMaxAmountReq {
    maxAmount: number
}

export interface ValidationStruct {
    walletDb?: WalletDBRes,
    type: string,
    amount: number,
    maxAmount: number
}

export interface ValidationCondition {
    active?: boolean,
    amountOver?: boolean,
    maxAmount?:boolean
}

export interface  WalletLimitMaxAmountRes {
    max_amount: number,
    updated_at: Date
}