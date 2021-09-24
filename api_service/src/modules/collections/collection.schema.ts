import mongoose, { Mongoose, Schema } from "mongoose";
import mongooseUniqueValidator from 'mongoose-unique-validator';

class CollectionSchema extends Schema {
   
    public schema!: mongoose.Schema;

    constructor() {
        super();
        this.createSchema();
    }

    private createSchema() {
        this.schema = new Schema({
            name: { type: String, required: true },
            logo: { type: String, required: true },
            externalLink: { type: String, default: "" },
            description: { type: String, default: "" },
            banner: { type: String, default: "" },
            featuredBanner: { type: String, default: "" },
            links: { type: Array },
            royality: { type: Number, max: 100, min: 0, required: true },
            payoutWalletAddress: { type: String, required: true },
            collaborators: { type: Array },
            blockChain: { type: String },
            displayTheme: { type: String},
            paymentToken: { type: String  },
            sensitiveContent: { type: String },
            status: { type: String, default: 'ACTIVE' },
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        }, { timestamps: true })

        this.schema.plugin(mongooseUniqueValidator, { type: 'mongoose-unique-validator' });
    }
}

export default mongoose.model('Collection', new CollectionSchema().schema);