"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalUsersGateway = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
class LocalUsersGateway {
    users = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(process.cwd(), 'src/users/data/users.json'), 'utf8'));
    async fetchAll() { return this.users; }
    async fetchById(id) { return this.users.find(u => u.id === id); }
}
exports.LocalUsersGateway = LocalUsersGateway;
//# sourceMappingURL=local-users.gateway.js.map