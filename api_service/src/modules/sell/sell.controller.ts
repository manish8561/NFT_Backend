import { Response, Router } from "express";
import * as Interfaces from '../../interfaces';
import { Helper } from '../../helpers';
import ValidateJWT from "../../middlewares/jwt.middleware";
import SellModel from "./sell.model";

class SellController implements Interfaces.Controller {

    public path = "/sell";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private async initializeRoutes() {
        this.router
            .all(`${this.path}/*`)
            .post(`${this.path}/sellItem`, ValidateJWT, this.sell_Item)
            .get(`${this.path}/getSellNft/:id`, this.getSellNftDetails)
            .get(`${this.path}/cancelNft/:id`, ValidateJWT, this.cancelSellNFT)
            .post(`${this.path}/update`, ValidateJWT, this.updateSellNFT)
    }
    /**
     * @param  {any} req
     * @param  {Response} res
     */
    private async sell_Item(req: any, res: Response) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { nft: { SELL_NFT }, errors: { SOMETHING_WENT_WRONG } }
        } = Helper;
        try {
            const data:any = req.body;
            data.user = req.user;
            const result: any = await SellModel.sellNFT(data);
            if (result.error) return sendError(res, { status: 400, error: result.error });
            return sendSuccess(res, { message: SELL_NFT });
        } catch (error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
    /**
     * @param  {any} req
     * @param  {Response} res
     */
    private async getSellNftDetails(req: any, res: Response) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { errors: { SOMETHING_WENT_WRONG }}
        } = Helper;
        try {
            const _id: any = req.params.id;
            const result: any = await SellModel.getSellNFT(_id);
            if (result.error) return sendError(res, { status: 400, error: result.error });
            return sendSuccess(res, { data: result });
        } catch(error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
    /**
     * @param  {any} req
     * @param  {Response} res
     */
    private async cancelSellNFT(req: any, res: Response) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { errors: { SOMETHING_WENT_WRONG }}
        } = Helper;
        try {
            const id: any = req.params.id;
            const result: any = await SellModel.cancelNFT(id);
            if (result.error) return sendError(res, { status: 400, error: result.error });
            return sendSuccess(res, { data: result });
        } catch(error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
    /**
     * @param  {any} req
     * @param  {Response} res
     */
    private async updateSellNFT(req: any, res: Response) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { errors: { SOMETHING_WENT_WRONG }}
        } = Helper;
        try {
            if(Object.keys(req.body).length === 0) {
                return sendError(res, { status: 400, error: { message : 'No data posted' } })
            }
            const result: any = await SellModel.updateSellNft(req.body);
            if (result.error) return sendError(res, { status: 400, error: result.error });
            return sendSuccess(res, { data: result });
        } catch(error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
}

export default SellController;