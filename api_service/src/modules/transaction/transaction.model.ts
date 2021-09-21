import Transaction from './transaction.schema';

class TransactionModel {

    constructor() { }
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async add(data: any, user: any): Promise<any> {
        try {
            const transaction:any = new Transaction();

            transaction.user = user['_id'];
            transaction.walletAddress=user['walletAddress'];
            // nft:{type:Schema.Types.ObjectId, ref: 'nft'},
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
            return error;
        }
    }
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async list(data: any, user: any): Promise<any> {
        try {
            let {filters, page, limit } = data;
           
            let query:any = {};
            if(user.role === 'user'){
                query.user = user['_id'];
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

}

export default new TransactionModel();