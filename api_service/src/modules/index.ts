import WalletController from "./mintTokens/mintToken.controller";
import NftController from "./nft/nft.controller";
import TransactionController from "./transaction/transaction.controller";
import UserController from "./user/user.controller";
import CollectionController from "./collections/collection.controller";
import SellController from "./sell/sell.controller";

export default [
    new WalletController(),
    new UserController(),
    new TransactionController(),
    new NftController(),
    new CollectionController(),
    new SellController()
]