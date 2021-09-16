import mongoose from 'mongoose';

interface User {
    address: string,
    role: string,
    status: string,
}

export default User;