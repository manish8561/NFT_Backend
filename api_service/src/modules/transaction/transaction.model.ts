import Transaction from './transaction.schema';

class TransactionModel {

    constructor() { }
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async add(data: any): Promise<any> {
        try {
            const transaction:any = new Transaction();

            transaction.user = data.user['_id'];
            transaction.walletAddress=data.user['walletAddress'];
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
            throw error;
        }
    }

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

}

export default new TransactionModel();