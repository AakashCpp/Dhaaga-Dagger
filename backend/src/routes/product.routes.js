import { Router } from "express";
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from "../controllers/product.controller.js";
import { requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createProductSchema, productIdSchema, updateProductSchema } from "../validation/schemas.js";

export const productRouter = Router();
productRouter.get("/", listProducts);
productRouter.get("/:id", validate(productIdSchema), getProduct);

export const adminProductRouter = Router();
adminProductRouter.use(requireAdmin);
adminProductRouter.get("/", listProducts);
adminProductRouter.get("/:id", validate(productIdSchema), getProduct);
adminProductRouter.post("/", validate(createProductSchema), createProduct);
adminProductRouter.put("/:id", validate(updateProductSchema), updateProduct);
adminProductRouter.delete("/:id", validate(productIdSchema), deleteProduct);

