import { Response, Request, Router } from "express";
import * as Interfaces from '../../interfaces';

import { Helper } from '../../helpers';
import ValidateJWT from "../../middlewares/jwt.middleware";
import BiddingModel from "./bidding.model";
import ValidateAdminJWT from "../../middlewares/admin.middleware";

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
            .post(`${this.path}/list`, ValidateJWT, this.listAllBidds)
            .post(`${this.path}/cancel`, ValidateJWT, this.cancelNftBid)
            .post(`${this.path}/accept`, ValidateJWT, this.acceptNftBid)
            .post(`${this.path}/admin/list`, ValidateAdminJWT, this.adminList)
            .get(`${this.path}/admin/delete/:id`, ValidateAdminJWT, this.adminDeleteBid)
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
            return sendSuccess(res, { message: 'Bid submit successfully' });
        } catch(error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
    /**
     * @param  {any} req
     * @param  {Response} res
     */
    private async listAllBidds(req: any, res: Response) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { errors: { SOMETHING_WENT_WRONG } }
        } = Helper;
        try {
            if(!req.body.id) {
                return sendError(res, { status: 400, error: { message: 'Id is required'} });
            }
            const result: any = await BiddingModel.listBidd(req.body);
            if (result.error) return sendError(res, { status: 400, error: result.error });
            return sendSuccess(res, { data: result, message: 'Bid list successfully' });
        } catch(error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
    /**
     * @param  {any} req
     * @param  {Response} res
     */
    private async cancelNftBid(req: any, res: Response) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { errors: { SOMETHING_WENT_WRONG } }
        } = Helper;
        try {
            let data: any = req.body;
            data.user = req.user;
            if(!data.id) {
                return sendError(res, { status: 400, error: { message: 'Id is required'} });
            }
            const result: any = await BiddingModel.cancelBidd(data);
            if (result.error) return sendError(res, { status: 400, error: result.error });
            return sendSuccess(res, { data: result, message: 'Bid delete successfully' });

        } catch(error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
    /**
     * @param  {any} req
     * @param  {Response} res
     */
    private async acceptNftBid(req: any, res: Response) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { errors: { SOMETHING_WENT_WRONG } }
        } = Helper;
        try {
            let data: any = req.body;
            if(!data.id) {
                return sendError(res, { status: 400, error: { message: 'Id is required'} });
            }
            const result: any = await BiddingModel.acceptBidding(data);
            if (result.error) return sendError(res, { status: 400, error: result.error });
            return sendSuccess(res, { data: result, message: 'Bid accept successfully' });
        } catch(error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
    /**
     * @param  {any} req
     * @param  {Response} res
     */
     private async adminList(req: any, res: Response) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { errors: { SOMETHING_WENT_WRONG } }
        } = Helper;
        try {
            const result: any = await BiddingModel.adminList(req.body);
            if (result.error) return sendError(res, { status: 400, error: result.error });
            return sendSuccess(res, { data: result, message: 'Bids list successfully' });
        } catch(error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
    /**
     * @param  {any} req
     * @param  {Response} res
     */
     private async adminDeleteBid(req: any, res: Response) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { errors: { SOMETHING_WENT_WRONG } }
        } = Helper;
        try {
            const { id } = req.params;
            if(!id) {
                return sendError(res, { status: 400, error: { message: 'Id is required'} });
            }
            const result: any = await BiddingModel.adminDeleteBid(id);
            if (result.error) return sendError(res, { status: 400, error: result.error });
            return sendSuccess(res, { data: true, message: 'Bid deleted successfully' });
        } catch(error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
}

export default BiddingController;