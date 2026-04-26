import { Router } from "express";
import { upload } from "../services/storage.service.js";
import {
  addProductVariant,
  createProduct,
  getAllProducts,
  getProductById,
  getSellerProducts,
} from "../controllers/product.controller.js";
import { isSeller } from "../middlewares/auth.middleware.js";
import { createProductValidator } from "../validators/product.validator.js";
const productRouter = Router();

productRouter.post(
  "/",
  upload.array("images", 6),
  isSeller,
  createProductValidator,
  createProduct,
);
productRouter.get("/seller", isSeller, getSellerProducts);
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.post(
  "/:id/variants",
  upload.array("variantImages", 6),
  isSeller,
  addProductVariant,
);
export default productRouter;
