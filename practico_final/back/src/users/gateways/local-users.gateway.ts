import { readFileSync } from 'fs';
import { join } from 'path';
import { ExternalUser } from '../user.types';
import { UsersGateway } from './users.gateway';

export class LocalUsersGateway implements UsersGateway {
 private users: ExternalUser[] = JSON.parse(readFileSync(join(process.cwd(),'src/users/data/users.json'),'utf8'));
 async fetchAll(): Promise<ExternalUser[]> { return this.users; }
 async fetchById(id: number): Promise<ExternalUser | undefined> { return this.users.find(u=>u.id===id); }
}
