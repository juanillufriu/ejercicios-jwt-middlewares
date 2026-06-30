import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export const listUsersTool: ToolDef = {
  name: "list_users",
  description: "Lista todos los usuarios registrados (requiere admin)",
  handler: async () => api.get("/users"),
};

export const updateUserRoleTool: ToolDef = {
  name: "update_user_role",
  description: "Cambia el rol de un usuario (requiere admin). No se puede cambiar el propio rol ni degradar al único admin",
  inputSchema: {
    id: z.string(),
    role: z.enum(["user", "admin"]),
  },
  handler: async ({ id, role }: any) => api.patch(`/users/${id}/role`, { role }),
};

export const updateMyPasswordTool: ToolDef = {
  name: "update_my_password",
  description: "Cambia la contraseña del usuario autenticado",
  inputSchema: {
    currentPassword: z.string(),
    newPassword: z.string().min(8),
  },
  handler: async (args: any) => api.patch("/users/me/password", args),
};

export const updateMyEmailTool: ToolDef = {
  name: "update_my_email",
  description: "Cambia el email del usuario autenticado",
  inputSchema: {
    newEmail: z.string().email(),
    password: z.string(),
  },
  handler: async (args: any) => api.patch("/users/me/email", args),
};