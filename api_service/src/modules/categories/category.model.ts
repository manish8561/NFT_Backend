import { Helper } from '../../helpers';
import Category from './category.schema';
import categoryRelation from './categoryRelation.schema';

class CategoryModel {
    constructor() { }
      /**
     * @param  {any} 
     * @returns Promise
     */
       public async getCategories(): Promise <any> {
        try{
            return await Category.find();
        } catch(error: any) {
            throw error;
        }
    }
    /**
     * @param  {any} data
     * @returns Promise
     */
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
    /**
     * @param  {any} id
     * @returns Promise
     */
    public async deleteCategory(_id: any): Promise<any> {
        const { 
            Validate: { _validations }, 
            Response: { errors },
            ResMsg: { 
                errors: { ALL_FIELDS_ARE_REQUIRED, SOMETHING_WENT_WRONG }
            }
        } = Helper;
        try {
            const isError = await _validations({ _id });
            if (Object.keys(isError).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, isError);
            const delRelation = await categoryRelation.deleteMany({ category: _id });
            const delCat =  await Category.deleteOne({ _id });
            return true;
        } catch(error: any) {
            throw error;
        }
    }

    public async updateCategory(data: any) {
        const { 
            Validate: { _validations }, 
            Response: { errors },
            ResMsg: { 
                errors: { ALL_FIELDS_ARE_REQUIRED, SOMETHING_WENT_WRONG }
            }
        } = Helper;
        try {
            const { id, name } = data;
            const isError = await _validations({ _id: id, name });
            if (Object.keys(isError).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, isError);
            return await Category.updateOne({ _id: id }, { name } );
        } catch(error: any) {
            throw error;
        }
    }
}

export default new CategoryModel();