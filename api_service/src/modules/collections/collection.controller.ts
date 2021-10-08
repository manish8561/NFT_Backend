import { Response, Request, Router } from "express";
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
            .post(`${this.path}/getItemsByCollectionId`, ValidateJWT, this.getItemsById)
            .post(`${this.path}/:id`, ValidateJWT, this.collectionByIdData)
            .get(`${this.path}/isSlugExisted`, ValidateJWT, this.isSlugExisted)
    }
    /**
     * @param  {any} req
     * @param  {Response} res
     */
    private async add(req: any, res: Response) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { collection: { CREATE_COLLECTION }, errors: { SOMETHING_WENT_WRONG } }
        } = Helper;

        try {
            const { _id } = req.user!;
            let _collection = req.body;
            _collection.user = _id;
            const result = await CollectionModel.createCollection(_collection);
            if (result.error) return sendError(res, { status: 400, error: result.error });
            return sendSuccess(res, { message: CREATE_COLLECTION });
        } catch (error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
    /**
     * @param  {any} req
     * @param  {Response} res
     */
    private async getCollections(req: any, res: Response) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { collection: { CREATE_COLLECTION }, errors: { SOMETHING_WENT_WRONG } }
        } = Helper;

        try {
            let data = req.body;
            data.user= req.user!;
            const result = await CollectionModel.getCollection(data);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { data: result, message: CREATE_COLLECTION });
        } catch (error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
    /**
     * @param  {Request} req
     * @param  {Response} res
     */
    private async collectionByIdData(req: Request, res: Response) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { errors: { SOMETHING_WENT_WRONG }}
        } = Helper;

        try {
            const id: any = req.params.id;
            const result = await CollectionModel.getCollectionDataById(id);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { data: result });
        } catch (error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
    /**
     * @param  {Request} req
     * @param  {Response} res
     */
    private async getItemsById(req: Request, res: Response) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { errors: { SOMETHING_WENT_WRONG }}
        } = Helper;
        try {
            const error = { message:'Enter complete parameters' };

            if(Object.keys(req.body).length <= 0) {
                return sendError(res, { status: 400, error })
            }
            const result = await CollectionModel.getItemsByCollectionId(req.body);
            if(result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { data: result });
        } catch (error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
    /**
     * @param  {Request} req
     * @param  {Response} res
     */
    private async isSlugExisted(req: Request, res: Response) {
        const {
            Response: { sendError, sendSuccess },
            ResMsg: { collection: { CREATE_COLLECTION }, errors: { SOMETHING_WENT_WRONG } }
        } = Helper;

        try {
            const query: any = req.query!;
            const result = await CollectionModel.isExternalLinkExist(query);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { message: CREATE_COLLECTION });
        } catch (error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }

}

export default CollectionController;