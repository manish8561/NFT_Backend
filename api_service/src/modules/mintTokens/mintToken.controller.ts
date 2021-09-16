import { NextFunction, Request, Response, Router } from "express";
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
            .post(`${this.path}/getMintedTokens`, this.getMintedTokens)
            .post(`${this.path}/uploadFile`, FileValidator, this.uploadFile)
    }

    private async getMintedTokens(req: Request, res: Response, next: NextFunction) {
        try {
            const { Response: { error, success } } = Helper;
            const data: Interfaces.MintToken = req.body;
            const result: any = await MintTokenModel.getMintedTokens(data);
            /** return error - failed status */
            if (result.errors) return error(res, { status: 400, error: result.errors });

            /** return seccess - registered user */
            return success(res, { message: "Fetched Minted Data", data: { logs: result } });
        } catch (err) {
            const { Response: { error }, ResMsg: { errors: { INTERNAL_SERVER_ERROR } } } = Helper;
            return error(res, { status: 500, error: { message: INTERNAL_SERVER_ERROR, error: err } });
        }
    }

    private async uploadFile(req: Request, res: Response, next: NextFunction) {
        try {
            const { Response: { error, success } } = Helper;
            const data: any = { file: req.file, host: req.hostname };
            const result = await MintTokenModel.uploadFile(data);
            /** return error - failed status */
            if (result.errors) return error(res, { status: 400, error: result.errors });

            /** return seccess - registered user */
            return success(res, { message: "Fetched Minted Data", data: { file: result } });
        } catch (err) {
            const { Response: { error }, ResMsg: { errors: { INTERNAL_SERVER_ERROR } } } = Helper;
            return error(res, { status: 500, error: { message: INTERNAL_SERVER_ERROR, error: err } });
        }
    }

}

export default MintTokenController;