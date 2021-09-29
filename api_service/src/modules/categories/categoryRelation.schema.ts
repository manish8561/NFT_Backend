import mongoose, { Schema } from "mongoose"

class CategoryRelationSchema extends Schema {
   
    public schema!: mongoose.Schema;

    constructor() {
        super();
        this.createSchema();
    }

    private createSchema() {
        this.schema = new Schema({
            category : { type: Schema.Types.ObjectId, ref:'Category' },
            collectionDb: { type: Schema.Types.ObjectId, ref: "Collection"}
        }, { timestamps: true })
    }
}

export default mongoose.model('CategoryRelation', new CategoryRelationSchema().schema);