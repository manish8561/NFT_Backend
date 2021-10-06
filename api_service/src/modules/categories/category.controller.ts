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
            .post(`${this.path}/add`, ValidateAdminJWT, this.adminAddCategory)
            .get(`${this.path}/delete/:id`, ValidateAdminJWT, this.adminDeleteCategory)
            .put(`${this.path}/update`, ValidateAdminJWT, this.adminUpdateCategory)
            .get(`${this.path}/get`, ValidateAdminJWT, this.getAdminCategory)
            .get(`${this.path}/userCategories`, this.getUserCategories)

    }
    /**
     * @param  {Request} req
     * @param  {Response} res
     */
    private async getAdminCategory(req: Request | any, res: Response) {
        const { Response: { sendError, sendSuccess } } = Helper;
        try {
            let result: any = await CategoryModel.getCategories();
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { message: 'SUCCESS', result });
        } catch (error: any) {
            return sendError(res, { status: 400, error });
        }
    }
    /**
     * @param  {Request} req
     * @param  {Response} res
     */
    private async adminAddCategory(req: Request | any, res: Response) {
        const { Response: { sendError, sendSuccess } } = Helper;
        try {
            if (Object.keys(req.body).length < 1) {
                return sendError(res, { status: 400, error: { message: 'No data posted' } });
            }
            let result: any = await CategoryModel.addCatgories(req.body);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { message: 'SUCCESS', result });
        } catch (error: any) {
            return sendError(res, { status: 400, error });
        }
    }
    /**
     * @param  {Request|any} req
     * @param  {Response} res
     */
    private async adminDeleteCategory(req: Request | any, res: Response) {
        const { Response: { sendError, sendSuccess } } = Helper;
        try {
            let data: any = req.params;
            let result: any = await CategoryModel.deleteCategory(data.id);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { message: 'SUCCESS', result });
        } catch (error: any) {
            return sendError(res, { status: 400, error });
        }
    }
    /**
     * @param  {Request|any} req
     * @param  {Response} res
     */
    private async adminUpdateCategory(req: Request | any, res: Response) {
        const { Response: { sendError, sendSuccess } } = Helper;
        try {
            if (Object.keys(req.body).length < 1) {
                return sendError(res, { status: 400, error: { message: 'Parameter is missing' } });
            }
            let result: any = await CategoryModel.updateCategory(req.body);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { message: 'SUCCESS', result });
        } catch (error: any) {
            return sendError(res, { status: 400, error });
        }
    }
    /**
     * @param  {Request|any} req
     * @param  {Response} res
     */
    private async getUserCategories(req: Request | any, res: Response) {
        const { Response: { sendError, sendSuccess } } = Helper;
        try {
            let result: any = await CategoryModel.getUserCategories();
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { message: 'SUCCESS', result });
        } catch (error: any) {
            return sendError(res, { status: 400, error });
        }
    }        
}

export default CategoryController;