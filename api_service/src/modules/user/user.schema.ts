import mongoose, { Mongoose, Schema } from "mongoose";
import mongooseUniqueValidator from 'mongoose-unique-validator';
import * as Interfaces from '../../interfaces';

class UserSchema extends Schema<Interfaces.User> implements Interfaces.User {
    public schema!: mongoose.Schema;

    constructor() {
        super();
        this.createSchema();
    }
   
    wallet: string = '';
    walletAddress: string = '';
    networkId: string = '';
    username: string = '';
    email: string = '';
    bio: string = '';
    socialLinks: Interfaces.Social = {
        twitter: "",
        insta: "",
        website: ""
    };

    private createSchema() {
        this.schema = new Schema({
            wallet: { type: String, trim: true, default: "METAMASK" },
            walletAddress: { type: String, unique: true, index: true, trim: true, required: true },
            networkId: { type: String, required: true },
            username: { type: String, unique: true, index: true, trim: true },
            email: { type: String, unique: true, trim: true },
            bio: { type: String, default: "" },
            socialLinks: {
                twitter: { type: String, trim: true, default: "" },
                insta: { type: String, trim: true, default: "" },
                website: { type: String, trim: true, default: "" },
            },
            role: { type: String, enum: [ "USER", "ADMIN" ], default: 'USER' },
            status: { type: String, enum: [ "ACTIVE", "INACTIVE", "BLOCKED" ], default: 'ACTIVE' },
        }, { timestamps: true })

        this.schema.plugin(mongooseUniqueValidator, { type: 'mongoose-unique-validator' });
    }
}

export default mongoose.model('User', new UserSchema().schema);