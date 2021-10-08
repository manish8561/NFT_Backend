import { Response, Router } from "express";
import * as Interfaces from '../../interfaces';
import { Helper } from '../../helpers';
import ValidateJWT from "../../middlewares/jwt.middleware";
import BuyModel from "./buy.model";

class BuyController implements Interfaces.Controller {

    public path = "/buy";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private async initializeRoutes() {
        this.router
            .all(`${this.path}/*`)
            .post(`${this.path}/buyItem`, ValidateJWT, this.buyItem)
    }
    /**
     * @param  {any} req
     * @param  {Response} res
     */
    private async buyItem(req: any, res: Response) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { nft: { BUY_NFT }, errors: { SOMETHING_WENT_WRONG } }
        } = Helper;
        try {
            const data:any = req.body;
            data.user = req.user;
            const result: any = await BuyModel.buyNewItem(data);
            if (result.error) return sendError(res, { status: 400, error: result.error });
            return sendSuccess(res, { message: BUY_NFT });
        } catch (error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
}

export default BuyController;