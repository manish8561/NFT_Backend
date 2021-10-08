import { Helper } from '../../helpers';
import TransactionModel from '../transaction/transaction.model';
import NFT from '../nft/nft.schema';
import Sell from '../sell/sell.schema';

class BuyModel {
    constructor() { }
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async buyNewItem(data: any): Promise<any> {
        const { 
            Validate: { _validations }, 
            Response: { errors },
            ResMsg: { 
                errors: { ALL_FIELDS_ARE_REQUIRED }
            }
        } = Helper;
        try {
            const { nft, price, networkId, transactionHash, token, user, nftAddress  } = data;
            const isError = await _validations({_id: nft, price, networkId, transactionHash, nftAddress });
            if (Object.keys(isError).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, isError);
            
           const nftTemp:any = await NFT.findOne({_id:nft});
           const from = nftTemp.owner;
           nftTemp.owner = user['_id'];
           const saveData = await nftTemp.save();

            const obj: any = {
                user,
                from,
                nftAddress,
                nft,
                networkId,
                transactionType: 'BUY',
                status: 'COMPLETED',
                token: 'ETH',
                amount: price,
                transactionHash: transactionHash
            }
            TransactionModel.add(obj);
            Sell.updateMany({ nft }, { $set: { status: "INACTIVE"}},{usert:false});
            return saveData;
        } catch(error: any) {
            throw error;
        }
    }
}

export default new BuyModel();