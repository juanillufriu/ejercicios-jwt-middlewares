import axios from 'axios';
import { ExternalUser } from '../user.types';
import { UsersGateway } from './users.gateway';

export class JsonPlaceholderUsersGateway implements UsersGateway {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com/users';

  async fetchAll(): Promise<ExternalUser[]> {
    const { data } = await axios.get<ExternalUser[]>(this.baseUrl);
    return data;
  }

  async fetchById(id: number): Promise<ExternalUser | undefined> {
    try {
      const { data } = await axios.get<ExternalUser>(`${this.baseUrl}/${id}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
      throw error;
    }
  }
}
