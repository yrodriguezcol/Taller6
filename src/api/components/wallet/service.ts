import { GetByIdError } from "../../../utils/customErrors"
import { WalletCreateRes, WalletCreateReq, WalletDBInsert, WalletDBRes} from "./model"
import { WalletRepository } from "./repository"

export interface WalletService {
    createWallet(walletReq: WalletCreateReq): Promise<WalletCreateRes>
    getWalletByUserId(userId: number): Promise<WalletDBRes>
    getWalletById(walletId: number): Promise<WalletDBRes>
}

export class WalletServiceImp implements WalletService {
    private walletRepository: WalletRepository

    constructor(walletRepository: WalletRepository){
        this.walletRepository = walletRepository
    }

    public async createWallet(walletReq: WalletCreateReq): Promise<WalletCreateRes> {
        const min_amount: number = 2000
        const status_init: string = "Active"
        const now: Date =  new Date
        const walletIsert: WalletDBInsert = {
            user_id: walletReq.user_id,
            min_amount: min_amount,
            status: status_init,
            created_at: now,
            updated_at: now
        }
        const walletDb = await this.walletRepository.createWallet(walletIsert)
        const walletRes: WalletCreateRes = {
            wallet_id: walletDb.wallet_id,
            user_id: walletDb.user_id,
            wallet_status: walletDb.status,
            transaction_min_amount: walletDb.min_amount
        }
        return walletRes
    }
    public async getWalletByUserId(userId: number): Promise<WalletDBRes> {
        const wallet = await this.walletRepository.getWalletByUserId(userId)
        if (wallet){
            return wallet
        } else{
            throw new GetByIdError("Failed getting wallet by user id", "wallet")
        }
        
    }

    public async getWalletById(walletId: number): Promise<WalletDBRes> {
        return await this.walletRepository.getWalletById(walletId)
        
    }
}
