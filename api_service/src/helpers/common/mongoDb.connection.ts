import mongoose from 'mongoose';

class MongoDb {
    
    constructor() { }

    /**
     * MongoDb Connection
     */
    public async _connect() {
        const _host = process.env.MONGO_HOSTNAME!;
        const _port = process.env.MONGO_PORT!;
        const _db = process.env.MONGO_DATABASE;
        const url: string = `mongodb://${_host}:${_port}/${_db}`;
        const options: object = { useNewUrlParser: true, useUnifiedTopology: true };
        
        /**
         * Mongo Connectivity
         * @param (string) url
         * @param (object) options
         */
        this.connectivity(url, options);
    }

    private async connectivity(url: string, options: object) {
        try {
            await mongoose.connect(url, options)
            mongoose.set('debug', true);
            console.log("Mongo Connected Successfully,!!");
        } catch (error) {
            console.log({ mongoError: error });
        }
    }
}

export default new MongoDb();
