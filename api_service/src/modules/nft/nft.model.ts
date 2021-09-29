import { Helper } from '../../helpers';
import Nft from './nft.schema';
import TransactionModel from '../transaction/transaction.model';

class NftModel {

    constructor() { }

    public async add(_nft:any): Promise<any> {
        const { 
            Validate: { _validations }, 
            Response: { errors },
            ResMsg: { 
                errors: { ALL_FIELDS_ARE_REQUIRED, SOMETHING_WENT_WRONG }
            }
        } = Helper;
        try {
            const { user, name, description, nftAddress, fileType, fileHash, externalLink, tokenUri, supply, royality, networkId, tokenId, collectiondb, transactionHash } = _nft;
            const nft:any = new Nft();
            nft.owner = user['_id'];
            nft.creator = user['_id'];
            nft.status = "PROCESSING";
            nft.name = name;
            nft.description = description;
            nft.nftAddress = nftAddress;
            nft.fileType = fileType;
            nft.fileHash = fileHash;
            nft.externalLink = externalLink;
            nft.tokenUri = tokenUri;
            nft.supply = supply;
            nft.royality = royality;
            nft.networkId = networkId;
            nft.tokenId = tokenId;
            nft.collectiondb = collectiondb;
            nft.transactionHash = transactionHash;

            const saveData = await nft.save();
            const data = {
                user,
                nftAddress: nft.nftAddress,
                nft: saveData['_id'],
                networkId: nft.networkId,
                transactionType: 'MINT',
                status: "PROCESSING",
                token: 'eth',
                amount: 0,
                transactionHash: transactionHash
            }
            TransactionModel.add(data);
            return saveData;
        } catch (error) {
            throw error;
        }
    }

    public async getNFT(id: any): Promise<any> {
        const { 
            Validate: { _validations }, 
            Response: { errors },
            ResMsg: { 
                errors: { ALL_FIELDS_ARE_REQUIRED, SOMETHING_WENT_WRONG }
            }
        } = Helper;
        try {
            const nft: any = await Nft.findOne({_id: id});
            if(nft) {
                if(nft.status == 'PROCESSING') {
                    const result = await Helper.Web3Helper.getTransactionStatus(nft.transactionHash);
                    if(result && result.status) {
                        nft.status = 'COMPLETED';
                        nft.save();
                        return {
                            data : nft,
                            status : 1,
                            message : 'Transaction completed'
                        };
                    } else if(result === null) {
                        return {
                            data: {},
                            status: 0,
                            message: 'Transaction in progress'
                        }
                    } else if(result && !result.status) {
                        nft.status = 'FAILED';
                        nft.save();
                        return {
                            data : {},
                            status: 2,
                            message : 'Transaction failed'
                        };
                    }
                }
                return {
                    data : nft,
                    status : 1,
                    message : 'Transaction completed'
                }
            } else {
                return {
                    data : {},
                    message: 'Record does not exist'
                }
            }
        } catch (error) {
            throw error;
        }
    }

}

export default new NftModel();