import { Helper } from '../../helpers';
import User from './user.schema';

class UserModel {

    constructor() { }
    /**
     * @param  {any} _user
     * @returns Promise
     */
    public async loginUserOrMaybeRegister(_user: any): Promise<any> {
        const { Validate: { _validations }, Response: { errors } } = Helper;
        try {
            _user.walletAddress=_user.walletAddress.toLowerCase();
            const { walletAddress, wallet, networkId } = _user;
            const isError = await _validations({ walletAddress, wallet, networkId });
            if (Object.keys(isError).length > 0) return errors('ALL_FIELDS_ARE_REQUIRED', isError);
            let isRegistered = await this._isUserAddressExists(walletAddress);
            if (isRegistered) return isRegistered;
            return await this._createNewUser(_user);
        } catch (error) {
            return errors('SOMETHING_WENT_WRONG', error);
        }
    }
    /**
     * @param  {any} _user
     * @returns Promise
     */
    private async _createNewUser(_user: any): Promise<any> {
        const { Response: { errors } } = Helper;
        
        try {
            const createUser: any = new User({ ..._user });
            await createUser.save();
            return createUser;
        } catch (error) {
            console.log(error, 'insert');

            return errors('SOMETHING_WENT_WRONG', error);
        }
    }
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async updateUserProfile(data: any): Promise<any> {
        const {
            Validate: { _validations },
            Response: { errors },
            ResMsg: {
                user: { UPDATE_USER, VERIFY_EMAIL },
                errors: { ALL_FIELDS_ARE_REQUIRED, SOMETHING_WENT_WRONG }
            }
        } = Helper;
        try {
            const { user, email, username, bio, socialLinks } = data;
            const isError = await _validations({ _id: user['_id'] });
            let obj = {
                username,
                email,
                bio,
                socialLinks
            };
            if (Object.keys(isError).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, isError);
            return await User.updateOne({ _id: user['_id'] }, { $set : obj }, { upsert:false });
 
        } catch(error: any) {
            throw error;
        }
    }
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async updateUserVerifyStatus(data: any): Promise <any> {
        const {
            Validate: { _validations },
            Response: { errors },
            ResMsg: {
                user: { UPDATE_USER_VERIFICATION_STATUS },
                errors: { ALL_FIELDS_ARE_REQUIRED, SOMETHING_WENT_WRONG }
            }
        } = Helper;
        try {
            const { _id } = data;
            const isError = await _validations({ _id });
            if (Object.keys(isError).length > 0) return errors(ALL_FIELDS_ARE_REQUIRED, isError);
            return await User.updateOne({ _id }, { $set : { verificationStatus: true }}, { upsert:false });
        } catch(error: any) {
            throw error;
        }
    }

    /**
     * @param  {string} walletAddress
     * @returns Promise
     */
    private async _isUserAddressExists(walletAddress: string): Promise<any>  {
        return await User.findOne({ walletAddress });
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
    public async details(_id:string):Promise<any> {
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
    public async fetchAllUsers(data: any): Promise<any> {
        try {
            let query:any = { role: { $ne: 'ADMIN' } };
            let { page, limit, filters } = data;
            if(filters && filters.search){
                let { search } = filters;
                search = search.toString();
                query.username = new RegExp(search,'i');
                query.email = new RegExp(search,'i');
            }
            if(filters && filters.walletAddress){
                query.walletAddress = filters.walletAddress.toLowerCase();
            }

            if (!page) {
                page = 1;
            }
            if (!limit) {
                limit = 10;
            }
           
            return await User.find(query).skip(page-1).limit(page * limit).sort({ createdAt: -1 });
        } catch(error: any) {
            throw error;
        }
    }
}

export default new UserModel();