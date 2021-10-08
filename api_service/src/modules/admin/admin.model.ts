import { Helper } from '../../helpers';
import User from '../user/user.schema';

class AdminModel {

    constructor() { }
    /**
     * @param  {any} _user
     * @returns Promise
     */
    public async login(_user: any): Promise<any> {
        const { Validate: { _validations }, Response: { errors } } = Helper;
        try {
            _user.walletAddress=_user.walletAddress.toLowerCase();
            const { walletAddress, wallet, email } = _user;
            console.log(walletAddress, email, 'admin')
            const isError = await _validations({ walletAddress, email });
            if (Object.keys(isError).length > 0) return errors('ALL_FIELDS_ARE_REQUIRED', isError);
            const user = await User.findOne({walletAddress, email, role:'ADMIN'});
            if(user){
                return user;
            } else {
                 return {
                    status: 400,
                    errors: 'Wrong credentials'
                }
            }
        } catch (error) {
            console.log(error, 'model')
            throw error;
        }
    }
    
    /**
     * @param  {any} user
     * @returns Promise
     */
    public async generateJwtToken(user: any): Promise<string> {
        const { Utilities: { generateJwt } } = Helper;
        const { _id, walletAddress, role } = user;
        return await generateJwt({ walletAddress, _id, role });
    }
    /**
     * @param  {string} _id
     * @returns Promise
     */
    public async details(_id:string):Promise<any>{
        try {
            return await User.findOne({_id});
        } catch (error) {
            return error;
        }
    }
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async adminUpdateUser(data: any): Promise<any> {
        const { Validate: { _validations }, Response: { errors } } = Helper;
        try {
            const { status, id } = data;
            const isError = await _validations({ _id: id, status });
            if (Object.keys(isError).length > 0) return errors('ALL_FIELDS_ARE_REQUIRED', isError);
            await User.updateOne({_id: id }, { status }, { upsert: false });
            return true;
        } catch(error: any) {
            throw error;
        }
    }
}

export default new AdminModel();