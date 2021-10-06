import { Helper } from '../../helpers';
import TransactionModel from '../transaction/transaction.model';
import Buy from '../buy/buy.schema';
import NFT from '../nft/nft.schema';
import Sell from '../sell/sell.schema';

class BuyModel {

    constructor() { }

    public async buyNewItem(data: any): Promise<any> {
        const { 
            Validate: { _validations }, 
            Response: { errors },
            ResMsg: { 
                errors: { ALL_FIELDS_ARE_REQUIRED, SOMETHING_WENT_WRONG }
            }
        } = Helper;
        try {
            const { nft, price, networkId, transactionHash, token, user, nftAddress  } = data;
            const isError = await _validations({_id: nft, price, networkId, transactionHash, nftAddress });
            if (Object.keys(isError).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, isError);
            const buyNft: any = new Buy();
            buyNft.nft = nft;
            buyNft.nftAddress = nftAddress;
            buyNft.price = price;
            buyNft.networkId =networkId;
            buyNft.token = token;
            buyNft.transactionHash = transactionHash;
            buyNft.transactionStatus = "COMPLETED";
            buyNft.owner = user['_id']
            const saveData = await buyNft.save();

            const obj: any = {
                user,
                nftAddress: buyNft.nftAddress,
                nft: buyNft.nft,
                networkId: buyNft.networkId,
                transactionType: 'BUY',
                status: 'COMPLETED',
                token: 'eth',
                amount: buyNft.price,
                transactionHash: buyNft.transactionHash
            }
            await TransactionModel.add(obj);
            await NFT.updateOne({ _id: nft }, { $set : { owner: buyNft.owner }}, {usert:false});
            await Sell.updateMany({ nft }, { $set: { status: "INACTIVE"}},{usert:false});
            return saveData;

        } catch(error: any) {
            throw error;
        }
    }

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
            const nft:any = await Buy.findOne({ nft:_id, status:'ACTIVE' });
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
                            message: 'Transaction inprogress'
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
}

export default new BuyModel();