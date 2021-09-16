import mongoose, { Schema } from 'mongoose';

class LogsSchema extends Schema {
    public mongooseObj: any = {};

    private eventsArr: any[] = [
        "MintTokens"
    ];


    constructor() {
        super();
        this.schema();
    }

    private schema() {
        this.eventsArr.map(async d => {
            const objSchema = new Schema({
                blockNumber: { type: Number },
                transactionHash: { type: String },
                timestamp: { type: Number },
                islogUpdated: { type: Boolean, default: false },
                isRewarded: { type: Boolean, default: false },
                compensationPlanID: { type: Number },
                level: { type: Number }
            }, { timestamps: false, strict: false });

            objSchema.index({ timestamp: -1, blockNumber: -1 });
            this.mongooseObj[d] = mongoose.model(d, objSchema);
        });

    }
}

export default new LogsSchema().mongooseObj;


