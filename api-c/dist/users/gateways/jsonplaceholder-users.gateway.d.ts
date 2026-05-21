import { ExternalUser } from '../user.types';
import { UsersGateway } from './users.gateway';
export declare class JsonPlaceholderUsersGateway implements UsersGateway {
    private readonly baseUrl;
    fetchAll(): Promise<ExternalUser[]>;
    fetchById(id: number): Promise<ExternalUser | undefined>;
}
