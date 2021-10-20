import { Helper } from '../../helpers';
import Sell from '../sell/sell.schema';
import TransactionModel from '../transaction/transaction.model';
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
            let { token, price, startDate, endDate, user, sellId, transactionHash } = data;
            const isError = await _validations({ _id: sellId, token, price, transactionHash, startDate, endDate });
            if (Object.keys(isError).length > 0) return errors('FIELD REQUIRED', isError);
            let sellNftData: any = await Sell.findOne({ _id: sellId });
            if (sellNftData) {
                let bidding: any = new Bidding();
                bidding.token = token;
                bidding.price = price;
                bidding.startDate = startDate;
                bidding.endDate = endDate;
                bidding.status = "PROCESSING";
                bidding.user = user['_id'];
                bidding.nft = sellNftData.nft;
                bidding.networkId = sellNftData.networkId;
                bidding.transactionStatus = 'PROCESSING';
                bidding.transactionHash = transactionHash;
                bidding.sellNft = sellId;
                let saveData: any = {};
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
                return new Promise((resolve, reject) => {
                    let interval: any = setInterval(async () => {
                        const result = await Helper.Web3Helper.getTransactionStatus(transactionHash);
                        if (result && result.status) {
                            clearInterval(interval);
                            bidding.status = "ACTIVE";
                            bidding.transactionStatus = "COMPLETED"
                            saveData = await bidding.save();
                            obj.status = "COMPLETED";
                            TransactionModel.add(obj);
                            resolve(true);
                        } else if (result && result.status === false) {
                            clearInterval(interval);
                            resolve(false)
                        }
                    }, 3000, "Hello.", "Updating the transaction");
                })
            } else {
                return new Error('SOMETHING WENT WRONG');
            }

        } catch (error: any) {
            throw error;
        }
    }
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async listBidd(data: any): Promise<any> {
        const {
            Response: { errors },
            Validate: { _validations },
        } = Helper;
        try {
            let { page, limit, id } = data;
            page = Number(page) || 1;
            limit = Number(limit) || 10;
            const isError = await _validations({ _id: id });
            if (Object.keys(isError).length > 0) return errors('FIELD REQUIRED', isError);

            await Bidding.updateMany({ sellNft: id, status: 'ACTIVE', endDate: { $lte: new Date() } }, { $set: { status: 'EXPIRED' } }, { upsert: false });

            let count: any = await Bidding.countDocuments({ sellNft: id, status: 'ACTIVE' });
            const result: any = await Bidding.find({ sellNft: id, status: 'ACTIVE' })
                .skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });

            return {
                count,
                result
            }
        } catch (error: any) {
            throw error;
        }
    }
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async cancelBidd(data: any): Promise<any> {
        const {
            Response: { errors },
            Validate: { _validations },
        } = Helper;
        try {
            const { id, user, transactionHash } = data
            const isError = await _validations({ _id: id, transactionHash });
            if (Object.keys(isError).length > 0) return errors('FIELD REQUIRED', isError);

            return new Promise((resolve, reject) => {
                let interval: any = setInterval(async () => {
                    const result = await Helper.Web3Helper.getTransactionStatus(transactionHash);
                    if (result && result.status) {
                        clearInterval(interval);
                        await Bidding.deleteOne({ _id: id, user: user['_id'] });
                        resolve(true);
                    } else if (result && result.status === false) {
                        clearInterval(interval);
                        resolve(false);
                    }
                }, 3000, "Hello.", "delete the bid.");
            })

        } catch (error: any) {
            throw error;
        }
    }
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async acceptBidding(data: any): Promise<any> {
        const {
            Response: { errors },
            Validate: { _validations },
        } = Helper;
        try {
            const { id, transactionHash } = data;
            const isError = await _validations({ _id: id, transactionHash });
            if (Object.keys(isError).length > 0) return errors('FIELD REQUIRED', isError);
            return new Promise((resolve, reject) => {
                let interval: any = setInterval(async () => {
                    const result = await Helper.Web3Helper.getTransactionStatus(transactionHash);
                    if (result && result.status) {
                        clearInterval(interval);
                        let sellNftDetail: any = await Bidding.findOneAndUpdate({ _id: id }, { status: 'ACCEPTED' }, { upsert: false });
                        if (sellNftDetail && sellNftDetail.sellNft) {
                            await Bidding.updateMany({ sellNft: sellNftDetail.sellNft, _id: { $ne: id } }, { status: 'INACTIVE' }, { upsert: false })
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    } else if (result && result.status === false) {
                        clearInterval(interval);
                        resolve(false);
                    }
                }, 3000, "Hello.", "Accept the bid.");
            })

        } catch (error: any) {
            throw error;
        }
    }
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async adminList(data: any): Promise<any> {
        try {
            let { page, limit } = data;
            page = Number(page) || 1;
            limit = Number(limit) || 10;

            let count: any = await Bidding.countDocuments({});
            const result: any = await Bidding.find({}).populate('nft').populate('user', 'username email walletAddress')
                .skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });

            return {
                count,
                result
            }
        } catch (error: any) {
            throw error;
        }
    }
    /**
     * @param  {string} _id
     * @returns Promise
     */
    public async adminDeleteBid(_id: string): Promise<any> {
        try {
            return await Bidding.deleteOne({_id});
        } catch (error: any) {
            throw error;
        }
    }
}

export default new BiddingModel();