import * as Interfaces from '../../interfaces';
import { Helper } from '../../helpers';
import User from './user.schema';

const {
    Validate: { _validations },
    Response: { errors },
    Utilities: { requestEncryption, generateJwt }
} = Helper;

class UserModel {
    constructor() {
    }

    public async checkUserAndMaybeRegister(_user: Interfaces.User): Promise<any> {
        try {
            const { address, role, status } = _user;
            let _errors = await _validations({ address, role, status }); 
            if (Object.keys(errors).length > 0) return errors('ALL_FIELDS_ARE_REQUIRED', _errors);
            let isRegistered : Interfaces.User | any = await this._isUserAddressExists(address);

            if(isRegistered) {
                return errors('USER ALREADY EXISTS');
            }

            return await this._createNewUser(_user);
        } catch (error) {
            return errors('SOMETHING_WENT_WRONG', error);
        }
    }

    private async _createNewUser(_user: Interfaces.User): Promise<any> {
        try {
            let { address, role, status} = _user;
            address = requestEncryption(address);

            let createUser: any = new User({ address, role, status });
            createUser = await createUser.save();
            if(createUser._id) {

            }
        } catch(error) { 
            return errors('SOMETHING_WENT_WRONG', error);
        }
    }

    private async _isUserAddressExists(address: string): Promise<any> {
        return await User.findOne({ address });
    }

    public async generateJwtToken(user: Interfaces.User | any): Promise<any> {
        const { _id, address } = user;
        return await generateJwt({address, _id});
    }
}

export default new UserModel();