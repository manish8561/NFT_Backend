import { NextFunction } from 'express';
import mongoose, { Mongoose, Schema } from 'mongoose';

class MintTokenSchema extends Schema {
    
    public schema!: mongoose.Schema;

    constructor() {
        super();
        this.createSchema();
    }

    private createSchema() {
        this.schema = new Schema({
            user: { type: String, index: true, trim: true },
            tokenId: { type: String, trim: true },
            tokenAmount: { type: String, trim: true },
            tokenUri: { type: String, trim: true },
            timestamp: { type: Number, index: true, trim: true },
        }, { timestamps: false });
    }
}

export default mongoose.model('MintTokens', new MintTokenSchema().schema);
