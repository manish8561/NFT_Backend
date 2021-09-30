import mongoose, { Mongoose, Schema } from "mongoose";
import mongooseUniqueValidator from 'mongoose-unique-validator';

class UserSchema extends Schema {
    public schema!: mongoose.Schema;

    constructor() {
        super();
        this.createSchema();
    }

    private createSchema() {
        this.schema = new Schema({
            wallet: { type: String, trim: true, default: "METAMASK" },
            walletAddress: { type: String, unique: true, trim: true, required: true },
            networkId: { type: String, required: true },
            username: { type: String, trim: true },
            email: { type: String, trim: true, default: "" },
            bio: { type: String, default: "" },
            socialLinks: { type: Array },
            role: { type: String, default: 'USER' },
            status: { type: String, default: 'ACTIVE' },
        }, { timestamps: true });
        
        this.schema.index({ walletAddress: 1, username: 1 });
        this.schema.plugin(mongooseUniqueValidator, { type: 'mongoose-unique-validator' });
    }
}

export default mongoose.model('User', new UserSchema().schema);