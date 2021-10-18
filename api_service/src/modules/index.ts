import WalletController from "./mintTokens/mintToken.controller";
import NftController from "./nft/nft.controller";
import TransactionController from "./transaction/transaction.controller";
import UserController from "./user/user.controller";
import CollectionController from "./collections/collection.controller";
import SellController from "./sell/sell.controller";
import BuyController from "./buy/buy.controller";
import AdminController from "./admin/admin.controller";
import CategoryController from "./categories/category.controller";
import BiddingController from "./bidding/bidding.controller";

export default [
    new WalletController(),
    new UserController(),
    new TransactionController(),
    new NftController(),
    new CollectionController(),
    new SellController(),
    new BuyController(),
    new AdminController(),
    new CategoryController(),
    new BiddingController()
]