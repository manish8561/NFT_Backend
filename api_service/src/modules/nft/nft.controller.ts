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
            .post(`${this.path}/add`, ValidateJWT, this.add)
            .get(`${this.path}/getNft/:id`, this.getNFTDetail)
    }

    private async add(req: any, res: Response, next: NextFunction) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { nft: { CREATE }, common: { NO_DATA } }
        } = Helper;
        try {     
            let _data = req.body;
            _data.user = req.user!;
           console.log('**********',req.body)
            if (!req.body) {
                return sendError(res, { status: 400, error: {message: NO_DATA} });
            }

            const result = await NftModel.add(_data);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { message: CREATE });
        } catch (error: any) {
            return sendError(res, { status: 400, error });
        }
    }

    private async getNFTDetail(req: any, res: Response, next: NextFunction) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { nft: { GET_NFT_DETAIL }}
        } = Helper;
        try {
            const id: any = req.params.id
            if(!id) {
                return sendError(res, { status: 400, error: {message: 'nftId is missing'} });
            }
            const result: any = await NftModel.getNFT(id);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { data: result, message: GET_NFT_DETAIL });
        } catch(error: any) {
            return sendError(res, { status: 400, error });
        }
    }
}

export default NftController;