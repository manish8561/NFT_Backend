import { NextFunction, Response, Request, Router } from "express";
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
    }

    private async add(req: Request, res: Response) {
        const { Response: { sendError, sendSuccess } } = Helper;
        try {
            let result = await TransactionModel.add(req.body, req.user);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { message: 'SUCCESS', data: result });
        } catch (error: any) {
            return sendError(res, { status: 400, error });
        }
    }
    private async list(req: Request, res: Response) {
        const { Response: { sendError, sendSuccess } } = Helper;
        try {
            let result = await TransactionModel.list(req.body, req.user);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { message: 'SUCCESS', data: result });
        } catch (error: any) {
            return sendError(res, { status: 400, error });
        }
    }
}

export default TransactionController;