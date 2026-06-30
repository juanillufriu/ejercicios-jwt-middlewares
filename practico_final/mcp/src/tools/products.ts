import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export const listProductsTool: ToolDef = {
  name: "list_products",
  description: "Lista productos con filtros opcionales y paginación",
  inputSchema: {
    name: z.string().optional(),
    sortBy: z.enum(["id", "name", "price", "stock"]).optional(),
    order: z.enum(["ASC", "DESC"]).optional(),
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(100).optional(),
  },
  handler: async (args: any) => api.get("/products", { params: args }),
};

export const getProductTool: ToolDef = {
  name: "get_product",
  description: "Obtiene un producto por su ID",
  inputSchema: { id: z.number().int() },
  handler: async ({ id }: any) => api.get(`/products/${id}`),
};

export const createProductTool: ToolDef = {
  name: "create_product",
  description: "Crea un nuevo producto (requiere admin)",
  inputSchema: {
    name: z.string().max(256),
    price: z.number().positive(),
    stock: z.number().int().min(0).optional(),
    categoryId: z.number().int().nullable().optional(),
  },
  handler: async (args: any) => api.post("/products", args),
};

export const updateProductTool: ToolDef = {
  name: "update_product",
  description: "Actualiza un producto existente (requiere admin)",
  inputSchema: {
    id: z.number().int(),
    name: z.string().max(256).optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().min(0).optional(),
    categoryId: z.number().int().nullable().optional(),
  },
  handler: async ({ id, ...body }: any) => api.put(`/products/${id}`, body),
};

export const deleteProductTool: ToolDef = {
  name: "delete_product",
  description: "Elimina un producto existente (requiere admin)",
  inputSchema: { id: z.number().int() },
  handler: async ({ id }: any) => api.del(`/products/${id}`),
};