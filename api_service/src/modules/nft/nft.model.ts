import { Helper } from '../../helpers';
import Nft from './nft.schema';

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
            const {user, name, description, nftAddress, fileType, fileHash, externalLink, tokenUri, supply, royality, networkId, status, tokenId, collectiondb } = _nft;
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

            return await nft.save();
        } catch (error) {
            throw error;
        }
    }

  
}

export default new NftModel();