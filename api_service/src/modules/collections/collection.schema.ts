import mongoose, { Mongoose, Schema } from "mongoose";
import mongooseUniqueValidator from 'mongoose-unique-validator';
import * as Interfaces from '../../interfaces';

class CollectionSchema extends Schema<Interfaces.Collection> implements Interfaces.Collection {
   
    public schema!: mongoose.Schema;

    constructor() {
        super();
        this.createSchema();
    }

    name: string = "";
    externalLink: string = "";
    description: string = "";
    logo: string = "";
    banner: string = "";
    featuredBanner: string = "";
    category: string = "";
    links: string[] = [];
    royality: string = "";
    payoutWalletAddress: string = "";
    collaborators: string[] = [];
    blockChain: string = "";
    displayTheme: string = "";
    paymentToken: string[] = [];
    sensitiveContent: string = "";
    status: string = "";
    user: mongoose.Types.ObjectId | any = '';


    private createSchema() {
        this.schema = new Schema({
            name: { type: String, required: true },
            logo: { type: String, required: true },
            category: { type: String, required: true },
            externalLink: { type: String, default: "" },
            description: { type: String, default: "" },
            banner: { type: String, default: "" },
            featuredBanner: { type: String, default: "" },
            links: { type: Array },
            royality: { type: Number, max: 100, min: 0, required: true },
            payoutWalletAddress: { type: String, required: true },
            collaborators: { type: Array, required: true },
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