import mongoose, { Mongoose, Schema } from "mongoose";

class BuySchema extends Schema {
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
            nft: { type: Schema.Types.ObjectId, ref: "Nft", required: true },
            nftAddress: { type: String, required: true, trim: true },
            token: { type: String, default: "eth" },
            price: { type: String, required: true, default: "" },
            networkId: { type: String, required: true },
            transactionStatus: { type: String, enum: ["CANCEL", "FAILED", "COMPLETED", "PROCESSING"], default: 'PENDING' },
            transactionHash: { type: String, default: "", required: true },
            owner: { type: Schema.Types.ObjectId, ref: "User" }
        }, { timestamps: true })
    }
}

export default mongoose.model('Buy', new BuySchema().schema);