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
        const { Response: { sendError, sendSuccess } } = Helper;

        try {
            const data: Interfaces.MintToken = req.body;
            const result: any = await MintTokenModel.getMintedTokens(data);
            /** return error - failed status */
            if (result.errors) return sendError(res, { status: 400, error: result.errors });

            /** return seccess - registered user */
            return sendSuccess(res, { message: "Fetched Minted Data", data: { logs: result } });
        } catch (error) {
            return sendError(res, { status: 500, error: { error } });
        }
    }

    private async uploadFile(req: Request, res: Response, next: NextFunction) {
        const { Response: { sendError, sendSuccess } } = Helper;

        try {
            const data: any = { file: req.file, host: req.hostname };
            const result = await MintTokenModel.uploadFile(data);
            /** return error - failed status */
            if (result.errors) return sendError(res, { status: 400, error: result.errors });

            /** return seccess - registered user */
            return sendSuccess(res, { message: "Fetched Minted Data", data: { file: result } });
        } catch (error) {
            return sendError(res, { status: 500, error: { error } });
        }
    }

}

export default MintTokenController;