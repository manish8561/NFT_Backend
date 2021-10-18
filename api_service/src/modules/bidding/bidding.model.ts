import { Helper } from '../../helpers';
import Sell from '../sell/sell.schema';
import transactionModel from '../transaction/transaction.model';
import Bidding from './bidding.schema';

class BiddingModel {
    constructor() { }
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async addBid(data: any): Promise<any> {
        const {
            Response: { errors },
            Validate: { _validations },
        } = Helper;
        try {
            let { token, price, startDate, endDate, user, sellId, transactionHash  } = data;
            const isError = await _validations({ _id: sellId, token, price, startDate, endDate, transactionHash });
            if (Object.keys(isError).length > 0) return errors('FIELD REQUIRED', isError);
            let sellNftData: any = await Sell.findOne({ _id: sellId });
            if(sellNftData) {
                let bidding: any = new Bidding();
                bidding.token = token;
                bidding.price = price;
                bidding.startDate = startDate;
                bidding.endDate = endDate;
                bidding.status = "PROCESSING";
                bidding.user = user['_id'];
                bidding.user
                bidding.nft = sellNftData.nft;
                bidding.networkId = sellNftData.networkId;
                bidding.transactionStatus = 'PROCESSING';
                bidding.transactionHash = transactionHash;
                bidding.sellNft = sellId;

                const saveData = await bidding.save();
                let obj = {
                    from: null,
                    nftAddress: sellNftData.nftAddress,
                    nft: bidding.nft,
                    networkId: bidding.networkId,
                    transactionType: 'BIDDING',
                    status: "PROCESSING",
                    token: bidding.token,
                    amount: bidding.price,
                    user,
                    transactionHash
                }
                transactionModel.add(obj);
                return saveData;
            } else {
                return new Error('SOMETHING WENT WRONG');
            }

        } catch(error: any) {
            throw error;
        }
    }
}

export default new BiddingModel();