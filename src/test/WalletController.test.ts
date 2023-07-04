import { Request, Response } from "express"
import { WalletController, WalletControllerImp } from "../api/components/wallet/controller"
import { WalletCreateReq, WalletCreateRes, WalletDBInsert, WalletDBRes } from "../api/components/wallet/model"
import { WalletService } from "../api/components/wallet/service"
import { GetByIdError } from "../utils/customErrors"


const mockReq = {} as Request
const mockRes = {} as Response

describe('WalletController', () => {
    let walletService: WalletService
    let walletController: WalletController

    beforeEach(() => {
        walletService = {
            createWallet: jest.fn(),
            getWalletByUserId: jest.fn(),
            getWalletById: jest.fn(),
            rechargeWallet: jest.fn(),
            limitTxAmountWallet: jest.fn(),
        }

        walletController = new WalletControllerImp(walletService)
        mockRes.status = jest.fn().mockReturnThis()
        mockRes.json = jest.fn().mockReturnThis()
    })

    describe("createWallet", () => {
        it('should create new wallet and return info', async () => {
            const walletRes: WalletCreateRes = {
                wallet_id: 1,
                user_id: 1,
                wallet_status: 'Active',
                transaction_min_amount: 2000
            }

            const walletReq: WalletCreateReq = {
                user_id: 1   
            };

            (mockReq.body as WalletCreateReq) = walletReq;
            (walletService.getWalletByUserId as jest.Mock).mockRejectedValue(new GetByIdError("Failed getting wallet by user id", "wallet"));
            (walletService.createWallet as jest.Mock).mockResolvedValue(walletRes);

            await walletController.createWallet(mockReq, mockRes)

            expect(walletService.getWalletByUserId).toHaveBeenCalledWith(walletReq.user_id)
            expect(walletService.createWallet).toHaveBeenCalledWith(walletReq)
            console.log()
            expect(mockRes.json).toHaveBeenCalledWith(walletReq)
            //expect(mockRes.status).toHaveBeenCalledWith(201)
        })

        it('shoud be handler error and return 400 status when user exist', async () => {
            const walletReq: WalletCreateReq = {
                user_id: 1   
            }
            const walletResService: WalletDBRes = {
                wallet_id: 1,
                user_id: 1,
                min_amount: 2000,
                max_amount: 50000,
                amount: 0,
                status: 'Active',
                created_at: new Date(),
                updated_at:  new Date()
            };

            (mockReq.body as WalletCreateReq) = walletReq;
            (walletService.getWalletByUserId as jest.Mock).mockResolvedValue(walletResService);

            await walletController.createWallet(mockReq, mockRes)
            expect(walletService.getWalletByUserId).toHaveBeenCalledWith(walletReq.user_id)
            expect(mockRes.json).toHaveBeenCalledWith({
                type: "walletCreate",
                message: "User id already have wallet"
            })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })   
    })
})