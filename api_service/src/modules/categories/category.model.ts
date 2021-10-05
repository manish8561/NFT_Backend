import * as Interfaces from '../../interfaces';
import { Helper } from '../../helpers';
import Category from './category.schema';

class CategoryModel {

    constructor() { }

    public async addCatgories(data: any): Promise <any> {
        const { 
            Validate: { _validations }, 
            Response: { errors },
            ResMsg: { 
                errors: { ALL_FIELDS_ARE_REQUIRED, SOMETHING_WENT_WRONG }
            }
        } = Helper
        try{
            const { name } = data;
            const isError = await _validations({ name });
            if (Object.keys(isError).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, isError);
            const category: any = new Category({name});
            return await category.save();
        } catch(error: any) {
            throw error;
        }
    }

    public async deleteCategory(id: any): Promise<any> {
        const { 
            Validate: { _validations }, 
            Response: { errors },
            ResMsg: { 
                errors: { ALL_FIELDS_ARE_REQUIRED, SOMETHING_WENT_WRONG }
            }
        } = Helper;
        try {
            const isError = await _validations({ _id: id });
            if (Object.keys(isError).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, isError);
            return await Category.deleteOne({ _id: id });
        } catch(error: any) {
            throw error;
        }
    }
}

export default new CategoryModel();