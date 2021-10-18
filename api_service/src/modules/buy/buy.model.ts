import { Helper } from '../../helpers';
import TransactionModel from '../transaction/transaction.model';
import NFT from '../nft/nft.schema';
import Sell from '../sell/sell.schema';
import transactionModel from '../transaction/transaction.model';

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
            let saveData: any = {}
            const isError = await _validations({_id: nft, price, networkId, transactionHash, nftAddress });
            if (Object.keys(isError).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, isError);
            
           const nftTemp:any = await NFT.findOne({_id:nft});
           const from = nftTemp.owner;
           nftTemp.owner = user['_id'];

            const obj: any = {
                user,
                from,
                nftAddress,
                nft,
                networkId,
                transactionType: 'BUY',
                status: 'PROCESSING',
                token,
                amount: price,
                transactionHash
            }

            let interval:any = setInterval(async () => {
                const result = await Helper.Web3Helper.getTransactionStatus(transactionHash);
                if(result && result.status) {
                    clearInterval(interval);
                    saveData = await nftTemp.save();
                    await Sell.updateMany({ nft }, { $set: { status: "INACTIVE"}},{upsert:false});
                    obj.status = "COMPLETED";
                    TransactionModel.add(obj);
                }
              }, 5000, "Hello.", "Updating the transaction");
            return saveData;
        } catch(error: any) {
            throw error;
        }
    }
}

export default new BuyModel();