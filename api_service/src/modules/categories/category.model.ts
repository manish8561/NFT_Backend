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
     * for frontend
     * @returns Promise
     */
    public async getUserCategories(): Promise <any> {
        try{
            return await Category.find({ status: 'ACTIVE' });
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
            },
            Utilities: { capitalize_Words }
        } = Helper
        try{
            const { name } = data;
            const isError = await _validations({ name });
            if (Object.keys(isError).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, isError);
            const Name = await capitalize_Words(name);
            const count = await Category.countDocuments({ name: Name });
            if(count === 0) {
                const category: any = new Category({name: Name});
                return await category.save();
            } else {
                return {
                    status: 400,
                    message: 'Category already exist'
                }
            }
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
    /**
     * @param  {any} data
     */
    public async updateCategory(data: any) {
        const { 
            Validate: { _validations }, 
            Response: { errors },
            ResMsg: { 
                errors: { ALL_FIELDS_ARE_REQUIRED, SOMETHING_WENT_WRONG }
            }
        } = Helper;
        try {
            const { id, name, status } = data;
            const isError = await _validations({ _id: id, name });
            if (Object.keys(isError).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, isError);
            await Category.updateOne({ _id: id }, { name, status } );
            return true;
        } catch(error: any) {
            throw error;
        }
    }
}

export default new CategoryModel();