import mongoose, { Mongoose, Schema } from "mongoose";
import mongooseUniqueValidator from 'mongoose-unique-validator';
import * as Interfaces from '../../interfaces';

class UserSchema extends Schema {
    public schema!: mongoose.Schema;

    constructor() {
        super();
        this.createSchema();
    }

    private createSchema() {
        this.schema = new Schema({
            wallet: { type: String, trim: true, default: "METAMASK" },
            walletAddress: { type: String, unique: true, index: true, trim: true, required: true },
            networkId: { type: String, required: true },
            username: { type: String, unique: true, index: true, trim: true },
            email: { type: String, unique: true, trim: true },
            bio: { type: String, default: "" },
            socialLinks: { type: Array },
            role: { type: String, default: 'USER' },
            status: { type: String, default: 'ACTIVE' },
        }, { timestamps: true })

        this.schema.plugin(mongooseUniqueValidator, { type: 'mongoose-unique-validator' });
    }
}

export default mongoose.model('User', new UserSchema().schema);