import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export const listCategoriesTool: ToolDef = {
  name: "list_categories",
  description: "Lista todas las categorías ordenadas por nombre",
  handler: async () => api.get("/categories"),
};

export const getCategoryTool: ToolDef = {
  name: "get_category",
  description: "Obtiene una categoría por su ID",
  inputSchema: { id: z.number().int() },
  handler: async ({ id }: any) => api.get(`/categories/${id}`),
};

export const createCategoryTool: ToolDef = {
  name: "create_category",
  description: "Crea una nueva categoría (requiere admin)",
  inputSchema: { name: z.string().min(1).max(128) },
  handler: async (args: any) => api.post("/categories", args),
};

export const updateCategoryTool: ToolDef = {
  name: "update_category",
  description: "Actualiza el nombre de una categoría (requiere admin)",
  inputSchema: { id: z.number().int(), name: z.string().min(1).max(128) },
  handler: async ({ id, ...body }: any) => api.put(`/categories/${id}`, body),
};

export const deleteCategoryTool: ToolDef = {
  name: "delete_category",
  description: "Elimina una categoría existente (requiere admin)",
  inputSchema: { id: z.number().int() },
  handler: async ({ id }: any) => api.del(`/categories/${id}`),
};