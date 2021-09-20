import { Schema } from 'mongoose';

interface Social {
    twitter: string,
    insta: string,
    website: string,
}

interface User extends Schema {
    wallet: string;
    walletAddress: string;
    networkId: string;
    username: string,
    email: string;
    bio: string;
    socialLinks: Social,
}

export {
    Social,
    User
} ;