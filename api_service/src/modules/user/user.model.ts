import * as Interfaces from '../../interfaces';
import { Helper } from '../../helpers';
import User from './user.schema';

class UserModel {

    constructor() { }

    public async loginUserOrMaybeRegister(_user: any): Promise<any> {
        const { Validate: { _validations }, Response: { errors } } = Helper;

        try {
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

    private async _createNewUser(_user: any): Promise<any> {
        const { Response: { errors } } = Helper;

        try {
            const createUser: any = new User({ ..._user });
            return await createUser.save();
        } catch (error) {
            return errors('SOMETHING_WENT_WRONG', error);
        }
    }

    private async _isUserAddressExists(walletAddress: string): Promise<any>  {
        return await User.findOne({ walletAddress });
    }

    public async generateJwtToken(user: any): Promise<string> {
        const { Utilities: { generateJwt } } = Helper;
        const { _id, walletAddress, role } = user;
        return await generateJwt({ walletAddress, _id, role });
    }
}

export default new UserModel();