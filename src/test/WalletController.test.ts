import { Request, Response } from "express"
import { WalletController, WalletControllerImp } from "../api/components/wallet/controller"
import { WalletCreateReq, WalletCreateRes, WalletDBInsert, WalletDBRes, WalletMaxAmountReq, WalletRechargeReq } from "../api/components/wallet/model"
import { WalletService } from "../api/components/wallet/service"
import { GetByIdError } from "../utils/customErrors"


const mockReq = {} as Request
const mockRes = {} as Response

describe('WalletController', () => {
    let walletService: WalletService
    let walletController: WalletController
    let walletResService: WalletDBRes

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
        walletResService = {
            wallet_id: 1,
            user_id: 1,
            min_amount: 2000,
            max_amount: 50000,
            amount: 0,
            status: 'Active',
            created_at: new Date(),
            updated_at:  new Date()
        };
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
            expect(mockRes.json).toHaveBeenCalledWith(walletRes)
            expect(mockRes.status).toHaveBeenCalledWith(201)
        })

        it('shoud be handler error and return 400 status when user exist', async () => {
            const walletReq: WalletCreateReq = {
                user_id: 1   
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

    describe('rechargeWallet', () => {
        it('should update wallet amount and return info',async () => {
            const walletRecharge = {
                amount: 10000
            }
            // Para copiar un objeto en un objeto nuevo independiente, se debe usar el Object.assing
            const walletUpdate = Object.assign({}, walletResService);

            (mockReq.params) = {wallet_id:"1"};

            (mockReq.body as WalletRechargeReq) = walletRecharge;
            (walletService.getWalletById as jest.Mock).mockResolvedValue(walletResService);
            
            walletUpdate.amount = walletUpdate.amount+walletRecharge.amount;
            (walletService.rechargeWallet as jest.Mock).mockResolvedValue(walletUpdate);
            await walletController.rechargeWallet(mockReq, mockRes)

            expect(walletService.getWalletById).toHaveBeenCalledWith(1)
            expect(walletService.rechargeWallet).toHaveBeenCalledWith(1, walletRecharge, walletResService)
            expect(mockRes.json).toHaveBeenCalledWith(walletUpdate)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })
        it('should be handler error and return 400 when request is wrong',async () => {
            const walletRecharge = {
                test: 10000
            };
            (mockReq.params) = {wallet_id:"1"};
            (mockReq.body as {test:number}) = walletRecharge;
            (walletService.getWalletById as jest.Mock).mockResolvedValue(walletResService);
            
            await walletController.rechargeWallet(mockReq, mockRes)

            expect(walletService.getWalletById).toHaveBeenCalledWith(1)
            expect(mockRes.status).toHaveBeenCalledWith(400)
            expect(mockRes.json).toHaveBeenCalledWith({
                    "context":{"key": "amount",
                                        "label": "amount",
                                    },
                   "message": "\"amount\" is required",
                   "path": ["amount",],
                   "type": "any.required",
                  })
        })
        it('should be handler error and return 400 when wallet does not exist',async () => {
            const walletRecharge = {
                amount: 10000
            };
            (mockReq.params) = {wallet_id:"1"};
            (mockReq.body as WalletRechargeReq) = walletRecharge;
            (walletService.getWalletById as jest.Mock).mockResolvedValue(null);
            
            await walletController.rechargeWallet(mockReq, mockRes)

            expect(walletService.getWalletById).toHaveBeenCalledWith(1)
            expect(mockRes.status).toHaveBeenCalledWith(400)
            expect(mockRes.json).toHaveBeenCalledWith({
                    "message": "wallet does not exist",
                  })
        })

        it('should be handler error and return 400 when recharge amount is larger than the limit',async () => {
            const walletRecharge = {
                amount: 5000001
            };
            (mockReq.params) = {wallet_id:"1"};
            (mockReq.body as WalletRechargeReq) = walletRecharge;
            (walletService.getWalletById as jest.Mock).mockResolvedValue(walletResService);
            
            await walletController.rechargeWallet(mockReq, mockRes)

            expect(walletService.getWalletById).toHaveBeenCalledWith(1)
            expect(mockRes.status).toHaveBeenCalledWith(400)
            expect(mockRes.json).toHaveBeenCalledWith({
                    "message": "Amount to recharge wallet is too high",
                  })
        })
    })

    describe('refundWallet', () => {
        it('should update wallet amount with refund value and return info',async () => {
            const walletRecharge = {
                amount: 10000
            }
            // Para copiar un objeto en un objeto nuevo independiente, se debe usar el Object.assing
            const walletUpdate = Object.assign({}, walletResService);

            (mockReq.params) = {wallet_id:"1"};

            (mockReq.body as WalletRechargeReq) = walletRecharge;
            (walletService.getWalletById as jest.Mock).mockResolvedValue(walletResService);
            
            walletUpdate.amount = walletUpdate.amount+walletRecharge.amount;
            (walletService.rechargeWallet as jest.Mock).mockResolvedValue(walletUpdate);
            await walletController.rechargeWallet(mockReq, mockRes)

            expect(walletService.getWalletById).toHaveBeenCalledWith(1)
            expect(walletService.rechargeWallet).toHaveBeenCalledWith(1, walletRecharge, walletResService)
            expect(mockRes.json).toHaveBeenCalledWith(walletUpdate)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })
        it('should be handler error and return 400 when request is wrong',async () => {
            const walletRecharge = {
                test: 10000
            };
            (mockReq.params) = {wallet_id:"1"};
            (mockReq.body as {test:number}) = walletRecharge;
            (walletService.getWalletById as jest.Mock).mockResolvedValue(walletResService);
            
            await walletController.rechargeWallet(mockReq, mockRes)

            expect(walletService.getWalletById).toHaveBeenCalledWith(1)
            expect(mockRes.status).toHaveBeenCalledWith(400)
            expect(mockRes.json).toHaveBeenCalledWith({
                    "context":{"key": "amount",
                                        "label": "amount",
                                    },
                   "message": "\"amount\" is required",
                   "path": ["amount",],
                   "type": "any.required",
                  })
        })
        it('should be handler error and return 400 when wallet does not exist',async () => {
            const walletRecharge = {
                amount: 10000
            };
            (mockReq.params) = {wallet_id:"1"};
            (mockReq.body as WalletRechargeReq) = walletRecharge;
            (walletService.getWalletById as jest.Mock).mockResolvedValue(null);
            
            await walletController.rechargeWallet(mockReq, mockRes)

            expect(walletService.getWalletById).toHaveBeenCalledWith(1)
            expect(mockRes.status).toHaveBeenCalledWith(400)
            expect(mockRes.json).toHaveBeenCalledWith({
                    "message": "wallet does not exist",
                  })
        })
    })

    describe('limitTxAmountWallet', () => {
        it('should set up limit transaction amount and return info',async () => {
            const walletMaxAmount = {
                maxAmount: 10000
            }
            // Para copiar un objeto en un objeto nuevo independiente, se debe usar el Object.assing
            const walletUpdate = Object.assign({}, walletResService);

            (mockReq.params) = {wallet_id:"1"};

            (mockReq.body as WalletMaxAmountReq) = walletMaxAmount;
            (walletService.getWalletById as jest.Mock).mockResolvedValue(walletResService);
            
            walletUpdate.max_amount = walletMaxAmount.maxAmount;
            (walletService.limitTxAmountWallet as jest.Mock).mockResolvedValue(walletUpdate);
            
            await walletController.limitTxAmountWallet(mockReq, mockRes)

            expect(walletService.getWalletById).toHaveBeenCalledWith(1)
            expect(walletService.limitTxAmountWallet).toHaveBeenCalledWith(1, walletMaxAmount, walletResService)
            expect(mockRes.json).toHaveBeenCalledWith(walletUpdate)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })
    })
})