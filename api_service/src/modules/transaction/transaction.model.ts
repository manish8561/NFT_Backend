import { Helper } from '../../helpers';
import Transaction from './transaction.schema';

class TransactionModel {

    constructor() { }
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async add(data: any): Promise<any> {
        try {
            data.user.walletAddress= data.user.walletAddress.toLowerCase();
            const transaction:any = new Transaction();

            transaction.user = data.user['_id'];
            transaction.walletAddress=data.user['walletAddress'];
            transaction.from = data.from;
            // nft:{type:Schema.Types.ObjectId, ref: 'nft'},
            transaction.nft = data.nft;
            transaction.nftAddress = data.nftAddress;
            transaction.networkId = data.networkId;
            transaction.transactionHash = data.transactionHash;
            transaction.transactionType = data.transactionType;
        
            transaction.token = data.token;
            transaction.amount = data.amount;
            transaction.status = data.status;

            const r = await transaction.save();
            return r['_id'];
        } catch (error) {
            throw error;
        }
    }
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async setTransactionStatus(data: any): Promise<any> {
        const { transactionHash , status } = data;
        return Transaction.updateOne({ transactionHash }, { $set: { status }});
    }
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async list(data: any): Promise<any> {
        try {
            let {filters, page, limit } = data;
           
            let query:any = {};
            if(data.user.role === 'user'){
                query.user = data.user['_id'];
            }
            if(!page){
                page = 1;
            }
            if(!limit){
                limit=10;
            }
            if(filters){
                query = filters;
            }
            return Transaction.find(query).populate('user', 'walletAddress')
            .skip((limit * (page -1))).limit(limit);
        } catch (error) {
            return error;
        }
    }
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async getTransactionByNftId(data: any): Promise<any> {
        const { 
            Validate: { _validations }, 
            Response: { errors },
            ResMsg: { errors: { ALL_FIELDS_ARE_REQUIRED } }
        } = Helper;
        try {
            let { page, limit, id } = data;
            const isError = await _validations({_id: id});
            if (Object.keys(isError).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, isError);
            if(!page){
                page = 1;
            }
            if(!limit){
                limit = 10;
            }
            const count = await Transaction.countDocuments({ nft: id, status: 'COMPLETED'});
            const res = await Transaction.find({ nft: id, status: 'COMPLETED'}).populate('user').populate('from').skip((page-1) * limit).limit(limit).sort({ createdAt: -1 });
            return {
                count,
                res
            };
        } catch(error) {
            throw error;
        }
    }
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async fetchTransactionData(_data: any): Promise<any> {
        try {
            let query: any = {}
            let { page, limit, filters, startDate, endDate, walletAddress } = _data;
            page = Number(page) || 1;
            limit = Number(limit) || 10;
            if(filters && filters.search){
                let { search } = filters;
                search = search.toString();
                query = {$or:[
                    { transactionHash: new RegExp(search,'i') },
                    { transactionType: new RegExp(search,'i') },
                    { token: new RegExp(search,'i') },
                    { nftAddress: new RegExp(search,'i') }
                 ]}
            }
            if(startDate && endDate) {
                query.createdAt = { $gte : startDate, $lt: endDate };
            }

            if(walletAddress) {
                query.walletAddress = walletAddress.toLowerCase();
            }
            const count: any = await Transaction.countDocuments(query);
            const data: any =  await Transaction.find(query).populate('user').populate('nft').skip((page-1) * limit).limit(limit).sort({ createdAt: -1 });
            return {
                count,
                data
            }
        } catch(error: any) {
            throw error;
        }
    }
}

export default new TransactionModel();