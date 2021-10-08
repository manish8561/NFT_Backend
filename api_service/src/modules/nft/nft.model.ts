import { Helper } from '../../helpers';
import Nft from './nft.schema';
import TransactionModel from '../transaction/transaction.model';
import ABI from '../../bin/abi.json';

class NftModel {
    contractAddress = '0x1522b379cB78eAF13bbCCd9b649ceC1D22e27B6A';
    constructor() { }
    /**
     * @param  {any} _nft
     * @returns Promise
     */
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
                token: 'ETH',
                amount: 0,
                transactionHash: transactionHash
            }

            TransactionModel.add(data);
            return saveData;
        } catch (error) {
            throw error;
        }
    }
    /**
     * @param  {any} id
     * @returns Promise
     */
    public async getNFT(id: any): Promise<any> {
        const { 
            Validate: { _validations }, 
            Response: { errors },
            ResMsg: { 
                errors: { ALL_FIELDS_ARE_REQUIRED, SOMETHING_WENT_WRONG }
            }
        } = Helper;
        try {
            const nft: any = await Nft.findOne({_id: id}).populate('collectiondb', 'name').populate('creator','username walletAddress')
            .populate('owner','username walletAddress');
            if(nft) {
                if(nft.status === 'PROCESSING') {
                    const result = await Helper.Web3Helper.getTransactionStatus(nft.transactionHash);
                    if(result && result.status) {
                       if(nft.tokenId === 0){
                            let contract = await Helper.Web3Helper.getContractObject(this.contractAddress, ABI);
                            if(contract && contract.methods) {
                                const tokenId = await contract.methods.uriToTokenId(nft.tokenUri).call();
                                nft.tokenId = Number(tokenId);
                            }
                        }
                        nft.status = 'COMPLETED';
                        nft.save();
                        TransactionModel.setTransactionStatus({transactionHash: nft.transactionHash, status: 'COMPLETED'});
                        return {
                            data : nft,
                            status : 1,
                            message : 'Transaction completed'
                        };
                    } else if(result === null) {
                        TransactionModel.setTransactionStatus({transactionHash: nft.transactionHash, status: 'PROCESSING'});
                        return {
                            data: {},
                            status: 0,
                            message: 'Transaction in progress'
                        }
                    } else if(result && !result.status) {
                        nft.status = 'FAILED';
                        nft.save();
                        TransactionModel.setTransactionStatus({transactionHash: nft.transactionHash, status: 'FAILED'});
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
    /**
     * @param  {any} data
     * @returns Promise
     */
    public async searchNft(data: any): Promise<any> {
        try {
            let query: any = { status: { $eq: 'COMPLETED' } };
            let { page, limit, filters } = data;
            page = Number(page) || 1;
            limit = Number(limit) || 10;
            if(filters && filters.search) {
                let { search } = filters;
                search = search.toString();
                query = { $or : [
                    { name: new RegExp(search, 'i') },
                    { transactionHash: new RegExp(search, 'i') },
                    { tokenId: new RegExp(search, 'i') },
                    { networkId: new RegExp(search, 'i') },
                    { description: new RegExp(search, 'i') }
                ]};
                query.status = { $eq: 'COMPLETED' };
            }
            const count = await Nft.countDocuments(query);
            const result = await Nft.find(query).skip((page-1) * limit).populate('creator', 'username email' ).populate('collectiondb', 'name').limit(limit).sort({ createdAt: -1 });
            return {
                count,
                result
            };
        } catch(error: any) {
            throw error;
        }
    }
}

export default new NftModel();