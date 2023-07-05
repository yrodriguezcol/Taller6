import { Request, Response } from "express"
import Joi from "joi"
import { WalletCreateReq } from "./model"
import { WalletService } from "./service"
import { maxAmountValidation, rechargeValidation } from "./validations/wallet.validations"


export interface WalletController {
    createWallet(req: Request, res: Response): Promise<void>
    rechargeWallet(req: Request, res: Response): void
    refundWallet(req: Request, res: Response): void
    limitTxAmountWallet(req: Request, res: Response): void
}

export class WalletControllerImp implements WalletController{
    private walletService: WalletService

    constructor(walletService: WalletService){
        this.walletService = walletService
    }

    public async createWallet(req: Request, res: Response): Promise<void> {
        const bodyReq: WalletCreateReq = req.body
        try {
            await this.walletService.getWalletByUserId(bodyReq.user_id)
            res.status(400).json({
                type: "walletCreate",
                message: "User id already have wallet"
            })
        } catch (error1) {
            try {
                const wallet = await this.walletService.createWallet(bodyReq)
                res.status(201).json(wallet)
            } catch (error){
                res.status(400).json({
                    type: "walletCreate",
                    message: "Failed Creating a Wallet"
                })
            }
        }
    } 

    public async rechargeWallet(req: Request, res: Response): Promise<void> {
        const bodyReq = req.body
        const id = parseInt(req.params.wallet_id)

        const walletDb  = await this.walletService.getWalletById(id)

        const validation = rechargeValidation(bodyReq, "Recharge", walletDb)?.details[0]
        if (validation){
            res.status(400).json(validation)
        } else{
            const updateWallet = await this.walletService.rechargeWallet(id, { amount: bodyReq.amount+ (walletDb.amount ==null? 0 : walletDb.amount)}, walletDb)
            res.status(200).json(updateWallet)
        }
    }
    public async refundWallet(req: Request, res: Response): Promise<void> {
        const bodyReq = req.body
        const id = parseInt(req.params.wallet_id)

        const walletDb  = await this.walletService.getWalletById(id)

        const validation = rechargeValidation(bodyReq, "Refund", walletDb)?.details[0]
        if (validation){
            res.status(400).json(validation)
        } else{
            const updateWallet = await this.walletService.rechargeWallet(id, { amount: bodyReq.amount+ (walletDb.amount ==null? 0 : walletDb.amount)}, walletDb)
            res.status(200).json(updateWallet)
        }
    }

    public async limitTxAmountWallet(req: Request, res: Response): Promise<void> {
        const bodyReq = req.body
        const id = parseInt(req.params.wallet_id)

        const walletDb  = await this.walletService.getWalletById(id)

        const validation = maxAmountValidation(bodyReq, "MaxAmount", walletDb)?.details[0]
        if (validation){
            res.status(400).json(validation)
        } else{
            const updateWallet = await this.walletService.limitTxAmountWallet(id, bodyReq, walletDb)
            res.status(200).json(updateWallet)
        }
    }
}