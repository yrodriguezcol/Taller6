import { db } from "../../../config/database"
import { CreateError, GetByIdError, UpdateError } from "../../../utils/customErrors"
import logger from "../../../utils/logger"
import { WalletDBInsert, WalletDBRes, WalletRechargeRes} from "./model"

export class WalletRepository{

    public async createWallet( req: WalletDBInsert ): Promise<WalletDBRes> {
        try{
            const [createWallet]  = await db('wallet').insert(req).returning('*')
            return createWallet
        } catch (error){
            logger.error(error)
            throw new CreateError("Failed to create wallet", 'wallet')
        }
    }
    public async getWalletByUserId( user_id: number ): Promise<WalletDBRes> {
        try{
            const wallet = await db('wallet').where({user_id}).first()
            return wallet
        } catch (error){
            logger.error(error)
            throw new GetByIdError("Failed getting wallet by user id", 'wallet')
        }
    }

    public async getWalletById( wallet_id: number ): Promise<WalletDBRes> {
        try{
            const wallet = await db('wallet').where({wallet_id}).first()
            return wallet
        } catch (error){
            logger.error(error)
            throw new GetByIdError("Failed getting wallet by id", 'wallet')
        }
    }
    
    public async updateWallet(wallet_id: number, updates: Partial<WalletRechargeRes>): Promise<void>{
        try{
            await db('wallet').where({wallet_id}).update(updates)
        } catch (error){
            console.error(error)
            throw new UpdateError("Failed updating wallet", 'wallet')
        }
    }
}