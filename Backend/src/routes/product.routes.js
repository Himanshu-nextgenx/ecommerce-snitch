import { Router } from "express";
import { upload } from "../services/storage.service.js";
import { createProduct } from "../controllers/product.controller.js";
import { isSeller } from "../middlewares/auth.middleware.js";
import { createProductValidator } from "../validators/product.validator.js";
const productRouter = Router();


productRouter.post("/" , upload.array("images", 6), isSeller,createProductValidator, createProduct )

export default productRouter;