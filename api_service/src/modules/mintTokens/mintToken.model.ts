import { Helper } from '../../helpers';

class MintTokenModel {
    constructor() { }
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async uploadFile(data: any): Promise<any> {
        try {
            const { file } = data;
            if(!file) {
                return {
                    errors : 'File is empty'
                }
            }
            // console.log(file, 'before');
            // return `10.1.1.143:3001/images/${file['filename']}`;
            return `https://nft-api.staging-host.com/api/images/${file['filename']}`;

        } catch (error) {
            const { Response: { errors }, ResMsg: { errors: { SOMETHING_WENT_WRONG } } } = Helper;
            // return errors(SOMETHING_WENT_WRONG, error);
            throw error;
        }
    }
}

export default new MintTokenModel();