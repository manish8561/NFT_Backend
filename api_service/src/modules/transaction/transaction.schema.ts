import mongoose, { Mongoose, Schema } from "mongoose";

class TransactionSchema extends Schema {
    public schema!: mongoose.Schema;

    constructor() {
        super();
        this.createSchema();
    }
    /**
     * define schema
     */
    private createSchema() {
        this.schema = new Schema({
            user:{ type: Schema.Types.ObjectId, ref: 'User'},
            from:{type:Schema.Types.ObjectId, ref:'User'},
            walletAddress: { type: String, index: true, trim: true, required: true },
            nft:{type:Schema.Types.ObjectId, ref: 'nft'},
            nftAddress: { type: String, index: true, trim: true},
            networkId: { type: String, required: true },
            transactionHash: {type: String, default:""},
            transactionType: { type: String, trim: true },
            token: { type: String, default:'ETH'},
            amount : {type: String, default:'0'},
            status: { type: String, enum: [ "PENDING", "ERROR", "FAILED","COMPLETED", "PROCESSING" ], 
            default: 'PENDING' },
        }, { timestamps: true });
        
        this.schema.index({transactionHash: 1, walletAddress: 1});
    }
}

export default mongoose.model('Transaction', new TransactionSchema().schema);