import mongoose, { Schema } from "mongoose"

class SellSchema extends Schema {
   
    public schema!: mongoose.Schema;

    constructor() {
        super();
        this.createSchema();
    }

    private createSchema() {
        this.schema = new Schema({
            nft: { type: Schema.Types.ObjectId, ref: "Nft", required: true },
            nftAddress: { type: String, required: true, trim: true },
            token: { type: String, default: "eth" },
            sellType: { type: String, enum: ["SET_PRICE", "AUCTION"], default: "SET_PRICE", required: true },
            bidType: { type: String, default: "HIGHEST_BID" },
            price: { type: String, required: true, default: "" },
            endingPrice: { type: String, default: "" },
            expirationDate: { type: Date },
            futureDate: { type: Date },
            allowedBuyerAddress: { type: String, default: ""},
            networkId: { type: String, required: true },
            minimumBid: { type: String, default: "" },
            reservedPrice: { type: String, default: "" },
            status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE"},
            transactionStatus: { type: String, enum: ["CANCEL", "FAILED", "COMPLETED", "PROCESSING"], default: 'PENDING' },
            transactionHash: { type: String, default: "", required: true },
            owner: { type: Schema.Types.ObjectId, ref: "User" },
        }, { timestamps: true })
    }
}

export default mongoose.model('Sell', new SellSchema().schema);