import mongoose, { Schema } from 'mongoose';

interface Collection extends Schema {
    name: string;
    externalLink: string;
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
    paymentToken: Array<string>;
    sensitiveContent: string;
    status: string;
    user: mongoose.Types.ObjectId;
}

export default Collection;