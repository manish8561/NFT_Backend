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
            if(sellType == 'AUCTION') {
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
            sellNft.status = "ACTIVE";
            sellNft.transactionStatus = 'PROCESSING';
            sellNft.transactionHash = transactionHash;
            
            const saveData = await sellNft.save();
            const obj: any = {
                user,
                from:null,
                nftAddress: sellNft.nftAddress,
                nft: data.nft,
                networkId: sellNft.networkId,
                transactionType: 'SELL',
                status: 'PROCESSING',
                token: 'ETH',
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
            const isError = await _validations({ _id })
            if (Object.keys(isError).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, isError);
            const nftSell:any = await Sell.findOne({ nft:_id, status:'ACTIVE' });
            if(nftSell){
                if(nftSell.transactionStatus === 'PROCESSING'){
                    const result = await Helper.Web3Helper.getTransactionStatus(nftSell.transactionHash);
                    if(result && result.status) {
                        nftSell.transactionStatus = 'COMPLETED';
                        nftSell.save();
                        TransactionModel.setTransactionStatus({transactionHash: nftSell.transactionHash, status: 'COMPLETED'});
                        return {
                            data : nftSell,
                            status : 1,
                            message : 'Transaction completed'
                        };
                    } else if(result == null) {
                        TransactionModel.setTransactionStatus({transactionHash: nftSell.transactionHash, status: 'PROCESSING'});
                        return {
                            data: {},
                            status: 0,
                            message: 'Transaction in progress'
                        }

                    } else if(result && !result.status) {
                        nftSell.transactionStatus = 'FAILED';
                        nftSell.status = 'INACTIVE';
                        nftSell.save();
                        TransactionModel.setTransactionStatus({transactionHash: nftSell.transactionHash, status: 'FAILED'});
                        return {
                            data : {},
                            status: 2,
                            message : 'Transaction failed'
                        };
                    }
                }

                if(nftSell && nftSell.expirationDate){
                    if((new Date(nftSell.expirationDate).getTime()) <= Date.now()) {
                        nftSell.transactionStatus = 'FAILED';
                        nftSell.status = 'INACTIVE';
                        TransactionModel.setTransactionStatus({transactionHash: nftSell.transactionHash, status: 'FAILED'});
                        nftSell.save();
                        return {
                            data : {},
                            status: 2,
                            message : 'Transaction failed'
                        }
                    }
                }

                return {
                    data : nftSell,
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
    /**
     * @param  {any} _id
     * @returns Promise
     */
    public async cancelNFT(_id: any): Promise<any> {
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
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async updateSellNft(data: any): Promise<any> {
        const { 
            Validate: { _validations }, 
            Response: { errors },
            ResMsg: { 
                errors: { ALL_FIELDS_ARE_REQUIRED }
            }
        } = Helper;
        try {
            const { id, token, price, status } = data;
            const isError = await _validations({ _id: id })
            if (Object.keys(isError).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, isError);
            const obj = {
                token,
                price,
                status
            }
            await Sell.updateOne({ _id: id }, { $set : obj }, { upsert: false });
            return true;
        } catch(error: any) {
            throw error;
        }
    }
    /**
     * @param  {any} _data
     * @returns Promise
     */
    public async adminGetAllSellNft(_data: any): Promise<any> {
        try {
            let query: any = {}
            let { page, limit, filters } = _data;
            page = Number(page) || 1;
            limit = Number(limit) || 10;
            if(filters && filters.search) {
                let { search } = filters;
                search = search.toString();
                query = { $or : [
                    { sellType: new RegExp(search, 'i') }
                ]};
            }
            const count = await Sell.countDocuments();
            let data: any = await Sell.find().populate('nft').populate('owner').skip((page-1) * limit).limit(limit).sort({ createdAt: -1 });
            return {
                count,
                data
            }
        } catch(error: any) {
            throw error;
        }
    }
    /**
     * @param  {any} _id
     * @returns Promise
     */
    public async adminDeleteSellNft(_id: any): Promise<any> {
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