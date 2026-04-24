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


}
