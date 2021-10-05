import { NextFunction, Response, Request, Router } from "express";
import * as Interfaces from '../../interfaces';

import { Helper } from '../../helpers';
import CategoryModel from "./category.model";
import ValidateAdminJWT from "../../middlewares/admin.middleware";

class CategoryController implements Interfaces.Controller {

    public path = "/category";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }
    private async initializeRoutes() {
        this.router
            .all(`${this.path}/*`)
            .post(`${this.path}/addCategory`, ValidateAdminJWT, this.adminAddCategory)
            .get(`${this.path}/deleteCategory/:id`, ValidateAdminJWT, this.adminDeleteCategory)
    }
    /**
     * @param  {Request} req
     * @param  {Response} res
     */
    private async adminAddCategory(req: Request | any, res: Response, next: NextFunction) {
        const { Response: { sendError, sendSuccess } } = Helper;
        try {
            let result: any = await CategoryModel.addCatgories(req.body);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            result = { admin: result };
            return sendSuccess(res, { message: 'SUCCESS', result });
        } catch (error: any) {
            return sendError(res, { status: 400, error });
        }
    }

    private async adminDeleteCategory(req: Request | any, res: Response, next: NextFunction) {
        const { Response: { sendError, sendSuccess } } = Helper;
        try {
            let data: any = req.params;
            let result: any = await CategoryModel.deleteCategory(data.id);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            result = { admin: result };
            return sendSuccess(res, { message: 'SUCCESS', result });
        } catch(error: any) {
            return sendError(res, { status: 400, error });
        }
    }
}

export default CategoryController;