import authTools from "./auth";
import type { ToolDef } from "../tool-factory";
import {
  listProductsTool,
  getProductTool,
  createProductTool,
  updateProductTool,
  deleteProductTool,
} from "./products";
import {
  listCategoriesTool,
  getCategoryTool,
  createCategoryTool,
  updateCategoryTool,
  deleteCategoryTool,
} from "./categories";
import {
  listUsersTool,
  updateUserRoleTool,
  updateMyPasswordTool,
  updateMyEmailTool,
} from "./users";

export default [
  ...authTools,
  listProductsTool,
  getProductTool,
  createProductTool,
  updateProductTool,
  deleteProductTool,
  listCategoriesTool,
  getCategoryTool,
  createCategoryTool,
  updateCategoryTool,
  deleteCategoryTool,
  listUsersTool,
  updateUserRoleTool,
  updateMyPasswordTool,
  updateMyEmailTool
] as ToolDef[];
