"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonPlaceholderUsersGateway = void 0;
const axios_1 = require("axios");
class JsonPlaceholderUsersGateway {
    baseUrl = 'https://jsonplaceholder.typicode.com/users';
    async fetchAll() {
        const { data } = await axios_1.default.get(this.baseUrl);
        return data;
    }
    async fetchById(id) {
        try {
            const { data } = await axios_1.default.get(`${this.baseUrl}/${id}`);
            return data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                return undefined;
            }
            throw error;
        }
    }
}
exports.JsonPlaceholderUsersGateway = JsonPlaceholderUsersGateway;
//# sourceMappingURL=jsonplaceholder-users.gateway.js.map