import WalletController from "./mintTokens/mintToken.controller";
import UserController from "./user/user.controller";

export default [
    new WalletController(),
    new UserController()
]