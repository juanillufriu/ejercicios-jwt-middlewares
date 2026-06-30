import { z } from "zod";
import { api } from "../api-client";

export const listUsersTool = {
  name: "list_users",
  description: "Lista todos los usuarios registrados en el sistema (Requiere rol Admin).",
  inputSchema: z.object({}),
  handler: async () => {
    return await api.get("/users");
  },
};

export const updateUserRoleTool = {
  name: "update_user_role",
  description: "Cambia el rol de un usuario específico a 'user' o 'admin' (Requiere rol Admin).",
  inputSchema: z.object({
    id: z.string().uuid(),
    role: z.enum(["user", "admin"]),
  }),
  handler: async ({ id, ...body }: { id: string; role: string }) => {
    return await api.patch(`/users/${id}/role`, body);
  },
};

export const updateMyPasswordTool = {
  name: "update_my_password",
  description: "Cambia la contraseña del usuario actualmente autenticado.",
  inputSchema: z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8),
  }),
  handler: async (args: any) => {
    return await api.patch("/users/me/password", args);
  },
};

export const updateMyEmailTool = {
  name: "update_my_email",
  description: "Cambia el correo electrónico del usuario actualmente autenticado.",
  inputSchema: z.object({
    newEmail: z.string().email(),
    password: z.string(),
  }),
  handler: async (args: any) => {
    return await api.patch("/users/me/email", args);
  },
};
