import { NextFunction, Response, Request, Router } from "express";
import * as Interfaces from '../../interfaces';
import NftModel from "./nft.model";
import { Helper } from '../../helpers';
import ValidateJWT from "../../middlewares/jwt.middleware";

class NftController implements Interfaces.Controller {

    public path = "/nft";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }
    private async initializeRoutes() {
        this.router
            .all(`${this.path}/*`)
            // .post(`${this.path}/add`, ValidateJWT, this.add)
            .post(`${this.path}/add`, this.add)
    }

    private async add(req: Request, res: Response, next: NextFunction) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { nft: { CREATE }, common: { NO_DATA } }
        } = Helper;

        try {
            const { _id } = req.user!;
            if (!req.body) {
                return sendError(res, { status: 400, error: {message: NO_DATA} });
            }
            let _data = req.body;
            _data.user = _id;

            const result = await NftModel.add(_data);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { message: CREATE });
        } catch (error: any) {
            return sendError(res, { status: 400, error });
        }
    }

}

export default NftController;