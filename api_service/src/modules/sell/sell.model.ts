import { Helper } from '../../helpers';
import Sell from './sell.schema';
import TransactionModel from '../transaction/transaction.model';

class SellModel {

    constructor() { }
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async sellNFT(data: any): Promise<any> {
        const { 
            Validate: { _validations }, 
            Response: { errors },
            ResMsg: { 
                errors: { ALL_FIELDS_ARE_REQUIRED, SOMETHING_WENT_WRONG }
            }
        } = Helper;
        try {
            const { nftAddress, sellType, price, user, owner, minimumBid, reservePrice, token, networkId, endingPrice, expirationDate, futureDate, allowedBuyerAddress, transactionHash } = data;
            const isError = await _validations({ nftAddress, sellType, price });
            if (Object.keys(isError).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, isError);
            if(sellType == 'HIGHEST_BID') {
                let highestBidErrors = await _validations({ minimumBid, reservePrice });
                if (Object.keys(highestBidErrors).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, highestBidErrors);
            }
            const sellNft: any = new Sell();
            sellNft.nft = data.nft;
            sellNft.nftAddress = nftAddress;
            sellNft.sellType = sellType;
            sellNft.price = price;
            sellNft.owner = user['_id'];
            sellNft.minimumBid = minimumBid;
            sellNft.reservePrice = reservePrice;
            sellNft.token = token;
            sellNft.endingPrice = endingPrice;
            sellNft.expirationDate = expirationDate;
            sellNft.futureDate = futureDate;
            sellNft.allowedBuyerAddress = allowedBuyerAddress;
            sellNft.networkId = networkId;
            // sellNft.status = "PROCESSING";
            sellNft.transactionStatus = 'PROCESSING';
            sellNft.transactionHash = transactionHash;

            const saveData = await sellNft.save();
            const obj: any = {
                user,
                nftAddress: sellNft.nftAddress,
                nft: data.nft,
                networkId: sellNft.networkId,
                transactionType: 'SELL',
                status: 'PROCESSING',
                token: 'eth',
                amount: sellNft.price,
                transactionHash
            }
            await TransactionModel.add(obj);
            return saveData;
        } catch(error) {
            throw error;
        }
    }
    /**
     * @param  {any} _id
     * @returns Promise
     */
    public async getSellNFT(_id: any): Promise<any> {
        const { 
            Validate: { _validations }, 
            Response: { errors },
            ResMsg: { 
                errors: { ALL_FIELDS_ARE_REQUIRED, SOMETHING_WENT_WRONG }
            }
        } = Helper;
        try {
            const isError = await _validations({ _id})
            if (Object.keys(isError).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, isError);
            const nft:any = await Sell.findOne({ nft:_id, status:'ACTIVE' });
            if(nft){
                if(nft.transactionStatus === 'PROCESSING'){
                    const result = await Helper.Web3Helper.getTransactionStatus(nft.transactionHash);
                    if(result && result.status) {
                        nft.transactionStatus = 'COMPLETED';
                        nft.save();
                        TransactionModel.setTransactionStatus({transactionHash: nft.transactionHash, status: 'COMPLETED'});
                        return {
                            data : nft,
                            status : 1,
                            message : 'Transaction completed'
                        };
                    } else if(result == null) {
                        TransactionModel.setTransactionStatus({transactionHash: nft.transactionHash, status: 'PROCESSING'});
                        return {
                            data: {},
                            status: 0,
                            message: 'Transaction in progress'
                        }

                    } else if(result && !result.status) {
                        nft.transactionStatus = 'FAILED';
                        nft.status = 'INACTIVE';
                        nft.save();
                        TransactionModel.setTransactionStatus({transactionHash: nft.transactionHash, status: 'FAILED'});
                        return {
                            data : {},
                            status: 2,
                            message : 'Transaction failed'
                        };
                    }
                }

                if(nft && nft.expirationDate){
                    if((new Date(nft.expirationDate).getTime()) <= Date.now()) {
                        nft.transactionStatus = 'FAILED';
                        nft.status = 'INACTIVE';
                        TransactionModel.setTransactionStatus({transactionHash: nft.transactionHash, status: 'FAILED'});
                        nft.save();
                        return {
                            data : {},
                            status: 2,
                            message : 'Transaction failed'
                        }
                    }
                }

                return {
                    data : nft,
                    status : 1,
                    message : 'Transaction completed'
                }
                
            } else {
                return {
                    data : {},
                    message: 'Record does not exist'
                }
            }
        } catch(error: any) {
            throw error;
        }
    }

    public async cancelSellNFT(_id: any): Promise<any> {
        const { 
            Validate: { _validations }, 
            Response: { errors },
            ResMsg: { 
                errors: { ALL_FIELDS_ARE_REQUIRED, SOMETHING_WENT_WRONG }
            }
        } = Helper;
        try {
            const isError = await _validations({ _id })
            if (Object.keys(isError).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, isError);
            await Sell.deleteOne({ _id });
            return true;
        } catch(error: any) {
            throw error;
        }
    }
}

export default new SellModel();