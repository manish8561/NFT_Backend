import { Helper } from '../../helpers';
import Nft from './nft.schema';
import TransactionModel from '../transaction/transaction.model';

class NftModel {

    constructor() { }

    public async add(_nft:any):Promise<any> {
        const { 
            Validate: { _validations }, 
            Response: { errors },
            ResMsg: { 
                errors: { ALL_FIELDS_ARE_REQUIRED, SOMETHING_WENT_WRONG }
            }
        } = Helper;
        try {
            const { user, name, description, nftAddress, fileType, fileHash, externalLink, tokenUri, supply, royality, networkId, status, tokenId, collectiondb, transactionHash } = _nft;
            const nft:any = new Nft();
            nft.owner = user['_id'];
            nft.creator = user['_id'];
            nft.status = status;
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
            const saveData = await nft.save();
            const data = {
                user,
                nftAddress: nft.nftAddress,
                nft: saveData['_id'],
                networkId: nft.networkId,
                transactionType: 'MINT',
                status: nft.status,
                token: 'eth',
                amount: 0,
                transactionHash
            }
            TransactionModel.add(data);
            return saveData;
        } catch (error) {
            throw error;
        }
    }
}

export default new NftModel();