import { ExternalUser } from '../user.types';
import { UsersGateway } from './users.gateway';
export declare class LocalUsersGateway implements UsersGateway {
    private users;
    fetchAll(): Promise<ExternalUser[]>;
    fetchById(id: number): Promise<ExternalUser | undefined>;
}
