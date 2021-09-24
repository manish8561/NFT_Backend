import mongoose from "mongoose";
import { NextFunction, Response, Request, Router } from "express";
import * as Interfaces from '../../interfaces';
import CollectionModel from "./collection.model";
import { Helper } from '../../helpers';
import ValidateJWT from "../../middlewares/jwt.middleware";

class CollectionController implements Interfaces.Controller {

    public path = "/collection";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }
    private async initializeRoutes() {
        this.router
            .all(`${this.path}/*`)
            .post(`${this.path}/add`, ValidateJWT, this.add)
            .post(`${this.path}/getCollections`, ValidateJWT, this.getCollections)
            .get(`${this.path}/isSlugExisted`, ValidateJWT, this.isSlugExisted)
    }

    private async add(req: Request, res: Response, next: NextFunction) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { collection: { CREATE_COLLECTION } }
        } = Helper;

        try {
            const { _id } = req.user!;
            let _collection = req.body;
            _collection.user = _id;

            const result = await CollectionModel.createCollection(_collection);
            if (result.error) return sendError(res, { status: 400, error: result.error });
            return sendSuccess(res, { message: CREATE_COLLECTION });
        } catch (error: any) {
            return sendError(res, { status: 400, error });
        }
    }

    private async getCollections(req: Request, res: Response, next: NextFunction) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { collection: { CREATE_COLLECTION } }
        } = Helper;

        try {
            let data = req.body;
            data.user= req.user!;
            const result = await CollectionModel.getCollection(data);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { data: result });
        } catch (error: any) {
            return sendError(res, { status: 400, error });
        }
    }

    private async isSlugExisted(req: Request, res: Response, next: NextFunction) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { collection: { CREATE_COLLECTION } }
        } = Helper;

        try {
            const query: any = req.query!;
            const result = await CollectionModel.isExternalLinkExist(query);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { message: CREATE_COLLECTION });
        } catch (error: any) {
            return sendError(res, { status: 400, error });
        }
    }

}

export default CollectionController;