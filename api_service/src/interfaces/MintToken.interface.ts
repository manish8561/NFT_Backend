
interface MintToken {
    user: string;
    tokenId: string;
    tokenAmount: string;
    tokenUri: string;
    timestamp: Number;
    page?: number | string;
    limit?: number | string;
};

export default MintToken;