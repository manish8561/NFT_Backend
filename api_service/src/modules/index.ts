import WalletController from "./mintTokens/mintToken.controller";
import NftController from "./nft/nft.controller";
import TransactionController from "./transaction/transaction.controller";
import UserController from "./user/user.controller";

export default [
    new WalletController(),
    new UserController(),
    new TransactionController(),
    new NftController(),
]