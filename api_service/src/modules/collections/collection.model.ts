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
            // let { page, limit, filters, user } = query;
            return await Collection.find({ externalLink: query.externalLink }).sort({ createdAt: -1 });
            // return await Collection.find({ user }).skip(page).limit((page) * limit).sort({ createdAt: -1 });
        } catch (error) {
            return errors(SOMETHING_WENT_WRONG, error);
        }
    }

    public async isExternalLinkExist(externalLink: string): Promise<any> {
        return await Collection.findOne({ externalLink: { $regex: externalLink, $options: 'i' } });
    }

    public async createCollection(_collection: any): Promise<any> {
        const { 
            Validate: { _validations }, 
            Response: { errors },
            ResMsg: { 
                collection: { COLLECTION_IS_ALREADY_CREATED, EXTERNAL_LINK_IS_ALREADY_IN_USE },
                errors: { ALL_FIELDS_ARE_REQUIRED, SOMETHING_WENT_WRONG } 
            }
        } = Helper;

        try {
            let { name, externalLink, logo } = _collection;
            const isError = await _validations({ name, logo });
            if (Object.keys(isError).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, isError);
            const isAlreadyCreated= await this._isCollectionCreated(name);
            if (isAlreadyCreated) return errors(COLLECTION_IS_ALREADY_CREATED, isAlreadyCreated);

            if (!externalLink) externalLink = name.split(" ").join("-");
            const isExtLinkExist = await this.isExternalLinkExist(externalLink);
            if (isExtLinkExist) return errors(EXTERNAL_LINK_IS_ALREADY_IN_USE);

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