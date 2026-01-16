import { Model } from 'mongoose';
import { User } from './schemas/users.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    findOne(email: string): Promise<User | undefined>;
    findById(id: string): Promise<User | undefined>;
}
