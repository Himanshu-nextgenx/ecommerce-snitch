import productModel from "../models/product.model.js";
import { uploadImage } from "../services/storage.service.js";

export const createProduct = async (req, res) => {
  try {
    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;
    const images = await Promise.all(
      req.files.map(async (file) => {
        return await uploadImage({
          buffer: file.buffer,
          fileName: file.originalname,
        });
      }),
    );
    const product = await productModel.create({
      title,
      description,
      price: {
        amount: priceAmount,
        currency: priceCurrency,
      },
      seller: seller.id,
      images,
    });
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getSellerProducts = async (req, res) => {
  const seller = req.user;
  try {
    const products = await productModel.find({ seller: seller.id });
    res.status(200).json({
      message: "seller product get successfully ",
      products,
    });
  } catch (error) {
    res.status(400).json({
      message: "not found  ",
      error,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json({
      message: "All product get successfully ",
      products,
    });
  } catch (error) {
    res.status(400).json({
      message: "not found  ",
      error,
    });
  }
};
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.status(200).json({
      message: "Product get successfully ",
      product,
    });
  } catch (error) {
    res.status(400).json({
      message: "not found  ",
      error,
    });
  }
};

export const addProductVariant = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(req.body, "body")

    const product = await productModel.findOne({
      _id: productId,
      seller: req.user._id || req.user.id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // ================== IMAGES ==================
    const files = req.files;
    let images = [];

    if (files?.length) {
      const uploaded = await Promise.all(
        files.map((file) =>
          uploadImage({
            buffer: file.buffer,
            fileName: file.originalname,
          })
        )
      );
      images = uploaded;
    }

    // ================== BASIC DATA ==================
    const price = req.body.priceAmount;
    const stock = req.body.stock;
    const currency = req.body.priceCurrency || product.price.currency;

    // ================== ATTRIBUTES ==================
    let attributes = {};
    try {
      attributes = req.body.attributes
        ? JSON.parse(req.body.attributes)
        : {};
    } catch {
      return res.status(400).json({ message: "Invalid attributes format" });
    }

    // ================== SIZES ==================
    let sizes = [];

    try {
      if (req.body.sizes) {
        sizes = Array.isArray(req.body.sizes)
          ? req.body.sizes
          : JSON.parse(req.body.sizes);
      } else if (req.body.size) {
        sizes = [req.body.size];
      }
    } catch {
      return res.status(400).json({ message: "Invalid sizes format" });
    }

    if (!sizes.length) {
      return res.status(400).json({
        message: "Please select at least one size.",
      });
    }

    // ================== HELPER ==================
    const isSameAttributes = (a, b) => {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);

      if (keysA.length !== keysB.length) return false;

      return keysA.every((key) => a[key] === b[key]);
    };

    // ================== CREATE VARIANTS ==================
    for (const size of sizes) {
      const exists = product.variants.find(
        (v) =>
          v.size === size && isSameAttributes(v.attributes, attributes)
      );

      if (exists) continue;

      product.variants.push({
        size,
        price: {
          amount: price ? Number(price) : product.price.amount,
          currency,
        },
        stock: Number(stock) || 0,
        attributes,
        images,
      });
    }

    await product.save();

    return res.status(201).json({
      message: "Variant(s) added successfully.",
      product,
    });
  } catch (error) {
    console.error("ADD VARIANT ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};