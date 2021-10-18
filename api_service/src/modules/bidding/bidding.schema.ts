import mongoose, { Schema } from "mongoose"

class BiddingSchema extends Schema {
   
    public schema!: mongoose.Schema;

    constructor() {
        super();
        this.createSchema();
    }

    private createSchema() {
        this.schema = new Schema({
            token: { type: String, default: "", required: true },
            price: { type: String, default: "", required: true },
            startDate: { type: Date, required: true },
            endDate: { type: Date, required: true },
            networkId: { type: String, default: "", required: true },
            nft: { type: Schema.Types.ObjectId, ref: "Nft", required: true },
            sellNft: { type: Schema.Types.ObjectId, ref: "Sell", required: true },
            user: { type: Schema.Types.ObjectId, ref: "User", required: true },
            status: { type: String, enum:["INACTIVE", "ACTIVE", "EXPIRED", "ACCEPTED", "PROCESSING"], default: "PENDING" },
            transactionStatus: { type: String, enum: ["CANCEL", "FAILED", "COMPLETED", "PROCESSING"], default: 'PENDING' },
            transactionHash: { type: String, default: "", required: true },
        }, { timestamps: true })
    }
}

export default mongoose.model('Bidding', new BiddingSchema().schema);