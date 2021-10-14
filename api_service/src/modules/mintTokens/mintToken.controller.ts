import { Request, Response, Router } from "express";
import { Helper } from "../../helpers";
import * as Interfaces from '../../interfaces';
import MintTokenModel from './mintToken.model';
import FileValidator from '../../middlewares/file.middleware';

class MintTokenController implements Interfaces.Controller {

    public path = '/mint';
    public router = Router();

    constructor() { this.initializeRoutes(); }

    private async initializeRoutes() {
        this.router
            .all(`${this.path}/*`)
            .post(`${this.path}/uploadFile`, FileValidator, this.uploadFile)
    }

    /**
     * @param  {Request} req
     * @param  {Response} res
     */
    private async uploadFile(req: Request, res: Response) {
        const { Response: { sendError, sendSuccess }, ResMsg: { errors: { SOMETHING_WENT_WRONG }} } = Helper;

        try {
            const data: any = { file: req.file, host: req.hostname };
            const result = await MintTokenModel.uploadFile(data);
            /** return error - failed status */
            if (result.errors) return sendError(res, { status: 400, error: result.errors });

            /** return seccess - registered user */
            return sendSuccess(res, { message: "Upload file successfully", data: { file: result } });
        } catch (error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }

}

export default MintTokenController;