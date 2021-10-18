import { Response, Request, Router } from "express";
import * as Interfaces from '../../interfaces';

import { Helper } from '../../helpers';
import ValidateJWT from "../../middlewares/jwt.middleware";
import BiddingModel from "./bidding.model";

class BiddingController implements Interfaces.Controller {

    public path = "/bidding";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }
    private async initializeRoutes() {
        this.router
            .all(`${this.path}/*`)
            .post(`${this.path}/add`, ValidateJWT, this.biddAnOffer)
    }
    
    /**
     * @param  {any} req
     * @param  {Response} res
     */
    private async biddAnOffer(req: any, res: Response) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { errors: { SOMETHING_WENT_WRONG } }
        } = Helper;
        try {
            let data:any = req.body;
            data.user = req.user;
            const result: any = await BiddingModel.addBid(data);
            if (result.error) return sendError(res, { status: 400, error: result.error });
            return sendSuccess(res, { data: result, message: 'Bid submit successfully' });
        } catch(error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
}

export default BiddingController;