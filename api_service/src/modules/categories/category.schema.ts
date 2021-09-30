import mongoose, { Schema } from "mongoose"

class CategorySchema extends Schema {
   
    public schema!: mongoose.Schema;

    constructor() {
        super();
        this.createSchema();
    }

    private createSchema() {
        this.schema = new Schema({
            name: { type: String, required: true },
            status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: "ACTIVE" }
        }, { timestamps: true })
    }
}

export default mongoose.model('Category', new CategorySchema().schema);