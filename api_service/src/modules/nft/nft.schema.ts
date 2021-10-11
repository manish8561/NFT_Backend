import mongoose, { Schema } from "mongoose"

class NftSchema extends Schema {
   
    public schema!: mongoose.Schema;

    constructor() {
        super();
        this.createSchema();
    }

    private createSchema() {
        this.schema = new Schema({
            nftAddress: {type: String, required:true, trim:true },
            name: { type: String, required: true },
            fileType: { type: String, default: 'image' },
            fileHash: { type: String, required: true },
            externalLink: { type: String, default: "" },
            description: { type: String, default: "" },
            tokenUri: { type: String, required:true, unique: true },
            supply: { type: Number, default: 1 },
            royality: { type: Number, max: 100, min: 0, required: true },
            networkId: { type: String, required: true },
            status: { type: String, enum:['PROCESSING', "COMPLETED" ], default: 'PROCESSING' },
            tokenId: {type: Number, default: 0},
            owner:{type: Schema.Types.ObjectId,ref: "User", required: true },
            creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
            collectiondb: { type: Schema.Types.ObjectId, ref: "Collection", required: true },
            transactionHash: { type: String, required: true }
        }, { timestamps: true })
    }
}

export default mongoose.model('Nft', new NftSchema().schema);