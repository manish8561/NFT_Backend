import { Schema } from 'mongoose';

interface Collection extends Schema {
    name: string;
    url: string;
    description: string;
    logo: string;
    banner: string;
    featuredBanner: string;
    category: string;
    links: Array<string>;
    royality: string;
    payoutWalletAddress: string;
    collaborators: Array<string>;
    blockChain: string;
    displayTheme: string;
    paymentTokens: Array<string>;
    sensitiveContent: string;
}

export default Collection;