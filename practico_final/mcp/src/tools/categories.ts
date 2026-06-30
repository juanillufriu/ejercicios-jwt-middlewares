import { z } from "zod";
import { api } from "../api-client";

export const listCategoriesTool = {
  name: "list_categories",
  description: "Lista todas las categorías ordenadas alfabéticamente.",
  inputSchema: z.object({}),
  handler: async () => {
    return await api.get("/categories");
  },
};

export const getCategoryTool = {
  name: "get_category",
  description: "Obtiene una categoría específica mediante su ID.",
  inputSchema: z.object({
    id: z.number().int(),
  }),
  handler: async (args: { id: number }) => {
    return await api.get(`/categories/${args.id}`);
  },
};

export const createCategoryTool = {
  name: "create_category",
  description: "Crea una nueva categoría de productos (Requiere rol Admin).",
  inputSchema: z.object({
    name: z.string().min(1).max(128),
  }),
  handler: async (args: any) => {
    return await api.post("/categories", args);
  },
};

export const updateCategoryTool = {
  name: "update_category",
  description: "Actualiza el nombre de una categoría existente (Requiere rol Admin).",
  inputSchema: z.object({
    id: z.number().int(),
    name: z.string().min(1).max(128),
  }),
  handler: async ({ id, ...body }: { id: number; name: string }) => {
    return await api.put(`/categories/${id}`, body);
  },
};

export const deleteCategoryTool = {
  name: "delete_category",
  description: "Elimina una categoría existente mediante su ID (Requiere rol Admin).",
  inputSchema: z.object({
    id: z.number().int(),
  }),
  handler: async (args: { id: number }) => {
    return await api.del(`/categories/${args.id}`);
  },
};
