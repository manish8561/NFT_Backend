import { Response, Router } from "express";
import * as Interfaces from '../../interfaces';
import TransactionModel from "./transaction.model";
import { Helper } from '../../helpers';
import ValidateJWT from "../../middlewares/jwt.middleware";


class TransactionController implements Interfaces.Controller {
   
    public path = "/transaction";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }
 
    private async initializeRoutes() {
        this.router
            .all(`${this.path}/*`)
            .post(`${this.path}/add`, ValidateJWT, this.add)
            .post(`${this.path}/list`, ValidateJWT, this.list)
            .post(`${this.path}/getTransactionByNftId`, this.getTransactionByNftId )
    }
    /**
     * @param  {any} req
     * @param  {Response} res
     */
    private async add(req: any, res: Response) {
        const { Response: { sendError, sendSuccess } } = Helper;
        try {
            
            const data = req.body;
            data.user = req.user;
            let result = await TransactionModel.add(data);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { message: 'SUCCESS', data: result });
        } catch (error: any) {
            return sendError(res, { status: 400, error });
        }
    }
    /**
     * @param  {any} req
     * @param  {Response} res
     */
    private async list(req: any, res: Response) {
        const { Response: { sendError, sendSuccess } } = Helper;
        try {
            const data = req.body;
            data.user = req.user;
            let result = await TransactionModel.list(data);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { message: 'SUCCESS', data: result });
        } catch (error: any) {
            return sendError(res, { status: 400, error });
        }
    }
    /**
     * @param  {any} req
     * @param  {Response} res
     */
    private async getTransactionByNftId(req: any, res: Response) {
        const { Response: { sendError, sendSuccess } } = Helper;
        try {
            const error = { message:'Enter complete parameters' };

            if(Object.keys(req.body).length <= 0) {
                return sendError(res, { status: 400, error })
            }
            const result = await TransactionModel.getTransactionByNftId(req.body);
            if(result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { data: result });
        } catch(error: any) {
            return sendError(res, { status: 400, error });
        }
    }
}

export default TransactionController;