import { Helper } from '../../helpers';

class MintTokenModel {
    api_url:string;

    constructor() { 
        this.api_url = process.env.API_URL!;
    }

    /**
     * @param  {any} data
     * @returns Promise
     */
    public async uploadFile(data: any): Promise<any> {
        try {
            const { file } = data;
            if (!file) {
                return {
                    errors: 'File is empty'
                }
            }
            // console.log(file, 'before');
            if (!this.api_url) {
                this.api_url = process.env.API_URL!;
            }

            return `${this.api_url}images/${file['filename']}`;

        } catch (error) {
            const { Response: { errors }, ResMsg: { errors: { SOMETHING_WENT_WRONG } } } = Helper;
            throw error;
        }
    }
}

export default new MintTokenModel();