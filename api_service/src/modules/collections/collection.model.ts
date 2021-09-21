import * as Interfaces from '../../interfaces';
import { Helper } from '../../helpers';
import Collection from './collection.schema';

class CollectionModel {

    constructor() { }

    public async getCollection(query: any): Promise<any> {
        const { 
            Response: { errors },
            ResMsg: { errors: { SOMETHING_WENT_WRONG } }
        } = Helper;

        try {
            let { page, limit, filters, user } = query;
            console.log(filters);

            return await Collection.find({ user }).skip(page).limit((page) * limit).sort({ createdAt: -1 });
        } catch (error) {
            return errors(SOMETHING_WENT_WRONG, error);
        }
    }

    public async createCollection(_collection: any): Promise<any> {
        const { 
            Validate: { _validations }, 
            Response: { errors },
            ResMsg: { 
                collection: { COLLECTION_IS_ALREADY_CREATED },
                errors: { ALL_FIELDS_ARE_REQUIRED, SOMETHING_WENT_WRONG } 
            }
        } = Helper;

        try {
            const { name, description, logo } = _collection;
            const isError = await _validations({ name, description, logo });
            if (Object.keys(isError).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, isError);
            let isAlreadyCreated= await this._isCollectionCreated(name);
            if (isAlreadyCreated) return errors(COLLECTION_IS_ALREADY_CREATED, isAlreadyCreated);
            return await this._createCollection(_collection);
        } catch (error) {
            return errors(SOMETHING_WENT_WRONG, error);
        }
    }

    private async _createCollection(_collection: any): Promise<any> {
        const { Response: { errors }, ResMsg: { errors: { SOMETHING_WENT_WRONG } } } = Helper;

        try {
            const createCollection: any = new Collection({ ..._collection });
            return await createCollection.save();
        } catch (error) {
            return errors(SOMETHING_WENT_WRONG, error);
        }
    }

    private async _isCollectionCreated(name: string): Promise<any> {
        return await Collection.findOne({ name: { $regex: name, $options: 'i' } });
    }
}

export default new CollectionModel();