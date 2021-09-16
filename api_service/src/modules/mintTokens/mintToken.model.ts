import mongoose from 'mongoose';
import { Helper } from '../../helpers';
import MintTokens from './mintToken.schema'; 
import * as Interfaces from "../../interfaces";

class MintTokenModel {

    constructor() { }

    /** 
     * @function createWallet
     * @param _wallet
     * @returns user
     */
    public async getMintedTokens(data: Interfaces.MintToken): Promise<any> {
        try {
            let { page, limit, user } = data;
            page = Number(page) || 0;
            limit = Number(limit) || 10;
            return await MintTokens.find({ user: { $regex: user, $options: 'i' } }).limit(limit).skip((page) * limit).sort({ timestamp: -1 });
        } catch (error) {
            const { Response: { errors }, ResMsg: { errors: { SOMETHING_WENT_WRONG } } } = Helper;
            return errors(SOMETHING_WENT_WRONG, error);
        }
    }

    public async uploadFile(data: any): Promise<any> {
        try {
            const { file } = data;
            return `http://10.1.2.143:3001${file['path']}`;
        } catch (error) {
            const { Response: { errors }, ResMsg: { errors: { SOMETHING_WENT_WRONG } } } = Helper;
            return errors(SOMETHING_WENT_WRONG, error);
        }
    }
}

export default new MintTokenModel();