import mongoose, { Schema } from "mongoose";
import mongooseUniqueValidator from 'mongoose-unique-validator';

class NftSchema extends Schema {
   
    public schema!: mongoose.Schema;

    constructor() {
        super();
        this.createSchema();
    }

    private createSchema() {
        this.schema = new Schema({
            nftAddress: {type: String, required:true, trim:true},
            name: { type: String, required: true },
            fileHash: { type: String, required: true },
            externalLink: { type: String, default: "" },
            description: { type: String, default: "" },
            tokenUri: { type: String, default: "" },
            supply: { type: Number, default: 1 },
            royality: { type: Number, max: 100, min: 0, required: true },
            networkId: { type: String, required: true },
            blockchain: { type: String },
            sensitiveContent: { type: String },
            status: { type: String, default: 'ACTIVE' },
            tokenId: {type: Number, default: 0},
            owner:{type: mongoose.Schema.Types.ObjectId,ref: "User", required: true },
            creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        }, { timestamps: true })

        this.schema.plugin(mongooseUniqueValidator, { type: 'mongoose-unique-validator' });
    }
}

export default mongoose.model('Collection', new NftSchema().schema);