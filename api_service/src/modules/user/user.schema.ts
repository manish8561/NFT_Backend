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
            address: { type: String, unique: true, required: true},
            role: { type: String, enum:["USER", "ADMIN"], default: 'USER' },
            status: { type: String, default: 'ACTIVE'},

        }, { timestamps: true})

    this.schema.plugin(mongooseUniqueValidator, { type: 'mongoose-unique-validator'});
    }
}

export default mongoose.model('User', new UserSchema().schema);