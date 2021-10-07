import mongoose, { Mongoose, Schema } from "mongoose";
import mongooseUniqueValidator from 'mongoose-unique-validator';

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
            walletAddress: { type: String, index: true, trim: true, required: true },
            nft:{type:Schema.Types.ObjectId, ref: 'nft'}, //nft
            nftAddress: { type: String, index: true, trim: true},
            networkId: { type: String, required: true },
            transactionHash: {type: String, default:""},
            transactionType: { type: String, trim: true },
            token: { type: String, default:'ETH'},
            amount : {type: String, default:'0'}, //due to decimals places
            status: { type: String, enum: [ "PENDING", "ERROR", "FAILED","COMPLETED", "PROCESSING" ], 
            default: 'PENDING' },
        }, { timestamps: true })

        this.schema.plugin(mongooseUniqueValidator, { type: 'mongoose-unique-validator' });
    }
}

export default mongoose.model('Transaction', new TransactionSchema().schema);