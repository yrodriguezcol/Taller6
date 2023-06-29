import { Request, Response } from "express"
import { WalletCreateReq } from "./model"
import { WalletService } from "./service"



export interface WalletController {
    createWallet(req: Request, res: Response): void
    rechargeWallet(req: Request, res: Response): void
}

export class WalletControllerImp implements WalletController{
    private walletService: WalletService

    constructor(walletService: WalletService){
        this.walletService = walletService
    }

    public  createWallet(req: Request, res: Response): void {
        const bodyReq: WalletCreateReq = req.body

        this.walletService.getWalletByUserId(bodyReq.user_id)
        .then(
            (user) =>{
                res.status(400).json({
                    type: "walletCreate",
                    message: "User id already have wallet"
                })
            },
            (error) => {
                this.walletService.createWallet(bodyReq)
                .then(
                    (wallet) => {
                        res.status(201).json(wallet)
                    },
                    (error) =>{
                        res.status(400).json({
                            type: error.name,
                            message: "Failed Creating a Wallet"
                        })
                    }
                )
            }
        )
    } 

    public rechargeWallet(req: Request, res: Response): void {
        const bodyReq = req.body
        // Validar que wallet existe
        // Validar que status sea active
        // Validar que amount no supere el máximo de 5M
    }
}