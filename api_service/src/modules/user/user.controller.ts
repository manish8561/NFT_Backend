import { Response, Request, Router } from "express";
var nodemailer = require('nodemailer');
import * as Interfaces from '../../interfaces';
import UserModel from "./user.model";
import { Helper } from '../../helpers';
import ValidateJWT from "../../middlewares/jwt.middleware";
import ValidateAdminJWT from "../../middlewares/admin.middleware";

class UserController implements Interfaces.Controller {

    public path = "/user";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }
    
    private async initializeRoutes() {
        this.router
            .all(`${this.path}/*`)
            .post(`${this.path}/loginUserOrMaybeRegister`, this.loginUserOrMaybeRegister)
            .get(`${this.path}/details`, ValidateJWT, this.details)
            .post(`${this.path}/updateProfile`, ValidateJWT, this.updateUser)
            .post(`${this.path}/verification`, ValidateJWT, this.sendVerificationEmail)
            .post(`${this.path}/updateVerificationStatus`, ValidateJWT, this.updateVerificationStatus)
            .post(`${this.path}/getUsers`, ValidateAdminJWT, this.fetchUsers)
    }
    /**
     * @param  {Request} req
     * @param  {Response} res
     */
    private async loginUserOrMaybeRegister(req: Request, res: Response) {
        const { Response: { sendError, sendSuccess }, ResMsg: { errors: { SOMETHING_WENT_WRONG }} } = Helper;

        try {
            let result = await UserModel.loginUserOrMaybeRegister(req.body);
            if (result.error) return sendError(res, { status: 400, error: result.error });
            const token: string = await UserModel.generateJwtToken(result);
            return sendSuccess(res, { message: 'SUCCESS', token });
        } catch (error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
    /**
     * @param  {Request} req
     * @param  {Response} res
     */
    private async details(req: any, res: Response) {
        const { Response: { sendError, sendSuccess }, ResMsg: { errors: { SOMETHING_WENT_WRONG }} } = Helper;
        try {
            const { _id } = req.user!;
            let result = await UserModel.details(_id);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { message: 'SUCCESS', data: result });
        } catch (error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
    /**
     * @param  {Request|any} req
     * @param  {Response} res
     */
    private async updateUser(req: Request | any, res: Response) {
        const { 
            Response: { sendError, sendSuccess },
            ResMsg: { common: { NO_DATA }, errors: { SOMETHING_WENT_WRONG } }
         } = Helper;
        
        try {
            if (!Object.keys(req.body).length) {
                return sendError(res, { status: 400, error: { message: NO_DATA } });
            }
            let data: any = req.body;
            data.user = req.user!
            let result = await UserModel.updateUserProfile(data);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { message: 'SUCCESS', data: result });
        } catch(error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
    /**
     * @param  {Request} req
     * @param  {Response} res
     */
    private async sendVerificationEmail(req: Request, res: Response) {
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'antiersolutionss@gmail.com',//replace with your email
                pass: 'antier123'//replace with your password
            }
        });
        var mailOptions = {
            from: 'antiersolutionss@gmail.com',//replace with your email
            to: req.body.email,//replace with your email
            subject: `Verification code`,
            html:`<p>Verification code is</p>
            <b> name:${verificationCode} </b><br>`
        };
        transporter.sendMail(mailOptions, function(error: any, info: any){
            if (error) {
                res.send({status: 400, message: 'Error'}) 
            }
            else {
                res.send({ status: 200,message: 'Sent Successfully' })
            }
        });    
    }
    /**
     * @param  {Request|any} req
     * @param  {Response} res
     */
    private async updateVerificationStatus(req: Request | any, res: Response) {
        const { 
            Response: { sendError, sendSuccess },
            ResMsg: { common: { NO_DATA }, errors: { SOMETHING_WENT_WRONG } }
         } = Helper;
        try {
            if (!req.user) {
                return sendError(res, { status: 400, error: { message: NO_DATA } });
            }
            let data:any = req.user;
            let result = await UserModel.updateUserVerifyStatus(data);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { message: 'SUCCESS', data: result });
        } catch(error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }
    /**
     * @param  {Request|any} req
     * @param  {Response} res
     */
    private async fetchUsers(req: Request | any, res: Response) {
        const { 
            Response: { sendError, sendSuccess },
            ResMsg: { errors: { SOMETHING_WENT_WRONG }}
         } = Helper;
        try {
            let result = await UserModel.fetchAllUsers(req.body);
            if (result.errors) return sendError(res, { status: 400, error: result.errors });
            return sendSuccess(res, { message: 'SUCCESS', data: result });
        } catch(error: any) {
            return sendError(res, { status: 400, error: Object.keys(error).length ? error : { message: SOMETHING_WENT_WRONG } });
        }
    }


}

export default UserController;