import { z } from "zod";
import { api } from "../api-client";

export const listProductsTool = {
  name: "list_products",
  description: "Lista productos con filtros opcionales de búsqueda, paginación y ordenamiento.",
  inputSchema: z.object({
    name: z.string().optional(),
    sortBy: z.enum(["id", "name", "price", "stock"]).optional(),
    order: z.enum(["ASC", "DESC"]).optional(),
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(100).optional(),
  }),
  handler: async (args: any) => {
    // EN GET: Se envían los query params envolviéndolos en un objeto 'params' para Axios
    return await api.get("/products", { params: args });
  },
};

export const getProductTool = {
  name: "get_product",
  description: "Obtiene los detalles de un producto específico mediante su ID.",
  inputSchema: z.object({
    id: z.number().int(),
  }),
  handler: async (args: { id: number }) => {
    return await api.get(`/products/${args.id}`);
  },
};

export const createProductTool = {
  name: "create_product",
  description: "Crea un nuevo producto (Requiere rol Admin).",
  inputSchema: z.object({
    name: z.string().max(256),
    price: z.number().positive(),
    stock: z.number().int().nonnegative().optional(),
    categoryId: z.number().int().nullable().optional(),
  }),
  handler: async (args: any) => {
    return await api.post("/products", args);
  },
};

export const updateProductTool = {
  name: "update_product",
  description: "Actualiza uno o varios campos de un producto existente (Requiere rol Admin).",
  inputSchema: z.object({
    id: z.number().int(),
    name: z.string().max(256).optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    categoryId: z.number().int().nullable().optional(),
  }),
  handler: async ({ id, ...body }: { id: number; [key: string]: any }) => {
    return await api.put(`/products/${id}`, body);
  },
};

export const deleteProductTool = {
  name: "delete_product",
  description: "Elimina un producto del sistema a partir de su ID (Requiere rol Admin).",
  inputSchema: z.object({
    id: z.number().int(),
  }),
  handler: async (args: { id: number }) => {
    // IMPORTANTE: Tu clase exporta el método como 'del', no como 'delete'
    return await api.del(`/products/${args.id}`);
  },
};
