import mongoose, { Mongoose, Schema } from "mongoose";
import mongooseUniqueValidator from 'mongoose-unique-validator';
import * as Interfaces from '../../interfaces';

class UserSchema extends Schema<Interfaces.Collection> implements Interfaces.Collection {
    public schema!: mongoose.Schema;

    constructor() {
        super();
        this.createSchema();
    }

    name: string = "";
    url: string = "";
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
    paymentTokens: string[] = [];
    sensitiveContent: string = "";
   

    private createSchema() {
        this.schema = new Schema({
            name: { type: String, required: true },
            description: { type: String, required: true },
            url: { type: String, required: true },
            logo: { type: String, required: true },
            banner: { type: String },
            featuredBanner: { type: String },
            category: { type: String, required: true },
            links: { type: Array },
            royality: { type: Number, max: 100, min: 0, required: true },
            payoutWalletAddress: { type: String, required: true },
            collaborators: { type: Array, required: true },
            blockChain: { type: String },
            displayTheme: { type: String},
            paymentTokens: { type: String  },
            sensitiveContent: { type: String },

            status: { type: String, enum: [ "ACTIVE", "INACTIVE", "BLOCKED" ], default: 'ACTIVE' },
        }, { timestamps: true })

        this.schema.plugin(mongooseUniqueValidator, { type: 'mongoose-unique-validator' });
    }
}

export default mongoose.model('User', new UserSchema().schema);