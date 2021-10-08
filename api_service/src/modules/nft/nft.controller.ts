import { Response, Request, Router } from "express";
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
            .post(`${this.path}/search`, this.searchNFT)
    }
    /**
     * @param  {any} req
     * @param  {Response} res
     */
    private async add(req: any, res: Response) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { nft: { CREATE }, common: { NO_DATA }, errors: { SOMETHING_WENT_WRONG } }
        } = Helper;
        try {     
            if (!Object.keys(req.body).length) {
                return sendError(res, { status: 400, error: { message: NO_DATA } });
            }
            let _data = req.body;
            _data.user = req.user!;
            const result = await NftModel.add(_data);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { message: CREATE });
        } catch (error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
    /**
     * @param  {any} req
     * @param  {Response} res
     */
    private async getNFTDetail(req: any, res: Response) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { nft: { GET_NFT_DETAIL }, errors: { SOMETHING_WENT_WRONG }}
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
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }

    private async searchNFT(req: any, res: Response) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { errors: { SOMETHING_WENT_WRONG }}
        } = Helper;
        try {
            const result: any = await NftModel.searchNft(req.body);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { data: result, message: 'Fetch successfully' });
        } catch(error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
}

export default NftController;